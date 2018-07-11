
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
     invoiceForm: {
       orderNo: '',
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
  invoiceFormSubmit(e){
    var that = this;
    var formData = e.detail.value;
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
    
      if(res.data.code==200){
        var pages = getCurrentPages()
        var prevPage = pages[pages.length - 2]  //上一个页面
        var that = this

        prevPage.setData({
          ["orderdetail.shippingInvoice"]: that.data.invoiceForm
        })
        wx.navigateBack({//返回
          delta:1
        })

        // wx.redirectTo({
        //   url: `../orderDetail/orderDetail?orderNo=${that.data.invoiceForm.orderNo}&orderStatus=${}`  
        // })
      }
    });
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
    console.log(item.provinces[item.value[0]])
    this.setData({
      province: item.provinces[item.value[0]],
      city: item.citys[item.value[1]],
      county: item.countys[item.value[2]]
    });
  },
  onLoad(options){
    options = options;
    
    request.req2('order', 'GET', options.orderNo, (err, res) => {
      this.setData({
        invoiceForm: res.data.shippingInvoice,
        province: res.data.shippingInvoice.receiveProvince,
        city: res.data.shippingInvoice.receiveCity,
        county: res.data.shippingInvoice.receiveDistrict,
     
      })
    })
  }
})