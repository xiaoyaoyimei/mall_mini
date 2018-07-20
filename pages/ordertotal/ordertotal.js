//ordertotal.js
var util = require('../../utils/util.js')
var request = require('../../utils/https.js')
var uri = 'order/list'
var statusuri ="order/enums"
var imgurl = getApp().globalData.imgsrc;
Page({
  data: {
    pageNo: 1,
    hidden: false,
    list: [],
    newlist: [],
    statusenums:[],
    imgurl:imgurl
  },
  goindex(){
    wx.switchTab({
      url: '../index/index',
    })
  },
  onLoad(){
    this.getStatus()
  },
  onShow: function () {
    //刷新数据
    this.getData();
   
  },
  getStatus:function(){
    var that = this;
    request.req('order',statusuri, 'GET', {
    }, (err, res) => {
      if (res.data.code == 200) {
          that.setData({
            hidden: true,
            statusenums: res.data.object,
          }) 
      }
    })
  },
  quzhifu(e){
    var that=this;
    var orderNo = e.currentTarget.dataset.orderno;
    wx.login({
      success: function (res) {
        request.req2(`order/weixin/browser/${orderNo}`, 'GET', res.code, (err, res) => {
          var weval=res.data.object;
            wx.requestPayment({
              timeStamp: weval.timeStamp,
              nonceStr: weval.nonceStr,
              package: weval.package,
              signType: weval.signType,
              paySign: weval.paySign,
              success: function (res) { //跳转
                wx.redirectTo({
                  url: '../paycomplete/paycomplete',
                })
              },
              fail: function () {
                wx.showToast({
                  title: '支付失败',
                  icon: 'none',
                  duration: 2000
                })
              },
              complete: function () {
                that.getData();
              }
            })
        }); 
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
    request.req('order',uri,'GET', {
    }, (err, res) => {
      if (res.data.code == 200) {
        if (!res.data) {   //无数据
          that.setData({hidden: true, tips: "没有数据~" })
        } else {
          that.setData({
            hidden: true,
            list: res.data.object,
          })
          //处理数据
          var list = that.data.list;
          for (var i = 0; i < list.length; i++) {
            list[i].order.znStatus = that.statusfilter(list[i].order.orderStatus);
           }
           that.setData({
             newlist: list
           })
        }
      }
    })
  },

  cancel(e) {
    var self=this;
    var orderNo = e.currentTarget.dataset.orderno;
    wx.showModal({
      title: '温馨提示',
      content: '确定取消该订单?',
      success: function (res) {
        if (res.confirm) {
          request.req2('order/cancel', 'POST', orderNo, (err, res) => {
            if (res.data.code == 200 || res.data.code==503) {
              wx.showToast({
                title: res.data.msg,
                icon: 'success',
                duration: 1000,
                mask: true
              })
              self.getData();
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 1000,
                mask: true
              })
            }
          });
        }
      },
      fail(e) {
        callback(e)
      }
    })
  },
  qianshou(e) {
    var self = this;
    var orderNo = e.currentTarget.dataset.orderno;
    wx.showModal({
      title: '温馨提示',
      content: '确定签收该订单?',
      success: function (res) {
        if (res.confirm) {
          request.req2('order/receive', 'POST', orderNo, (err, res) => {
            if (res.data.code == 200) {
              wx.showToast({
                title: res.data.msg,
                icon: 'success',
                duration: 1000,
                mask: true
              })
              self.getData();
            } else {
              wx.showToast({
                title: res.data.msg,
                icon:'none',
                duration: 1000,
                mask: true
              })
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
