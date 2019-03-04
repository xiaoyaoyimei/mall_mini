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
    hadUser: true,
    wxauth:{
      avatarUrl:''
    },
  },
  allorder: function () {
    //全部订单
    wx.navigateTo({
      url: "../ordertotal/ordertotal?status=00"
    })
  },



  //账户管理
  mimeinfo: function () {
    wx.navigateTo({
      url: '../manager/manager'
    })
  },
  onShow: function () {
    var that = this;
    var CuserInfo = wx.getStorageSync('CuserInfo');
    //判断授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              wx.login({
                success: function (res) {
                  var code = res.code;
                  request.req3(`customer/wxlogin/${code}`, 'POST', null, (err, res) => {
                    if (res.code == 200) {
                      var CuserInfo = {
                        token: res.object.token,
                        userId: res.object.userId,
                      };
                      wx.setStorageSync('CuserInfo', CuserInfo);
                      request.req('index', 'account', 'POST', {}, (err, res) => {
                        that.setData({
                          userInfo: res,
                          hadUser: true
                        })
                      })
                    }else{

                      that.setData({
                        userInfo: res,
                        hadUser: false
                      })
                      util.showError(res.object)
                    }
                  })
                }
              });

            }
          })
       
        } else {
          wx.navigateTo({
            url: '../auth/auth',
          })
          that.setData({
            hadUser: false,
          });
        }


      }
    })


  
   
     
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