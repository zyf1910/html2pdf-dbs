import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'
let personName = ""
let watermark = {};
let setWatermark = (
  displaytext,
  cansWidth,
  cansHeight,
  cansRotate,
  cansFont,
  cansfillBG,
  cansfillTextAlign,
  uniqueId,
  domId
) => {
  let id = uniqueId;
  //创建一个画布
  let can = document.createElement("canvas");
  //设置画布的长宽
  can.width = cansWidth || 300;
  can.height = cansHeight || 180;

  let cans = can.getContext("2d");
  //旋转角度
  cans.rotate((cansRotate * Math.PI) / 180);
  cans.font = `${cansFont}px Vedana`;
  //设置填充绘画的颜色、渐变或者模式
  cans.fillStyle = cansfillBG;
  //设置文本内容的当前对齐方式
  cans.textAlign = cansfillTextAlign;
  //设置在绘制文本时使用的当前文本基线
  cans.textBaseline = "Middle";
  //在画布上绘制填色的文本（输出的文本，开始绘制文本的X坐标位置，开始绘制文本的Y坐标位置）
  cans.fillText(
    typeof displaytext == "string" ? displaytext : displaytext.toString(),
    can.width / 4,
    can.height / 2
  );

  let div = document.createElement("div");
  div.id = id;
  div.style.pointerEvents = "none";
  div.style.top = "0px";
  div.style.left = "0px";
  div.style.position = "absolute";
  div.style.zIndex = "100000";
  div.style.width = '100%';
  div.style.height = '100%';
  div.style.background =
    "url(" + can.toDataURL("image/png") + ") left top repeat";
  if (domId == "body") {
    document.body.appendChild(div);
  } else {
    document.querySelector(domId).appendChild(div);
  }

  return id;
};

// 该方法只允许调用一次
/**
 * @description:
 * @param {*} displaytext 展示的水印文字
 * @param {*} cansWidth 单位画布宽
 * @param {*} cansHeight 单位画布高
 * @param {*} cansRotate 旋转角度
 * @param {*} cansFont 文字fonsSize
 * @param {*} cansfillBG 填充背景颜色
 * @param {*} cansfillTextAlign 文字对齐方式
 * @param {*} domId 要插入的dom
 */
let hostname = location.hostname;
watermark.set = ({
  displayText = hostname,
  cansWidth = 300,
  cansHeight = 180,
  cansRotate = -15,
  cansFont = 20,
  cansfillBG = "rgba(200, 200, 200, 0.8)",
  cansfillTextAlign = "left",
  uniqueId = "9876aas54321.123dffd456ass789.9876ga54321",
  domId = "body",
} = {}) => {
  setWatermark(
    displayText,
    cansWidth,
    cansHeight,
    cansRotate,
    cansFont,
    cansfillBG,
    cansfillTextAlign,
    uniqueId,
    domId
  );
};
export const htmlToPdf = function (elementId, fileName, watermarkConfig = {}) {
  if (!elementId) throw new Error("请传入元素id")
  const container = document.querySelector(`#${elementId}`)
  container.style.position = "relative"

  let watermarkEleId = "download-watermark-id"
  let date = new Date();
  // 获取年、月、日
  let year = date.getFullYear();
  let month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1，并且补零
  let day = String(date.getDate()).padStart(2, '0'); // 需要补零
  // 格式化为yyyy-MM-dd格式
  let formattedDate = year + '-' + month + '-' + day;
  if (watermarkConfig && watermarkConfig.isSetWatermark) {
    // 设置水印
    watermark.set({
      displayText: `${watermarkConfig.userName || personName} ${formattedDate}`, // 水印文案
      cansWidth: 300,
      cansHeight: 200,
      cansRotate: 10,
      uniqueId: watermarkEleId,
      domId: "#" + elementId,
    });
  }
  const canvas = document.createElement("canvas")
  const contentWidth = container.clientWidth
  const contentHeight = container.clientHeight
  const scale = window.devicePixelRatio
  const canvasCcale = 4
  canvas.width = contentWidth * canvasCcale;
  canvas.height = contentHeight * canvasCcale;
  canvas.getContext("2d").scale(canvasCcale/scale, canvasCcale/scale);
  const opts = {
    scale: scale,
    canvas: canvas,
    width: contentWidth,
    height: contentHeight,
    useCORS: true,
  };
  html2Canvas(container, opts).then(function (canvas) {
    let contentWidth = canvas.width
    let contentHeight = canvas.height
    let pageHeight = contentWidth / 592.28 * 841.89
    let leftHeight = contentHeight
    let position = 0
    let imgWidth = 595.28
    let imgHeight = 592.28 / contentWidth * contentHeight
    let pageData = canvas.toDataURL('image/jpeg', 1.0)
    let PDF = new JsPDF('', 'pt', 'a4')
    if (leftHeight < pageHeight) {
      PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
    } else {
      while (leftHeight > 0) {
        PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
        leftHeight -= pageHeight
        position -= 841.89
        if (leftHeight > 0) {
          PDF.addPage()
        }
      }
    }
    PDF.save(fileName + '.pdf')
    if (watermarkConfig && watermarkConfig.isSetWatermark) {
      container.removeChild(document.getElementById(watermarkEleId))
    }
  })
}
export default {
  install (Vue, options) {
    let userInfo = localStorage.getItem('userInfo')
    if (userInfo) userInfo = JSON.parse(userInfo)
    personName = userInfo.name
    Vue.prototype.htmlToPdf = htmlToPdf
  }
}