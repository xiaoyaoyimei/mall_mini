var request = require('../../utils/https.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    backcolor: '#f0f2f5',
    psword: '',
    confirm:'',
    showToast: '',
  },
  //密码
  bindnewInput: function (e) {
    var psword = e.detail.value;

      this.setData({
        psword: psword,
      })   
  },
  //确认密码
  bindconfirmInput: function (e) {
    this.setData({
      confirm: e.detail.value,
    })
  },
  update: function () {

    var that = this;
    if (this.data.psword != this.data.confirm) {
      this.setData({
        showToast: '两次密码不一致,请重新输入',
        backcolor: 'red',
      })
      return;
    }
    if (this.data.psword.length <6) {
      wx.showToast({
        title: '新密码长度不能低于6位',
        icon: 'none',
        mask: true
      })
    } else if (this.data.confirm.length<6) {
      wx.showToast({
        title: '确认密码长度不能低于6位',
        icon: 'none',
        mask: true
      })
    }else{
   
    let url = "customer/update/password?password=" + that.data.psword;
        request.req2(url, 'POST', null, (err, res) => {

          //保存
          if (res.code == '200') {
            that.setData({
              showToast: res.msg,
              backcolor: 'green',
            })
          } else {
            //提示
            that.setData({
              showToast: res.msg,
              backcolor: 'red',
            })
          }
        })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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