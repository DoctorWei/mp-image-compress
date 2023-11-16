# mp-image-compress 小程序图片压缩接口（图片压缩至指定大小），并返回 width, height, size 

为规范前端用户上传照片的大小，减轻存储服务器压力，当用户选取的照片过大时，在前端自动进行压缩至指定大小（比如 1M ）后再上传。

## 1 - 仓库地址
-  [mp-image-compress【github】](https://github.com/DoctorWei/mp-image-compress)
-  [mp-image-compress【码云gitee】](https://gitee.com/WeiDoctor/mp-image-compress)

## 2 - 测试环境
- 微信小程序基础库版本：2.32.3 及以上

## 3 - 安装方法：npm安装

```
npm i mp-image-compress --save
```
依赖包安装后，需要在小程序开发者工具中：构建npm

## 4 - 接口使用示例

index.js
```js
// 引用 mp-image-compress
import mpImageCompress from 'mp-image-compress'

Page({
  data: {
    img: ''
  },
  onLoad() {
    mpImageCompress.clearTempImg() // 页面载入时清除临时文件
  },
  onUnload() {
    mpImageCompress.clearTempImg()  // 页面卸载时清除临时文件
  },
  chooseImage() {
    const that = this
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      sizeType: ['original', 'compressed'],
      async success(res) {
        const info = res.tempFiles[0]

        // 选择文件后调用图片压缩接口进行压缩。如果选取的图片没有达到指定的大小，将返回原图

        const imgRes = await mpImageCompress.set(info.tempFilePath, 1024) // 1024K
        console.info(imgRes)

        ///////////////////////

        that.setData({
          img: imgRes.filePath
        })
      }
    })
  },
  preview() {
    wx.previewImage({
      current: this.data.img,
      urls: [this.data.img]
    })
  },
  DelImg() {
    this.setData({
      img: ''
    })
  },
})
```