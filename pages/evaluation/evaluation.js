// pages/evaluation/evaluation.js
var request = require('../../utils/https.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    evaluateList: [],
    hasShow: true,
    onlyimg: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getEvaluate();
  },
  goindex: function () {
    //去首页
    wx.switchTab({
      url: '../sort/sort'
    })
  },
  getEvaluate() {
    request.req2('comment/mysearch', 'GET',null,  (err, res) => {
      if (res.code == 200) {
        this.setData({
          evaluateList: res.object
        })
        if (res.object.length > 0) {
          this.setData({
            hasShow: true
          })
        } else {
          this.setData({
            hasShow: false
          })
        }
      }
    })
  },
  zan() {
    var zanid = e.currentTarget.dataset.id;
    var Like = e.currentTarget.dataset.isZan;
    if (Like == 'N') {
      Like = 'yes'
    } else {
      Like = 'no'
    }
    request.req2('/comment/beLike/' + zanid + '/' + Like, 'GET', (err, res) => {
      if (res.code == 200) {
        this.getEvaluate()
      }
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