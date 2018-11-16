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
    for (var i = 0; i < this.data.statusList.length; i++) {

      if (this.data.statusList[i].key == value) {
        return this.data.statusList[i].value;
      }
    }
  },
  getStatusEnum() {
    request.req2('refund/enums', 'get', null, (err, res) => {
      if (res.data.code == '200') {
      this.setData({
        statusList: res.data.object,
      })
      }
    })
  },
  getOrder() {
    request.req2('refund', 'get', this.data.refundOrderNo, (err, res) => {
 
      res.data.shoppingRefundOrder.znrefundOrderStatus = this.statusfilter(res.data.shoppingRefundOrder.refundOrderStatus);
      this.setData({
        refundOrderdetail: res.data,
      })
    })
    request.req2('order', 'get', this.data.orderNo, (err, res) => {
      this.setData({
        orderdetail: res.data,
      })
    })


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    
    this.setData({
      orderNo: options.orderNo,
      refundOrderNo: options.refundOrderNo
    })

    this.getOrder();
    this.getStatusEnum();
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