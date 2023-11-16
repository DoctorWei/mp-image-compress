var offCanvas, ctx;
const fs = wx.getFileSystemManager()
const dirPath = `${wx.env.USER_DATA_PATH}/compress-img`

var filePath = null
var imgWidth = 0
var imgHeight = 0
var imgSize = 0

const self = {
  int() {
    if (!offCanvas) {
      offCanvas = wx.createOffscreenCanvas({
        type: '2d',
        width: 300,
        height: 300
      })
    }
    if (!ctx) ctx = offCanvas.getContext('2d')
  },

  async set(src, maxsize = 1024) {
    self.int();
    filePath = src
    let i = 0
    let istrue = false
    do {
      i++
      await new Promise((resolve) => {
        fs.getFileInfo({
          filePath: filePath,
          async success(res) {
            // console.info(res)
            imgSize = res.size
            if (res.size > maxsize * 1024) {
              await self.compress(filePath)
            } else {
              await self.compress(filePath, true)
              istrue = true
            }
            resolve()
          }
        })
      });
    } while (!istrue && i < 50);

    return {
      filePath: filePath,
      width: imgWidth,
      height: imgHeight,
      size: imgSize,
    };
  },

  async compress(src, onlyGetWH = false) {
    let imageItem = offCanvas.createImage() // 图片对象

    imageItem.src = src // 设置图片src
    imageItem.onerror = err => {
      console.log('err', err)
      wx.showModal({
        title: '提示',
        content: '照片加载失败',
        confirmText: '关闭',
        showCancel: false,
      })
    }

    // 如果图片已经存在于浏览器缓存
    if (imageItem.width > 0) {

      if (onlyGetWH) {
        imgWidth = imageItem.width;
        imgHeight = imageItem.height;
      } else {
        self._imgLoaded(imageItem)
      }

    } else {
      await new Promise((resolve) => {
        imageItem.onload = () => {

          if (onlyGetWH) {
            imgWidth = imageItem.width;
            imgHeight = imageItem.height;
          } else {
            self._imgLoaded(imageItem)
          }

          resolve()
        }
      });
    }
  },

  async _imgLoaded(img) {
    let yinzi = 0.95
    if (img.width > 2048 || img.height > 2048) yinzi = img.height > img.width ? (2048 / img.height) : (2048 / img.width)

    imgWidth = img.width * yinzi;
    imgHeight = img.height * yinzi;

    offCanvas.width = imgWidth
    offCanvas.height = imgHeight
    ctx.clearRect(0, 0, imgWidth, imgHeight);
    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, offCanvas.width, offCanvas.height)

    fs.mkdir({
      dirPath: dirPath,
      recursive: false,
      // fail(res) {
      //   console.error(res)
      // }
    })

    const tempPath = `${dirPath}/${new Date().getTime()}.jpg`
    const dataURL = offCanvas.toDataURL('image/jpeg', 0.92).replace('data:image/jpeg;base64,', '')
    try {
      fs.writeFileSync(tempPath, dataURL, 'base64')
      filePath = tempPath
    } catch (e) {
      console.error(e)
    }
  },
  clearTempImg() {
    try {
      // 适当的时候删除临时文件
      wx.getFileSystemManager().rmdir({
        dirPath: dirPath,
        recursive: true,
        // fail(res) {
        //   console.error(res)
        // }
      })
    } catch (error) {
      console.info(error)
    }
  },
}

module.exports = {
  set: self.set,
  clearTempImg: self.clearTempImg
}