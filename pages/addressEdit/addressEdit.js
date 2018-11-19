
var request = require('../../utils/https.js')
//地址模板
var model = require('../../model/model.js')
var show = false;
//弹出地址选择
var item = {};
Page({
  data: {
    item: {
      show: show
    },
    addressInfo: {},
    province: '',
    city: '',
    county: '',
    addrForm:{
      person:'',
      phone:'',
      address:'',
    },
  },
  /**
* 弹出框蒙层截断touchmove事件
*/
  preventTouchMove() {
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
  //收货人赋值
  bindNameInput: function (e) {
    this.setData({
      ["addrForm.person"]: e.detail.value
    })
  },
  //手机号赋值
  bindPhoneInput: function (e) {

    var phone = e.detail.value;
    if (!(/^1\d{10}$/.test(phone))) {
        wx.showToast({
          title: '手机号格式不正确',
          icon: 'none',
          duration: 1000
        })
        return;

    } else {
      this.setData({
        ["addrForm.phone"]: e.detail.value
      })
    } 

    
    
  },

  //详细地址赋值
  bindAddressInput: function (e) {
    this.setData({
      ["addrForm.address"]: e.detail.value
    })
  },
  //保存
  addAddress: function () {
    var that = this;
    if (that.data.addrForm.person.length == 0) {
      wx.showToast({
        title: '收货人不能为空',
        icon: 'none',
        mask: true
      })
    } else if (that.data.addrForm.phone.length == 0) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
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
    } else if (that.data.addrForm.address.length == 0) {
      wx.showToast({
        title: '详细地址不为空',
        icon: 'loading',
        mask: true
      })
    } else {

      request.req2('address/update?id='+that.data.addrForm.id, 'POST', {
        person: that.data.addrForm.person,
        phone: that.data.addrForm.phone,
        receiveProvince: that.data.province,
        receiveCity: that.data.city,
        receiveDistrict: that.data.county,
        address: that.data.addrForm.address,
        tel:''
      }, (err, res) => {

        if (res.code == 200) { //地址保存成功
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
  onshow(options){
  
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载

    let addr = JSON.parse(options.addrForm);
    this.setData({
      addrForm: addr,
      province: addr.receiveProvince,
      city: addr.receiveDistrict,
      county: addr.receiveCity,
    })
   
  },


})