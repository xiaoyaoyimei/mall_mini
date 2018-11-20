
var util = require('../../utils/util.js')
var request = require('../../utils/https.js')

Page({
  data: {
      statusList: [],
      orderdetail:{
        shippingOrder: {},
        shippingInvoice: {},
        shippingAddress: {},
        shippingOrderItems: []
      },
      orderNo: '',
      //状态由orderlist页面带来。以免二次处理
      orderStatus:'',
      wentips:false,
      wentipsDay:false,
      loginhidden: true,
      day:0,
      hr: 0,
      min: 0,
      sec: 0,
      jsqtime: 0,
      t: '',
  },
  onLoad(options) {
    var that = this;

    var CuserInfo = wx.getStorageSync('CuserInfo');
    //
    if (CuserInfo.token) {
      if (options.orderStatus == "待付款" ) {
        that.setData({
          wentips: true
        })
      } else if (options.orderStatus == "已发货"){
        that.setData({
          wentipsDay: true
        })
      }
      this.setData({
        orderNo: options.orderNo,
        orderStatus: options.orderStatus
      })
      that.getOrder();
      that.getStatusEnum();
    } else {
      that.setData({
        loginhidden: true,
      });
    }

  },

  onshow(){
    //this.getOrder();
    
  },
  onHide(){
    clearTimeout(this.data.t)
  },
  countdown () {
    const end = Date.parse(new Date(this.data.jsqtime));
    const now = Date.parse(new Date());
    const msec = end - now;
    let day =0, hr = 0, min = 0, sec = 0;
  
     day = parseInt(msec / (1000 * 60 * 60 * 24));
     hr = parseInt(msec / 1000 / 60 / 60 % 24);
     min = parseInt(msec / 1000 / 60 % 60);
     sec = parseInt(msec / 1000 % 60);
    this.setData({
      day:day,
      hr: hr > 9 ? hr : '0' + hr,
      min : min > 9 ? min : '0' + min,
      sec : sec > 9 ? sec : '0' + sec
    })
    let self = this;
    if (msec > 0){
        this.data.t = setTimeout(() => {
          self.countdown();
        }, 1000)
      
    }

  
  },
    getStatusEnum() {
      request.req('index','order/enums', 'GET', {}, (err, res) => {
        if (res.code == '200') {  
          this.setData({
          statusList: res.object,
            loginhidden: false
        })
        }
      });
    },
    cancel() {
      var orderNo = this.data.orderNo;
      wx.showModal({
        title: '温馨提示',
        content: '确定取消该订单?',
        success: function (res) {
          if (res.confirm) {
            request.req2('order/cancel', 'POST', orderNo, (err, res) => {
              if (res.code == 200) {
                util.showSuccess('取消成功')
                self.getOrder();
              }else{
               util.showError('取消失败')
              }
            });
          } 
        },
        fail(e) {
          console.error(e)
          callback(e)
        }
      }) 
    },
    quzhifu() {
      var that = this;
      var orderNo = this.data.orderNo;
      wx.login({
        success: function (res) {
          request.req2(`order/weixin/browser/${orderNo}`, 'GET', res.code, (err, res) => {
            var weval = res.object;
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
    editInvoice(e){
      var order = e.currentTarget.dataset.order
      wx.navigateTo({
        url: "../invoice/invoice?orderNo=" + order
      })
    },
    productFeejun(item) {
      return item.productFee / item.quantity
    },
  invoicefilter(value) {
    if (value == 'created') {
      return '已创建'
    } else if (value == 'B') {
      return "已开票"
    } else {
      return "已寄出"
    }
  }, 
    getOrder() {
      var that=this;
      var orderNo = this.data.orderNo;
      request.req2('order/' + orderNo, 'GET', null, (err, res) => {
        if (res.shippingInvoice!=""){
          res.shippingInvoice.znstatus = that.invoicefilter(res.shippingInvoice.invoiceStatus);
        }

          this.setData({
            orderdetail: res,
            loginhidden:false
          })    
        if (this.data.orderdetail.shippingOrder.orderStatus == '01') {
          this.setData({
            jsqtime: this.data.orderdetail.shippingOrder.createTime + 30 * 60 * 1000,
          })  
          this.countdown();
        }
        if (this.data.orderdetail.shippingOrder.orderStatus == '06') {
          this.setData({
            jsqtime: this.data.orderdetail.shippingOrder.deliverTime + 7 * 24 * 60 * 60 * 1000,
          })
          console.log('000')
          this.countdown();
        }
      })
    },   
})