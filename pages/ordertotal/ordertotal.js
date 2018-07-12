//ordertotal.js
var util = require('../../utils/util.js')
var request = require('../../utils/https.js')
var uri = 'order/list'
var statusuri ="order/enums"
Page({
  data: {
    pageNo: 1,
    hidden: false,
    list: [],
    newlist: [],
    statusenums:[],
  },
  onLoad: function () {
    //刷新数据
    this.getData();
    this.getStatus()
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
    var orderNo = e.currentTarget.dataset.orderno;
    wx.login({
      success: function (res) {
        console.log(res.code)
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
                console.log('fail')
              },
              complete: function () {
                console.log('complete')
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
            if (res.data.code == 200) {
              wx.showToast({
                title: '取消成功',
                icon: 'success',
                duration: 1000,
                mask: true
              })
              self.getData();
            } else {
              wx.showToast({
                title: '取消失败',
                icon: 'loading',
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
