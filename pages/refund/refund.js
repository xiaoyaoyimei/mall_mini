// pages/refund/refund.js

var request = require('../../utils/https.js')
var baseorgin = getApp().globalData.baseorgin;
//上传图片
var upimg = require('../../utils/upimg.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reasonList:[],
    rforder:'',
    pics: []
  },
  getStatus: function () {
    var that = this;
    request.req2('refund/getRefundCauseList', 'GET', {
    }, (err, res) => {
        that.setData({
          reasonList: res,
        })
    })
  },
  chooseImg:function(){
  wx.chooseImage({
    count: 1, // 默认9
    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    success: function (res) {
      // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
      var tempFilePaths = res.tempFilePaths
      wx.uploadFile({
        url: `${baseorgin}/upload/upload?path=account`, 
        filePath: tempFilePaths[0],
        name: 'file',
        success: function (res) {
          var data = res.data
          //do something
        }
      })
    }
  })
  },
  uploadimg: function () {//这里触发图片上传的方法
    var pics = this.data.pics;
    upimg.uploadimg({
      url: 'https://........',//这里是你图片上传的接口
      path: pics//这里是选取的图片的地址数组
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  var  rforder = options.rforder
    this.setData({
      rforder: rforder
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})