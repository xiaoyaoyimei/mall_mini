// pages/refundDetail/refundDetail.js
var request = require('../../utils/https.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
      orderdetail: {
        shippingOrder: { postageFee: 0, orderTotalFee: 0 },
      shippingInvoice: {},
      shippingAddress: {},
      shoppingOrderItems: [],
    },
    refundOrderdetail: {
      shoppingRefundOrder: { refundOrderTotalFee: 0 },
      shippingInvoice: {},
      shippingAddress: {},
      shoppingRefundOrderItems: [],
    },
    statusList: [],
    orderNo: '',
    refundOrderNo:'',
  },
  statusfilter(value) {
    for (var i = 0; i < this.statusList.length; i++) {
      if (this.statusList[i].key == value) {
        return this.statusList[i].value;
      }
    }
  },
  getStatusEnum() {
    request.req2('refund/enums', 'get', null, (err, res) => {
      if (res.data.code == '200') {
      that.setData({
        refundOrderdetail: res.data.object,

      })
      }
    })
  },
  getOrder() {
    request.req2('refund', 'get', this.data.refundOrderNo, (err, res) => {
      that.setData({
        refundOrderdetail: res.data,
      })
    })
    request.req2('order', 'get', this.data.orderNo, (err, res) => {
      that.setData({
        orderdetail: res.data,
      })
    })


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let orderNo = options.orderNo;
    this.setData({
      orderNo: options.orderNo,
      refundOrderNo: options.refundOrderNo
    })
    this.getOrder();
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