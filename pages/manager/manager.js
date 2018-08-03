//manager.js
var request = require('../../utils/https.js')
Page({
  data:{
    customerMobile:''
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
    var that=this;
    request.req('account', 'account', 'POST', {}, (err, res) => {
      that.setData({
          customerMobile: res.data.customerMobile
        })
    })
  },
  onPullDownRefresh: function() {
    // 页面相关事件处理函数--监听用户下拉动作
 
  },
  onReachBottom: function() {
    // 页面上拉触底事件的处理函数
  },

  formSubmit(e) {
    var that = this;
    var formData = e.detail.value;
    that.setData({
      customerMobile: formData.customerMobile
    })
    request.req('account', 'account/update', 'POST', {
      customerMobile: formData.customerMobile
    }, (err, res) => {
       if(res.data.code==200){
         wx.switchTab({
           url: '../mime/mime'
         })
       }
    })
  },

})