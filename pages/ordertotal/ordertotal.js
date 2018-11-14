//ordertotal.js
var util = require('../../utils/util.js')
var request = require('../../utils/https.js')

var statusuri ="order/enums"
Page({
  data: {
    pageNo: 1,
    hidden: false,
    list: [],
    newlist: [],
    statusenums:[],
    loginhidden: true,
    status:'00',
    hasShow:true
  },
  goindex(){
    wx.switchTab({
      url: '../index/index',
    })
  },
  onLoad(options){
    this.setData({
      status: options.status,
    });
  },
  onShow: function () {

    //刷新数据
    var that = this;
    
    var CuserInfo = wx.getStorageSync('CuserInfo');
    //存在Bug .如果token过期
    if (CuserInfo.token) {
      that.getStatus();
      that.getData();
    }else{
      that.setData({
        loginhidden: true,
      });
    }
   
  },
  getStatus:function(){
    var that = this;

    request.req('index',statusuri, 'GET', {
    }, (err, res) => {
      if (res.data.code == 200) {
          that.setData({
            hidden: true,
            statusenums: res.data.object,
            loginhidden:false
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
                util.showError('支付失败')
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
     var uri = '';
    var that = this;
    var pageNo = that.data.pageNo;
    var CuserInfo = wx.getStorageSync('CuserInfo');

     if (that.data.status!='00'){
      uri = `order/list?orderStatus=${that.data.status}`
    }else{
       uri = 'order/list'
    }
    request.req('index',uri,'GET', {
    }, (err, res) => {
      if (res.data.code == 200 && res.data.object.length>0) {
          that.setData({
            hidden: true,
            list: res.data.object,
            loginhidden:false,
            hasShow:true
          })
          //处理数据
          var list = that.data.list;

          for (var i = 0; i < list.length; i++) {
            list[i].order.znStatus = that.statusfilter(list[i].order.orderStatus);
            this.maopao(list[i])
           }
           that.setData({
             newlist: list
           })

      }
      else{
        that.setData({ hidden: true, tips: "没有数据~", loginhidden: false,hasShow:false })
      }
    })
  },
  maopao(item) {
    for (let j = 0; j < item.commentList.length; j++) {
      for (let n = 0; n < item.orderItems.length; n++) {
        if (item.commentList[j].orderItemsId == item.orderItems[n].orderItemsId) {
          item.orderItems[n].pinglun = item.commentList[j].canComment;
          item.orderItems[n].productModelId = item.commentList[j].productModel.id;
        }
      }
    }
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
  showrefund(e){
    var self = this;
    var orderNo = e.currentTarget.dataset.orderno;
    wx.navigateTo({
       url: `../refund/refund?rforder=${orderNo}`
    })
  }

})
