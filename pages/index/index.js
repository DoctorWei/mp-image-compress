import mpImageCompress from 'mp-image-compress'

Page({
  data: {
    img: ''
  },
  onLoad() {
    mpImageCompress.clearTempImg()
  },
  onUnload() {
    mpImageCompress.clearTempImg()
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
        const imgRes = await mpImageCompress.set(info.tempFilePath, 1024) // 1024K
        console.info(imgRes)
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