//ordertotal.js
var util = require('../../utils/util.js')
var request = require('../../utils/https.js')
var uri = 'refund/getRefundOrderList'
var statusuri = "refund/enums"
Page({
  data: {
    pageNo: 1,
    hidden: false,
    list: [],
    newlist: [],
    statusenums: [],
    loginhidden: true
  },
  goindex() {
    wx.switchTab({
      url: '../index/index',
    })
  },
  onLoad() {

  },
  onShow: function () {

    //刷新数据
    var that = this;

    var CuserInfo = wx.getStorageSync('CuserInfo');
    //存在Bug .如果token过期
    if (CuserInfo.token) {
      that.getStatus();
      that.getData();
    } else {
      that.setData({
        loginhidden: true,
      });
    }

  },
  getStatus: function () {
    var that = this;
    request.req('index', statusuri, 'GET', {
    }, (err, res) => {
      if (res.data.code == 200) {
        that.setData({
          hidden: true,
          statusenums: res.data.object,
          loginhidden: false
        })
      }
    })
  },

  statusfilter(value) {
    for (var i = 0; i < this.data.statusenums.length; i++) {
      if (this.data.statusenums[i].key == value) {
        return this.data.statusenums[i].value;
      }
    }
  },
  getData: function () {
    var that = this;
    var status = "";
    var pageNo = that.data.pageNo;
    var CuserInfo = wx.getStorageSync('CuserInfo');
    request.req('index', uri, 'GET', {
    }, (err, res) => {
      if (res.data.code == 200) {

        that.setData({
          hidden: true,
          list: res.data.object,
          loginhidden: false
        })
        //处理数据
        var list = that.data.list;
        for (var i = 0; i < list.length; i++) {
          list[i].order.znStatus = that.statusfilter(list[i].refundOrder.refundOrderStatus);
        }
        that.setData({
          newlist: list
        })

      }
      else {
        that.setData({ hidden: true, tips: "没有售后订单~", loginhidden: false })
      }
    })
  },

  tianxie(e) {
    var self = this;
    var orderNo = e.currentTarget.dataset.orderno;
    wx.showModal({
      title: '温馨提示',
      content: '确定取消该订单?',
      success: function (res) {
        if (res.confirm) {
          request.req2('order/cancel', 'POST', orderNo, (err, res) => {
            if (res.data.code == 200 || res.data.code == 503) {
              util.showSuccess(res.data.msg)
              self.getData();
            } else {
              util.showError(res.data.msg)
            }
          });
        }
      },
      fail(e) {
        callback(e)
      }
    })
  },


})
