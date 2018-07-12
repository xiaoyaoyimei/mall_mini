var cartId = ''
var addressId = ''
var request = require('../../utils/https.js')
var uri_order_confirm = 'order/shopping/confirm' //确认订单
var uri_pay = 'wxh5pay/api/towxpayInfo'
Page({
  data: {
    cartList: [],
    addressInfo: {},
    hasAddress: false,
    productItemIds:[],
    couponshow: true,
    //商品原总价
    origintotalprice: 0,
    //已优惠价格
    preferential:0,
    couponmsg: {
      availableSku: '',
      availableCatalog: '',
      modeValue: '',
      couponMode: ''
    },
    xscoupon: false,
    couponCode: '',
    total: {
      price: 0,
      num: 0
    },
  },
  //优惠券
  bindcouponInput: function (e) {
    this.setData({
      couponCode: e.detail.value,
    })
  },
  addressClick: function () {
    wx.navigateTo({
      url: '../addressManager/addressManager',
    })
  },
  //总价计算
  jisuan(value) {
    let _this = this;
    var num = _this.data.total.num;
    var totalPrice = _this.data.total.price;
    var origintotalprice = _this.data.origintotalprice;
    //刚进入购物车页面
    if (value == undefined) {
      this.data.cartList.forEach(function (item, index) {
        origintotalprice += item.salePrice * item.quantity;
        totalPrice += item.salePrice * item.quantity;
        num += item.quantity;
      });
    }
    //使用优惠券
    else {
      let couponmethod = value;
      if (couponmethod.availableSku == "" && couponmethod.availableCatalog == "") {
        totalPrice = 0;
        if (couponmethod.couponMode == 'rate') {
          this.data.cartList.forEach(function (item, index) {
            if (item.promotionTitle != '' && item.promotionTitle != null && item.promotionTitle != undefined) {
              totalPrice += item.salePrice * item.quantity;
            } else {
              totalPrice += item.salePrice * (1 - couponmethod.modeValue) * item.quantity
            }
          });
        } else {
          this.data.cartList.forEach(function (item, index) {
            if (item.promotionTitle != '' && item.promotionTitle != null && item.promotionTitle != undefined) {
              totalPrice += item.salePrice * item.quantity;
            } else {
              totalPrice += (item.salePrice - couponmethod.modeValue) * item.quantity
            }
          });
        }
      } else if (couponmethod.availableSku != "") {
        totalPrice = 0;
        if (couponmethod.couponMode == 'rate') {
          this.data.cartList.forEach(function (item, index) {
            if (item.id == couponmethod.availableCatalog) {
              totalPrice += item.salePrice * (1 - couponmethod.modeValue) * item.quantity
            } else {
              totalPrice += item.salePrice * item.quantity;
            }
          });
        } else {
          this.data.cartList.forEach(function (item, index) {
            if (item.id == couponmethod.availableCatalog) {
              totalPrice += (item.salePrice - couponmethod.modeValue) * item.quantity
            } else {
              totalPrice += item.salePrice * item.quantity;
            }
          });
        }
      } else {
        totalPrice = 0;
        if (couponmethod.couponMode == 'rate') {
          this.data.cartList.forEach(function (item, index) {
            if (item.productType == couponmethod.availableSku) {
              totalPrice+= item.salePrice * (1 - couponmethod.modeValue) * item.quantity
            } else {
              totalPrice += item.salePrice * item.quantity;
            }
          });
        } else {
          this.data.cartList.forEach(function (item, index) {
            if (item.productType == couponmethod.availableSku) {
              totalPrice += (item.salePrice - couponmethod.modeValue) * item.quantity
            } else {
              totalPrice += item.salePrice * item.quantity;
            }
          });
        }
      }
    }
    var preferential = origintotalprice - totalPrice;
    this.setData({
      total: { num: num, price: totalPrice},
      origintotalprice: origintotalprice,
      preferential:preferential
    })
  },
  usecoupon() {
    this.data.xscoupon = false
    if (this.data.couponCode==''){
    wx.showToast({
      title: '优惠码不能为空',
      icon: 'error',
      duration: 1000,
      mask: true,
      success: function () {return; }
      })
    }else{
    let para = {
      addressId: this.data.addressInfo.id,
      productItemIds: this.data.productItemIds,
      couponCode: this.data.couponCode
    };
    request.req('cart', 'promotion/coupon', 'POST', para, (err, res) => {

      if (res.data.code == '200') {
        this.setData({
          xscoupon:true,
          couponmsg: Object.assign({}, res.data.object),
        })
        this.jisuan(this.data.couponmsg);
      }else{
        this.setData({
          xscoupon: false,
        })
        wx.showModal({
          content: res.data.object,
          confirmText: "确定",
          showCancel: false
        })
      }
    });
    }
  },
  couponprice(value) {
    let couponmsg = this.couponmsg;
    if (couponmsg.couponMode == 'rate') {
      return value * (1 - couponmsg.modeValue)
    }
    else {
      return value - couponmsg.modeValue
    }
  },
  // 生命周期函数--监听页面加载
  onLoad: function () {
    
    var cartList = wx.getStorageSync('cart');
    var _this = this;
    _this.data.productItemIds = [];
    let n = 0;
    cartList.forEach(function (item, index) {
      if (item.promotionTitle != '' && item.promotionTitle != null) {
        n += 1;
      }
      _this.data.productItemIds.push(item.id);
    });
    if (this.data.cartList.length == n) {
      this.setData({
        couponshow: false,
      })
    } else {
      this.setData({
        couponshow: true,
        productItemIds: productItemIds
      })
    }
    this.setData({
      cartList: cartList,
    })
    
    this.jisuan();
  },
  onShow: function () {
    // 生命周期函数--监听页面显示

    var addresss = wx.getStorageSync('address');
    if(addresss.phone != null){
      this.setData({
        addressInfo: addresss,
        hasAddress:true
      })
    }else{
      this.setData({
        hasAddress:false
      })
    }
  },


  paynow: function () { //先跳转到支付成功界面界面  拿到code
    this.saveOrder();
  },
  saveOrder: function (e) {
    var codeinfo = wx.getStorageSync('codeinfo');
    var code = codeinfo.code; //保存订单接口获取ordercode
    var that = this;
    request.req('zhifu',uri_order_confirm, 'POST',{
      productItemIds: that.data.productItemIds,  // 购物车id
      addressId: that.data.addressInfo.id, //地址id
      couponCode: '',  //暂时为空  优惠券id
      warehouse: '' //如果订单有运费,则传字符串,运费信息用"|"隔开,前边是运费的类型,后边是店铺id,多个用","隔开,若没有运费则不传或者穿""空串
    }, (err, res) => {
          if (res.data.code == 200) {
            var orderNo=res.data.msg;
            wx.removeStorageSync('cart');
            wx.login({
              success: function (res) {
                request.req2(`order/weixin/browser/${orderNo}`, 'GET', res.code, (err, res) => {
                  console.log(res);
                });            
    // wx.requestPayment({
            //   timeStamp: weval.timeStamp,
            //   nonceStr: weval.nonceStr,
            //   package: weval.package,
            //   signType: weval.signType,
            //   paySign: weval.paySign,
            //   success: function (res) { //跳转
            //     wx.redirectTo({
            //       url: '../paycomplete/paycomplete',
            //     })
            //   },
            //   fail: function () {
            //     console.log('fail')
            //   },
            //   complete: function () {
            //     console.log('complete')
            //   }
            // })
              }
              });
            // wx.redirectTo({
            //   url: '/pages/ordertotal/ordertotal',
            //    })
            //调用微信支付
        
          }
          else {
            wx.showToast({
              icon: 'none',
              title: res.data.msg,
              duration: 2000
            })
          }
        })
      } 

  
})