 //mime.js
var util = require('../../utils/util.js')
var request = require('../../utils/https.js')
var app = getApp()
var Info = {}
Page({
  data: {
    //之前在其他途径登录过该网站（在电脑端或者手机浏览器）
    hasLogin:true,
    userInfo: {
      
    },
    loginhidden: true,
    wxauth:{
      avatarUrl:''
    }
  },
  allorder: function () {
    //全部订单
    wx.navigateTo({
      url: "../ordertotal/ordertotal?status=00"
    })
  },
  //地址管理来自个人中心页面
  // address_manager: function () {
  //   wx.navigateTo({
  //     url: '../addressManager/addressManager?mime=1'
  //   })
  // },
  //账户管理
  mimeinfo: function () {
    wx.navigateTo({
      url: '../manager/manager'
    })
  },
  onShow: function () {
    this.data.wxauth = wx.getStorageSync('wxuser');
    this.setData({
      wxauth: this.data.wxauth,
    });
    var that = this;
    var CuserInfo = wx.getStorageSync('CuserInfo');
    if (CuserInfo.token) {
      //获取照片和用户名
    request.req('index','account', 'POST', {}, (err, res) => {
          that.setData({
  
            userInfo: res,
            loginhidden:false
          })
      })
    } else {
      that.setData({

        loginhidden: true,
      });
    }
   
     
  },
  logout:function(){
    var that = this
    //判断是否登陆，如果没登陆走微信的

      request.req('index','customer/logout', 'POST', {}, (err, res) => {
        if(res.code==200){
          wx.showToast({
            title: res.msg,
            icon: 'success',
            duration: 2000
          })
          wx.removeStorageSync('CuserInfo')
          that.setData({
            loginhidden: true,
          });
        }
    })

  }
})