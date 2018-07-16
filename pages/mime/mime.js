 //mime.js
var util = require('../../utils/util.js')
var request = require('../../utils/https.js')
var app = getApp()
var Info = {}
Page({
  data: {
    userInfo: {},
  },

  no_payment: function () {
    //全部订单
    wx.navigateTo({
      url: '../ordertotal/ordertotal' 
    })
  },
  address_manager: function () {
    wx.navigateTo({
      url: '../addressManager/addressManager?fromurl='
    })
  },

  //账户管理
  mimeinfo: function () {
    wx.navigateTo({
      url: '../manager/manager'
    })
  },
  onShow: function () {
    var that = this
  
      //获取照片和用户名
      request.req('account','account', 'POST', {}, (err, res) => {
         var user = {}
          user.phone = res.data.customerMobile;
          that.setData({
            userInfo: user
          })
      })
     
  },
  logout:function(){
    var that = this
    //判断是否登陆，如果没登陆走微信的

      request.req('account','customer/logout', 'POST', {}, (err, res) => {
        if(res.data.code==200){
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 2000
          })
          wx.removeStorageSync('CuserInfo')
        }
    })

  }
})