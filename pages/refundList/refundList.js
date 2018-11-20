//ordertotal.js
var util = require('../../utils/util.js')
var request = require('../../utils/https.js')
var uri = 'refund/getRefundOrderList'
var statusuri = "refund/enums"
Page({
  data: {
    pageNo: 1,
    list: [],
    newlist: [],
    statusenums: [],
    loginhidden: true,
    hasShow:true,
    expressNo: '',
    logistics: '',
    refundAmount: 0,
    refuseReason: '',
    refundAddress: {},
    hidden:true,
    tianxieshow:true,
    addForm: {
      refundOrderNo: '',
      expressNo: '',
      logistics: '',
    },
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
      if (res.code == 200) {
        that.setData({
          statusenums: res.object,
          loginhidden: false
        })
      }
    })
  },
  bindLogisticsInput: function (e) {
    this.setData({
      'addForm.logistics': e.detail.value
    })
  },
  bindExpressNoInput: function (e) {
    this.setData({
      'addForm.expressNo': e.detail.value
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
      if (res.length >0) {

        that.setData({
          list: res,
          loginhidden: false,
          hasShow:true
        })
        //处理数据
        var list = that.data.list;
        for (var i = 0; i < list.length; i++) {
          list[i].refundOrder.znStatus = that.statusfilter(list[i].refundOrder.refundOrderStatus);
        }
        that.setData({
          newlist: that.data.list
        })

      }
      else {
        that.setData({  tips: "没有售后订单~", loginhidden: false, hasShow:false })
      }
    })
  },
  cancelrefund(e){
    var self = this;
    var refundOrderNo = e.currentTarget.dataset.orderno;
    wx.showModal({
      title: '温馨提示',
      content: '确定该售后订单?',
      success: function (res) {
        if (res.confirm) {
          var url =`refund/cancel?refundOrderNo=${refundOrderNo}`
          request.req2(url, 'POST', null, (err, res) => {
            if (res.code == 200 || res.code == 503) {
              util.showSuccess(res.msg)
              self.getData();
            } else {
              util.showError(res.msg)
            }
          });
        }
      },
      fail(e) {
        callback(e)
      }
    })
  },
  showResult(e){
    this.setData({
      refundAmount: e.currentTarget.dataset.total,
      refuseReason: e.currentTarget.dataset.reason,
      refundStatus: e.currentTarget.dataset.status,
      hidden: false
    })

  },
  tianxie(e) {
    console.log(e.currentTarget.dataset.total)
   this.setData({
     tianxieshow:false,
     'addForm.refundOrderNo':e.currentTarget.dataset.orderno,
   })

  },
  confirm(){
    this.setData({
      hidden: true
    })
  },
  tianxieconfirm(){
    console.log(this.data.addForm.expressNo)
    console.log(this.data.addForm.logistics)
    if (this.data.addForm.expressNo.length == 0) {
      wx.showToast({
        title: '物流单号不能为空',
        icon: 'none',
        mask: true
      })
      return
    } else if (this.data.addForm.logistics.length == 0){
      wx.showToast({
        title: '物流公司不能为空',
        icon: 'none',
        mask: true
      })
      return
    }
    request.req2(`/refund/submitLogisticsInfo?refundOrderNo=${this.data.addForm.refundOrderNo}&expressNo=${this.data.addForm.expressNo}&logistics=${this.data.addForm.logistics}`, 'post', {}, (err, res) => {
      if (res.code == '200') {
        this.setData({
          tianxieshow: true
        })
      } else {
        this.setData({
          tianxieshow: true
        })
      }
      this.getStatus();
      this.getData();
    });
  }

})
