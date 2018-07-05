
var request = require('../../utils/https.js')
var uri_save_address = 'address/insert' //确认订单

Page({
  data: {
  array:[],
    arrayCity: [],
    arrayDistrict: [],
    index: 0,
    indexC: 0,
    indexD: 0,
    name: '',
    phoneNum: '',
    zipCode: '',
    detailAddress: '',
    pId: '',
    cId: '',
    dId: '',
    pName: '',
    cName: '',
    dName: '',
    addressInfo: {},
  },
  //省
  bindProvinceChange: function (e) {
    this.setData({
      index: e.detail.value,
      arrayCity: this.data.array[e.detail.value].children,
      pId: this.data.array[e.detail.value].code,
      pName: this.data.array[e.detail.value].label,
    })
  },
  //市
  bindCityChange: function (e) {
    this.setData({
      indexC: e.detail.value,
      arrayDistrict: this.data.arrayCity[e.detail.value].children,
      cId: this.data.arrayCity[e.detail.value].code,
      cName: this.data.arrayCity[e.detail.value].label,
    })
  },
  //区
  bindDistrictChange: function (e) {
    this.setData({
      indexD: e.detail.value,
      dId: this.data.arrayDistrict[e.detail.value].code,
      dName: this.data.arrayDistrict[e.detail.value].label,
    })
  },
  //收货人赋值
  bindNameInput: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  //手机号赋值
  bindPhoneInput: function (e) {
    this.setData({
      phoneNum: e.detail.value
    })
  },

  //详细地址赋值
  bindAddressInput: function (e) {
    this.setData({
      detailAddress: e.detail.value
    })
  },
  //保存
  addAddress: function () {
    var that = this;
    if (that.data.name.length == 0) {
      wx.showToast({
        title: '收货人不能为空',
        icon: 'loading',
        mask: true
      })
    } else if (that.data.phoneNum.length == 0) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'loading',
        mask: true
      })
    }  else if (that.data.pId.length == 0) {
      wx.showToast({
        title: '请选所在省份',
        icon: 'loading',
        mask: true
      })
    } else if (that.data.cId.length == 0) {
      wx.showToast({
        title: '请选择所在市',
        icon: 'loading',
        mask: true
      })
    } else if (that.data.dId.length == 0) {
      wx.showToast({
        title: '请选择所在区县',
        icon: 'loading',
        mask: true
      })
    } else if (that.data.detailAddress.length == 0) {
      wx.showToast({
        title: '详细地址不能为空',
        icon: 'loading',
        mask: true
      })
    } else {
      request.req(uri_save_address,'POST', {
        person: that.data.name,
        phone: that.data.phoneNum,
        receiveProvince: that.data.pName,
        receiveCity: that.data.cName,
        receiveDistrict: that.data.dName,
        address: that.data.detailAddress,
      }, (err, res) => {

        if (res.data.code == 200) { //地址保存成功
          wx.navigateBack({
            delta: 1, // 回退前 delta(默认为1) 页面
            success: function (res) {
              // success
            },
            fail: function () {
              // fail
            },
            complete: function () {
              // complete
            }
          })
        } else {
          wx.showToast({
            title: '保存失败',
            icon: 'loading',
            duration: 1500
          })
        }
      })
    }
  },
  onLoad: function () {
    // 生命周期函数--监听页面加载
    var that = this;
    // 生命周期函数--监听页面加载
    request.req('common/address', 'POST', {}, (err, res) => {
      that.setData({
        array: res.data,//接数组
      })
    });
  },
})