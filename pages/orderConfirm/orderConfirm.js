var cartId = ''
var addressId = ''
var request = require('../../utils/https.js')
var uri_order_confirm = 'order/shopping/confirm' //确认订单
var uri_pay = 'wxh5pay/api/towxpayInfo'
Page({
  data: {
    orderData: {},
    addressInfo: {},
    total:0,
    productItemIds:[]
  },
  addressClick: function () {
    wx.navigateTo({
      url: '../addressManager/addressManager',
    })
  },
  // 生命周期函数--监听页面加载
  onLoad: function () {
    var that = this;
    var orderData = wx.getStorageSync('cart');

    this.setData({
      orderData: orderData,
    })
    this.getTotalPrice();

  },
  onShow: function () {
    // 生命周期函数--监听页面显示

    var addresss = wx.getStorageSync('address');
    if(addresss.phone != null){
      this.setData({
        addressInfo: addresss,
      })
    }else{
      this.setData({
        addressInfo : {'trueName':'请选择收货地址'},
      })
    }
  },

  /**
   * 计算总价
   */
  getTotalPrice() {
    let orders = this.data.orderData;
    console.log(orders);
    let total = 0;
    var productItemIds=[];
    for (let i = 0; i < orders.length; i++) {
      total += orders[i].quantity * orders[i].salePrice;
      productItemIds[i] = orders[i].id
    }
    this.setData({
      total: total,
      productItemIds: productItemIds
    })
  },
  paynow: function () { //先跳转到支付成功界面界面  拿到code
    this.saveOrder();

  },
  saveOrder: function (e) {
    var codeinfo = wx.getStorageSync('codeinfo');
    var code = codeinfo.code; //保存订单接口获取ordercode
    var that = this;
    request.req(uri_order_confirm, 'POST',{
      productItemIds: that.data.productItemIds,  // 购物车id
      addressId: that.data.addressInfo.id, //地址id
      couponCode: '',  //暂时为空  优惠券id
      warehouse: '' //如果订单有运费,则传字符串,运费信息用"|"隔开,前边是运费的类型,后边是店铺id,多个用","隔开,若没有运费则不传或者穿""空串
    }, (err, res) => {
      console.log(res.data)
      if (res.data.result == 1) {
        //获取paySn
        var orderCode = res.data.data[0].paySn;
        request.req(uri_pay, {
          orderCode: orderCode,
          code: code
        }, (err, res) => {
          console.log(res.data)
          //res.data.msg
          var weval = res.data.Weval;

          if (res.data.code == 200) {
            //调用微信支付
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
          }
        })
      } else {

      }
    })
  },
})