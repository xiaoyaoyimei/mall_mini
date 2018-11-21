
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
    invoiceForm: {    
       invoiceTitle: '',
       invoiceType: '增值税普通发票',
       receivePerson: '',
       receivePhone: '',
       selectedOptionsAddr: [],
       bankName: '',
       bankNo: '',
       invoiceCode: '',
       receiveAddress: '',
       registerAddress: '',
       province: '请选择省市区',
       city: '',
       county: '',
     },
   
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
      invoiceForm: formData
    })
    request.req('invoice', 'order/invoice/save', 'POST', { 
      orderNo: formData.orderNo,
      invoiceTitle:formData.invoiceTitle,
      invoiceType: formData.invoiceType,
      receivePerson: formData.receivePerson,
      receivePhone: formData.receivePhone,
      receiveAddress: formData.receiveAddress,
      receiveProvince: that.data.province,
      receiveCity: that.data.city,
      receiveDistrict: that.data.county,
      bankName: formData.bankName,
      bankNo: formData.bankNo,
      invoiceCode: formData.invoiceCode,
      registerAddress: formData.registerAddress
    }, (err, res) => {
      if(res.code==200){
        //将发票信息传到上一个页面
        var pages = getCurrentPages()
        var prevPage = pages[pages.length - 2]  //上一个页面
        var that = this
        prevPage.setData({
          ["orderdetail.shippingInvoice"]: that.data.invoiceForm
        })
        wx.navigateBack({//返回
          delta:1
        })

      }
    });
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
    var orderNo = options.orderNo;
    this.setData({
      orderNo: orderNo
    });
    request.req2(`order/${orderNo}`, 'GET', null, (err, res) => {
      if (res.shippingInvoice!=""){
      this.setData({
        invoiceForm: res.shippingInvoice,
        province: res.shippingInvoice.receiveProvince,
        city: res.shippingInvoice.receiveCity,
        county: res.shippingInvoice.receiveDistrict,
      })
      }
    })
  }
})