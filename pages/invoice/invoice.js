
//地址模板
var model = require('../../model/model.js')
var request = require('../../utils/https.js')
var show = false;
var item = {};
var orderStatus='';
Page({
  data:{
    item: {
      show: show
    },
    orderNo: '',
    orderNoshow:false,
    invoiceForm: {  
      headType: '个人',  
       invoiceTitle: '',
       invoiceType: '增值税普通发票',
       receivePerson: '',
      invoiceCode:"",
       receivePhone: '',
       selectedOptionsAddr: [],
       bankName: '',
       bankNo: '',
       receiveAddress: '',
       registerAddress: '',
       registerPhone: '',
      //  province: '请选择省市区',
     },
    province: '',
    city:'',
    county: '',
   
  },
  /**
 * 弹出框蒙层截断touchmove事件
 */
   preventTouchMove(){
  },
  listenerRadioGroup: function (e) {
    if (e.detail.value =='增值税普通发票'){
      this.setData({
        ["invoiceForm.invoiceType"]: '增值税普通发票'
      });
    }else{
      this.setData({
        ["invoiceForm.invoiceType"]: '增值税专用发票'
      });
    }
  },
  listenertype: function (e) {
    if (e.detail.value == '个人') {
      this.setData({
        ["invoiceForm.headType"]: '个人'
      });
    } else {
      this.setData({
        ["invoiceForm.headType"]: '公司'
      });
    }
  },
  //收票人手机验证
  bindPhoneInput: function (e) {
    var phone = e.detail.value;
    if (!(/^1\d{10}$/.test(phone))) {
      wx.showToast({
        title: '收票人手机号格式不正确',
        icon: 'none',
        duration: 1000
      })
      return;
    }
  },
  bindregisterPhoneInput: function (e) {
    var phone = e.detail.value;
    if (!(/^1\d{10}$/.test(phone))) {
      wx.showToast({
        title: '注册手机号格式不正确',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    this.setData({
      ["invoiceForm.registerPhone"]: e.detail.value
    })
  },
  bindregisterAddressInput: function (e) {
    this.setData({
      ["invoiceForm.registerAddress"]: e.detail.value
    })
  },
  bindbankNoInput: function (e) {
    var phone = e.detail.value;
    this.setData({
      ["invoiceForm.bankNo"]: e.detail.value
    })
  },
  bindbankNameInput: function (e) {
    this.setData({
      ["invoiceForm.bankName"]: e.detail.value
    })
  },
  bindreceivePhoneInput: function (e) {
    var phone = e.detail.value;
    if (!(/^1\d{10}$/.test(phone))) {
      wx.showToast({
        title: '收票人手机号格式不正确',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    this.setData({
      ["invoiceForm.receivePhone"]: e.detail.value
    })
  },
  bindreceivePersonInput: function (e) {

    this.setData({
      ["invoiceForm.receivePerson"]: e.detail.value
    })
  },
  bindreceiveAddressInput: function (e) {
   
    this.setData({
      ["invoiceForm.receiveAddress"]: e.detail.value
    })
  },
  bindinvoiceTitleInput: function (e) {
    this.setData({
      ["invoiceForm.invoiceTitle"]: e.detail.value
    })
  },
  bindinvoiceCodeInput: function (e) {
    this.setData({
      ["invoiceForm.invoiceCode"]: e.detail.value
    })
  },
  invoiceFormSubmit(e){

    var that = this;
    var formData = e.detail.value;

    if (formData.receivePhone == "" || that.data.province == "" || that.data.city == "" || that.data.county == "" || formData.receiveAddress == "" || formData.receivePerson == "" ){
      wx.showToast({
        title: '请完善发票信息',
        icon: 'none',
        duration: 1000
      })
      return 
    }
    else{
    that.setData({
      'invoiceForm.receiveProvince': this.data.province,
      'invoiceForm.receiveCity': this.data.city,
      'invoiceForm.receiveDistrict': this.data.county,
    })
      if (this.data.invoiceForm.orderNo == undefined || this.data.invoiceForm.orderNo == '' ){
        if (wx.getStorageSync('invoiceFormshow') == 'true'){
          wx.removeStorageSync('invoiceForm');
        }
        wx.setStorageSync('invoiceForm', JSON.stringify(this.data.invoiceForm));
        wx.setStorageSync('invoiceFormshow', 'true');
        var pages = getCurrentPages()
        var prevPage = pages[pages.length - 2]  //上一个页面
        var that = this
        prevPage.setData({
          address: 'addrDingdang',
        })
        wx.navigateBack({//返回
          delta: 1
        })
    }else{
        let orderInvoiceForm = that.data.invoiceForm
        delete orderInvoiceForm['selectedOptionsAddr']
        request.req('invoice', 'order/invoice/save', 'POST',  orderInvoiceForm, (err, res) => {
        if (res.code == 200) {
          //将发票信息传到上一个页面
          var pages = getCurrentPages()
          var prevPage = pages[pages.length - 2]  //上一个页面
          var that = this
          prevPage.setData({
            ["orderdetail.shippingInvoice"]: that.data.invoiceForm
          })
          wx.navigateBack({//返回
            delta: 1
          })

        }
      });
    }

    }
  },
  //生命周期函数--监听页面初次渲染完成
  onReady: function (e) {
    var that = this;
    //请求数据
    model.updateAreaData(that, 0, e);
  },
  //点击选择城市按钮显示picker-view
  translate: function (e) {
    model.animationEvents(this, 0, true, 400);
  },
  //隐藏picker-view
  hiddenFloatView: function (e) {
    model.animationEvents(this, 200, false, 400);
  },

  //滑动事件
  bindChange: function (e) {
    model.updateAreaData(this, 1, e);

    item = this.data.item;
    this.setData({
      province: item.provinces[item.value[0]],
      city: item.citys[item.value[1]],
      county: item.countys[item.value[2]]
    });
  },
  onLoad(options){
    options = options;
    if (options.orderNo == undefined || options.orderNo == ''){
      this.setData({
        orderNoshow: false,
      });
    }else{
      this.setData({
        orderNoshow: true,
        orderNo: options.orderNo
      });
    }
    },
  onShow(){
    if (this.data.orderNo == undefined || this.data.orderNo == '') {
      if (wx.getStorageSync("invoiceFormshow") == 'true') {
        let invoiceForm = JSON.parse(wx.getStorageSync('invoiceForm'))
        this.setData({
          orderNoshow:false,
          'invoiceForm.invoiceTitle': invoiceForm.invoiceTitle || '',
          'invoiceForm.invoiceType': invoiceForm.invoiceType || '',
          'invoiceForm.receivePerson': invoiceForm.receivePerson || '',
          'invoiceForm.receivePhone': invoiceForm.receivePhone || '',
          'invoiceForm.receiveAddress': invoiceForm.receiveAddress || '',
          'invoiceForm.bankName': invoiceForm.bankName || '',
          'invoiceForm.bankNo': invoiceForm.bankNo || '',
          'invoiceForm.invoiceCode': invoiceForm.invoiceCode || '',
          'invoiceForm.registerAddress': invoiceForm.registerAddress || '',
          'invoiceForm.registerPhone': invoiceForm.registerPhone || '',
          'invoiceForm.headType': invoiceForm.headType || '',
          'province': invoiceForm.receiveProvince || '',
          'city': invoiceForm.receiveCity || '',
          'county': invoiceForm.receiveDistrict || '',
        })
      }

    } else {
      request.req2(`order/${this.data.orderNo}`, 'GET', null, (err, res) => {
        if (res.shippingInvoice != "") {
          this.setData({
            orderNoshow:true,
            'invoiceForm.orderNo': res.shippingInvoice.orderNo,
            'invoiceForm.invoiceTitle': res.shippingInvoice.invoiceTitle,
            'invoiceForm.invoiceType': res.shippingInvoice.invoiceType,
            'invoiceForm.receivePerson': res.shippingInvoice.receivePerson,
            'invoiceForm.receivePhone': res.shippingInvoice.receivePhone,
            'invoiceForm.receiveAddress': res.shippingInvoice.receiveAddress,
            'invoiceForm.bankName': res.shippingInvoice.bankName,
            'invoiceForm.bankNo': res.shippingInvoice.bankNo,
            'invoiceForm.invoiceCode': res.shippingInvoice.invoiceCode,
            'invoiceForm.registerAddress': res.shippingInvoice.registerAddress,
            'invoiceForm.registerPhone': res.shippingInvoice.registerPhone,
            'invoiceForm.headType': res.shippingInvoice.headType,
            province: res.shippingInvoice.receiveProvince,
            city: res.shippingInvoice.receiveCity,
            county: res.shippingInvoice.receiveDistrict,
          })
        }
      })
    }
  }
})