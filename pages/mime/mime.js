//mime.js
var util = require('../../utils/util.js')
var request = require('../../utils/https.js')
var uri = 'memberapi/memberDetail'
var app = getApp()
var Info = {}
Page({
  data: {
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function () {

  },
  onLoad: function () {
  },
  no_payment: function () {
    //全部订单
    if (!Info.token) {
      //跳转到login
      wx.navigateTo({
        url: '../login/login?id=' + 0
      })
    }
    wx.navigateTo({
      url: '../ordertotal/ordertotal?id=' + 0

    })
  },
  address_manager: function () {
    if (!Info.token) {
  
      wx.navigateTo({
        url: '../login/login?id=' + 2
      })
    }
    wx.navigateTo({
      url: '../addressManager/addressManager?id=' + 2
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
    //判断是否登陆，如果没登陆走微信的
    var CuserInfo = wx.getStorageSync('CuserInfo');
    console.log(CuserInfo);
    Info = CuserInfo
    if (CuserInfo.token) {
      //获取照片和用户名
      request.req('account', 'POST', {}, (err, res) => {
     
          var name = res.data.nickName;
          var user = {}
          user.avatarUrl = 'https://image-shop.dxracer.com.cn/'+res.data.iconUrl;
          user.nickName = name;
          user.phone = res.data.customerMobile;
          that.setData({
            userInfo: user
          })
        
      })
    } else {
      //调用应用实例的方法获取全局数据
      app.getUserInfo(function (userInfo) {
        //更新数据
        that.setData({
          userInfo: userInfo
        })
      })
    }
  }
})