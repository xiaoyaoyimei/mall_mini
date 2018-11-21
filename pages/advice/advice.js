// pages/advice/advice.js
import { $init, $digest } from '../../utils/util.js'
import { promisify } from '../../utils/promise.util'
var request = require('../../utils/https.js')
var baseorgin = getApp().globalData.baseorgin;
//上传图片
const wxUploadFile = promisify(wx.uploadFile)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: '',
    mobile: '',
    content: '',
    imageUrl: '',
    images:[],
    disabled:true
  },
  //姓名
  bindxmInput: function (e) {
    this.setData({
      userId: e.detail.value,
    })
    if (this.data.userId && this.data.mobile && this.data.content) {
      this.setData({ disabled: false })
    } else {
      this.setData({ disabled: true })
    }
  },
  bindphoneInput: function (e) {
    var phone = e.detail.value;
    if (!(/^1\d{10}$/.test(phone))) {
      util.showError('手机号格式不正确');
      return;
    } else {
      this.setData({
        mobile: phone,
      })
    }
    if (this.data.userId && this.data.mobile && this.data.content) {
      this.setData({ disabled: false })
    } else {
      this.setData({ disabled: true })
    }
  },
      bindTextarea: function(e) {
    this.setData({
      content: e.detail.value,
    })
        if (this.data.userId && this.data.mobile && this.data.content) {
          this.setData({ disabled: false })
        } else {
          this.setData({ disabled: true })
        }
  },
  removeImage(e) {
    const idx = e.target.dataset.idx
    this.data.images.splice(idx, 1)
    this.setData({
      images: this.data.images
    })
  },
  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    const images = this.data.images
    wx.previewImage({
      current: images[idx], //当前预览的图片 
      urls: images, //所有要预览的图片 
    })
  },
  chooseImage(e) {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        //选择5张
        const images = that.data.images.concat(res.tempFilePaths)
        that.data.images = images.length <= 1 ? images : images.slice(0, 1)
        that.setData({
          images: images
        })

      }
    })

  },
  add() {

    const content = this.data.content;
    var that = this;
    that.setData({
      disabled: true,
    })
    if (content) {
      const arr = [] //将选择的图片组成一个Promise数组，准备进行并行上传
      for (let path of this.data.images) {
        arr.push(wxUploadFile({
          url: `${baseorgin}/upload/upload?path=account`,
          filePath: path,
          name: 'file',
        }))
      }
      wx.showLoading({
        title: '正在创建...',
        mask: true
      }) // 开始并行上传图片 
      Promise.all(arr).then(res => {

        return res.map(item => JSON.parse(item.data).msg)
      }).catch(err => {
        console.log(">>>> upload images error:", err)
      }).then(urls => { // 调用保存问题的后端接口 
        let img = urls[0];
        request.req2('/complaint/add', 'POST', {
                userId: that.data.userId,
          mobile: that.data.mobile,
                content: that.data.content,
          imageUrl: img
        }, (err, res) => {
          if (res.code == '200') {
            const pages = getCurrentPages();
            const currPage = pages[pages.length - 1];
            const prevPage = pages[pages.length - 2];
            wx.navigateBack()
          }
          that.setData({
            disabled: false,
          })
        })
      }).catch(err => {
        console.log(">>>> create question error:", err)
      }).then(() => {
        wx.hideLoading()
      })
    }
  }
})