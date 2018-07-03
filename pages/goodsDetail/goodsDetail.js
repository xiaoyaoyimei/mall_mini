//商品分类页传来的商品Id
var specId = ''
var goodsId = ''
var app = getApp();
var request = require('../../utils/https.js')
var uribuy = 'cartapi/addCart' //立即购买
var uri = 'product'


//在使用的View中引入WxParse模块
var WxParse = require('../../wxParse/wxParse.js');

Page({
  data: {
    showModal: false,
    tips: '',
    detailData: {},
    indicatorDots: true,
    interval: 5000,
    duration: 1000
  },
  buyNow: function (event) {  //获取cartId
    //判断是否登陆,如果未登陆跳到登陆界面，如果登陆就调接口，跳转确认订单界面
    var CuserInfo = wx.getStorageSync('CuserInfo');
    console.log(CuserInfo.token)
    if (!CuserInfo.token) {
      //跳转到login
      wx.navigateTo({
        url: '../login/login?goodsId=' + goodsId + '&specId=' + specId,
      })
    } else {
      var that = this;
      request.req(uribuy, {
        specId: specId,
        count: '1',
        saveType: '1',
        goodsId: goodsId
      }, (err, res) => {
        var result = res.data;
        console.log(result);
        if (result.result == 1) { //获取cartId
          //拿着cartId跳转到确认订单界面
          wx.navigateTo({   //获取cartId
            url: '../orderConfirm/orderConfirm?cartIds=' + result.data[0].cartIds,
          })
        } else {
          that.setData({
            tips: res.data.msg
          })
          console.log(res.data.msg)
        }
      })
    }
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    var that = this;
    this.requestData(options);

  },
  //数据请求*(直接带post参数)
  requestData: function (oo) {
    specId = oo.specId;
    var that = this;
    request.req2(uri, 'POST',specId, (err, res) => {
     
      if (res.data.code == 200) {
       // goodsId = res.data.object,
        that.setData({
          detailData: res.data.object,
        })
      }
    })
  },
  showDialogBtn: function () {
    this.setData({
      showModal: true
    })
  },
  /**
      * 弹窗
      */
  showDialogBtn: function () {
    this.setData({
      showModal: true
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {
  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function () {
    this.hideModal();
  }
})