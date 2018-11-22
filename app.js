//app.js
var request = require('/utils/https.js')
App({
  onLaunch: function () {
  },
  getUserInfo:function(cb){

    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
 
    }
  },
  getSystemInfo:function(cb){ 
      var that = this
    if(that.globalData.systemInfo){
      typeof cb == "function" && cb(that.globalData.systemInfo)
    }else{
      wx.getSystemInfo({
        success: function(res) {
          that.globalData.systemInfo = res
          typeof cb == "function" && cb(that.globalData.systemInfo)
        }
      })
    }
  },

  globalData:{
    userInfo:null,
    imgsrc:'//image-shop.dxracer.com.cn/',
    baseorgin:'https://m.shop.dxracer.cn/mall/wap/',//用接收验证码
    keyword:''
  }
})