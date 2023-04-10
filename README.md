# html2pdf
Convert HTML to PDF.

## Examples
[basic demo](http://weilao.github.io/vue-swiper/demo)

## Install
```
npm i html2pdf-dbs -S
```

## Usage

```js
<script lang="ts" setup>
import { htmlToPdf } from "html2pdf-dbs";
```

```html
<el-button @click="htmlToPdf('elementId', 'fileNme', {isSetWatermark: true, userName: '张三'})" type="primary">
    下载
</el-button>
```

## Api
### Properties
| Name                 | Type      | Default      | Description                                                        |
|----------------------|-----------|--------------|--------------------------------------------------------------------|
| elementId            | `String`  | `""` | 需要转换的html父元素ID       |
| fileNme              | `String`  | `""` | 下载到本地的文件名称          |
| isSetWatermark       | `Boolean` | `false` | 下载到本地的文件是否加水印  |
| userName             | `String`  | `获取localStorage下userInfo.name` | 水印文案（userName yyyy-MM-dd）|