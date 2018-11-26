// pages/auth/auth.js
var request = require('../../utils/https.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
  },
  bindGetUserInfo(e){
  if (e.detail.userInfo) {
    //用户按了允许授权按钮          
    var that = this;
    this.queryUsreInfo();
    wx.switchTab({
      url: '../index/index'
    })
   
  } else { //用户按了拒绝按钮   
    wx.switchTab({
      url: '../index/index'
    })
  }
},
queryUsreInfo: function() {
  return new Promise(function (resolve, reject) {
  wx.login({
    success: function(res) {
      var code = res.code;
      request.req3(`customer/wxlogin/${code}`, 'POST', null, (err, res) => {
        if (res.code == 200) {
          var CuserInfo = {
            token: res.object.token,
            userId: res.object.userId,
          };
          wx.setStorageSync('CuserInfo', CuserInfo);

          // getApp().globalData.userInfo = res.data;
        }
      })
    }
  });
    resolve();
  })
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