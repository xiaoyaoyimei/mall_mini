//index.js
//获取应用实例
var app = getApp()
var imgurl = app.globalData.imgsrc;

var request = require('../../utils/https.js')
var uri_home = 'floor/api/indexListAll'
Page({
  data: {
    motto: '请输入您要搜索的商品',
    list: [],
    poster:[],
    imgurl: imgurl,
    xin:[]
  },
  onShareAppMessage: function () {
    // 用户点击右上角分享
    return {
      title: 'dxracer官方商城', // 分享标题
      desc: 'O(∩_∩)O哈哈~活捉一只电竞椅', // 分享描述
      path: '/pages/index/index' // 分享路径
    }
  },
  searchPro: function () {
    wx.navigateTo({
      url: '../search/search',
    })
  },
  //跳转到goodsdetail
  itemclick: function (e) {
    var specId = e.currentTarget.dataset.specid;
    wx.navigateTo({
      url: '../goodsDetail/goodsDetail?specId=' + specId,
    })
  },
  xin:function(){
    request.req3('index/product/new', 'GET', {}, (err, res) => {
      if (res.data.code == 200) {
        this.setData({
          xin: res.data.object
        })
      }
    })
  },
  onLoad: function () {
    //调登陆接口
    var that = this
    //广告位轮播
    request.req3('index/poster', 'GET',{},(err, res) => {
        if (res.data.code == 200) {
          that.setData({
            poster: res.data.object
          })
        }
      })
      that.xin()
  },
})
