
var request = require('../../utils/https.js')
Page({
  data: {
    likeList: [],
    hasLove: true
  }, 
  goindex: function () {
    //全部订单
    wx.switchTab({
      url: '../index/index'
    })
  },
  del:function(event){
    let id = event.currentTarget.id;
    request.req2('like/delete/'+id,  'POST', {}, (err, res) => {
      console.log(res)
      if (res.code = '200') {
        this.getLike();
      }
    });
  },
  getLike:function(){
    request.req('like', 'like', 'POST', {}, (err, res) => {
      if (res.length > 0) {
        this.setData({
          likeList: res,
          hasLove: true
        })
      } else {
        this.setData({
          hasLove: false
        })
      }

    })
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    this.getLike();
   
  },
})