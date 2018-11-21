import { $init, $digest } from '../../utils/util'
var cartId = ''
var addressId = ''
var request = require('../../utils/https.js')
var uri_order_confirm = 'order/shopping/confirm' //确认订单
Page({
  data: {
    orderfrom: 'B',	//获取from类型A为立即下单，B为来自购物车1
    freight:0,
    cartList: [],
    addressInfo: { receiveProvince:''},
    hasAddress: false,
    productItemIds:[],
    quantitys:[],
    modelIds:[],
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
      num: 0,
      price: 0,
     
    },
    disabled:false,
    useCouponMsg:'',//使用优惠码提示
    remark:''
  },
  //优惠券
  bindcouponInput: function (e) {
    this.setData({
      couponCode: e.detail.value,
    })
  },
  //订单备注
  bindRemark: function (e) {
    this.setData({
      remark: e.detail.value,
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
    _this.data.total.price = 0;
    var origintotalprice = _this.data.origintotalprice;

    //刚进入购物车页面
    if (value == undefined) {
      this.data.cartList.forEach(function (item, index) {
        origintotalprice += item.salePrice * item.quantity;
        _this.data.total.price += item.salePrice * item.quantity;
      });
    }
    //使用优惠券
    else {

      let couponmethod = value;
      if (couponmethod.availableSku == "" && couponmethod.availableCatalog == "" && couponmethod.availableModel == "") {
        _this.data.total.price = 0;
        if (couponmethod.couponMode == 'rate') {
          this.data.cartList.forEach(function (item, index) {
            if (item.promotionTitle != '' && item.promotionTitle != null && item.promotionTitle != undefined) {
              _this.data.total.price += item.salePrice * item.quantity;
            } else {
              item.salePrice = item.salePrice * (1 - couponmethod.modeValue);
              _this.data.total.price += item.salePrice * item.quantity;
            }
          });
        } else {
          this.data.cartList.forEach(function (item, index) {
            if (item.promotionTitle != '' && item.promotionTitle != null && item.promotionTitle != undefined) {
              _this.data.total.price += item.salePrice * item.quantity;
            } else {
              item.salePrice = item.salePrice - couponmethod.modeValue;
              _this.total.price += item.salePrice * item.quantity;
            }
          });
        }
      } else if (couponmethod.availableSku != "") {
        _this.data.total.price = 0;
        if (couponmethod.couponMode == 'rate') {
          this.data.cartList.forEach(function (item, index) {
            if (item.id == couponmethod.availableSku) {
              item.salePrice = item.salePrice * (1 - couponmethod.modeValue);
              _this.data.total.price += item.salePrice * item.quantity
            } else {
              _this.data.total.price += item.salePrice * item.quantity;
            }
          });
        } else {
          this.data.cartList.forEach(function (item, index) {
            if (item.id == couponmethod.availableSku) {
              item.salePrice = item.salePrice - couponmethod.modeValue
              _this.data.total.price += item.salePrice * item.quantity
            } else {
              _this.data.total.price += item.salePrice * item.quantity;
            }

          });
        }
      } else if (couponmethod.availableModel != "") {
        _this.data.total.price = 0;
        if (couponmethod.couponMode == 'rate') {
          this.data.cartList.forEach(function (item, index) {
            if (item.productId == couponmethod.availableModel) {
              item.salePrice = item.salePrice * (1 - couponmethod.modeValue);
              _this.data.total.price += item.salePrice * item.quantity
            } else {
              _this.data.total.price += item.salePrice * item.quantity;
            }
          });
        } else {
          this.data.cartList.forEach(function (item, index) {
            if (item.productId == couponmethod.availableModel) {
              item.salePrice = item.salePrice - couponmethod.modeValue
              _this.data.total.price += item.salePrice * item.quantity
            } else {
              _this.data.total.price += item.salePrice * item.quantity;
            }

          });
        }
      }
      else {
        _this.data.total.price = 0;
        if (couponmethod.couponMode == 'rate') {
          this.data.cartList.forEach(function (item, index) {
            if (item.productType == couponmethod.availableCatalog) {
              item.salePrice = item.salePrice * (1 - couponmethod.modeValue);
              _this.data.total.price += item.salePrice * item.quantity
            } else {
              _this.data.total.price += item.salePrice * item.quantity;
            }
          });
        } else {
          this.data.cartList.forEach(function (item, index) {
            if (item.productType == couponmethod.availableCatalog) {
              item.salePrice = item.salePrice - couponmethod.modeValue;
              _this.data.total.price += item.salePrice * item.quantity
            } else {
              _this.data.total.price += item.salePrice * item.quantity;
            }
          });
        }
      }
     
    }
//优惠
    this.setData({
      'total.price': _this.data.total.price,
    })
    var preferential = origintotalprice - _this.data.total.price;
    this.setData({
      //原价
      origintotalprice: origintotalprice,
     //优惠券节省钱
      preferential: preferential
    })
   
  },
  usecoupon() {
    this.data.xscoupon = false
    if (this.data.couponCode==''){
    wx.showToast({
      title: '优惠卷不能为空',
      icon: 'none',
      duration: 1000,
      mask: true,
      })
    }else{
    let para = {
      modelIds: this.modelIds,
      productItemIds: this.data.productItemIds,
      couponCode:this.data.couponCode,
      quantity: this.data.quantitys
    };
    request.req2('promotion/coupon', 'POST', para, (err, res) => {
      this.data.cartList = JSON.parse(wx.getStorageSync('cart'));
      if (res.code == '200') {
        this.setData({
          xscoupon:true,
          couponmsg: Object.assign({}, res.object),
        })
        this.jisuan(this.data.couponmsg);
      }else{
        this.data.useCouponMsg = res.object;
        this.setData({
          xscoupon: false,
          useCouponMsg: this.data.useCouponMsg
        })
        wx.showModal({
          content: res.object,
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
  onLoad: function (options) {
    this.setData({
      orderfrom: options.orderfrom,
    });
      $init(this)
    var cartList = JSON.parse(wx.getStorageSync('cart'));

    var that = this;
    that.setData({
      'total.num': cartList.length
    })
    that.data.productItemIds = [];
    let n = 0;
 
    cartList.forEach(function (item, index) {
      if (item.promotionTitle != '' && item.promotionTitle != null) {
        n += 1;
      }
      that.data.productItemIds.push(item.id);
      that.data.quantitys.push(item.quantity)
      that.data.modelIds.push(item.productId)
    });

    if (that.data.cartList.length == n) {
      that.setData({
        couponshow: false,
      })
    } else {
      that.setData({
        couponshow: true,
        productItemIds: productItemIds,
        quantitys: quantitys,
        modelIds:modelIds
      })
    }
    that.setData({
      cartList: cartList,
    })
    request.req('addresslist', 'address', 'POST', {
    }, (err, res) => {
      if (res.length > 0) {
        let addressInfo = res[0]
        that.setData({
          addressInfo: addressInfo,//接数组
          hasAddress: true
        }) 
        this.getShipPrice();

      } else {
        that.setData({
          hasAddress: false
        })
      }
    });
    that.jisuan();
  
  },
  getShipPrice(){
    if (this.data.addressInfo.receiveProvince!=''){
      let province = this.data.addressInfo.receiveProvince;
      var price = [],
        quantity = [],
        typeIds = [];
      this.data.cartList.forEach(function (item, index) {
        price.push(item.salePrice);
        quantity.push(item.quantity);
        typeIds.push(item.productCatalog);
      });
      request.req2('order/getShipPrice', 'POST', {
        "price": price,
        "province": province,
        "quantity": quantity,
        "typeIds": typeIds
      }, (err, res) => {
        if (res.code == 200) {
          this.data.freight = res.object;
          this.data.total.price += this.data.freight;
          this.setData({
            freight: this.data.freight,
            'total.price': this.data.total.price
          })
        }
      });
    }else{
      return
    }

  },
  onShow: function () {

    // 生命周期函数--监听页面显示
    //获取默认地址
   
    this.getShipPrice();
  

  },
  paynow: function (e) {
   //保存订单接口获取ordercode
    var that = this;
    if (that.data.addressInfo.id == undefined) {
      wx.showToast({
        title: '收货地址不能为空',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    request.req2(uri_order_confirm, 'POST',{
      productItemIds: that.data.productItemIds,  // 购物车id
      addressId: that.data.addressInfo.id, //地址id
      couponCode: that.data.couponCode,  //暂时为空  优惠券id
      quantity: that.data.quantitys,
      modelIds: that.data.modelIds,
      remark: that.data.remark,
      type: that.data.orderfrom
    }, (err, res) => {
          if (res.code == 200) {
            var orderNo=res.object.order.orderNo;
            wx.removeStorageSync('cart');
            this.setData({
              disabled: true
            })
            wx.login({
              success: function (res) {
                request.req2(`order/weixin/browser/${orderNo}/${res.code}`, 'GET', null, (err, res) => {
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
                      wx.showToast({
                        title: '支付失败',
                        icon: 'none',
                        duration: 2000
                      })
                      wx.switchTab({
                        url: '../mime/mime',
                      })
                    },
                    complete: function () {
                      wx.switchTab({
                        url: '../mime/mime',
                      })
                    }
                  })
                });      
               }
            })
          }
          else {
            wx.showToast({
              icon: 'none',
              title: res.msg,
              duration: 2000
            })
          }
        })
      } 

  
})