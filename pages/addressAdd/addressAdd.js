
var request = require('../../utils/https.js')
//地址模板
var model = require('../../model/model.js')
var uri_save_address = 'address/insert' //确认订单
var show = false;
var item = {};
Page({
  data: {
    item: {
      show: show
    },
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
    addressInfo: {},
    province:'',
    city:'',
    county:'',
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
    } else if (that.data.province == 0) {
      wx.showToast({
        title: '请选所在省份',
        icon: 'loading',
        mask: true
      })
    } else if (that.data.city == 0) {
      wx.showToast({
        title: '请选择所在市',
        icon: 'loading',
        mask: true
      })
    } else if (that.data.county == 0) {
      wx.showToast({
        title: '请选择所在区县',
        icon: 'loading',
        mask: true
      })
    } else if (that.data.detailAddress.length == 0) {
      wx.showToast({
        title: '详细地址不为空',
        icon: 'loading',
        mask: true
      })
    } else {
      request.req('addresslist',uri_save_address,'POST', {
        person: that.data.name,
        phone: that.data.phoneNum,
        receiveProvince: that.data.province,
        receiveCity: that.data.city,
        receiveDistrict: that.data.county,
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

  },
  
})