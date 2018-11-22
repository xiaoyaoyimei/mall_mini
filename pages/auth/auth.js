// pages/auth/auth.js
var request = require('../../utils/https.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  bindGetUserInfo: function(e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮          
      var that = this;
      console.log(e.detail.userInfo);
      wx.setStorageSync('wxuser', { nickName: e.detail.userInfo.nickName, avatarUrl: e.detail.userInfo.avatarUrl})      
      wx.switchTab({
        url: '../index/index'
      })
      this.queryUsreInfo();
    } else { //用户按了拒绝按钮   
      wx.switchTab({
        url: '../index/index'
      })       
    }
  },
  queryUsreInfo: function () { 
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
          }
        })
      }
    });
     },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})