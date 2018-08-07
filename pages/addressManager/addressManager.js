
var request = require('../../utils/https.js')
var uri_address_list = 'address' //地址列表
var uri_address_delete = 'address/delete' //删除地址
var mime=0;
Page({
  data:{
    addressData:[],
    loginhidden: true
  },
  switch1Change: function (e) {
    var that = this;
    var addressId = e.currentTarget.dataset.itemId;
    let isDefault=e.detail.value;
    if (isDefault){
      isDefault='Y';
    }else{
      isDefault = 'N';
    }
    var CuserInfo = wx.getStorageSync('CuserInfo');
    if (CuserInfo.token) {
    wx.request({
      url: `https://m.shop.dxracer.cn/mall/wap/address/updateDefault?id=${addressId}&isDefault=${isDefault}`,
      method: 'POST',    //大写
      header: { 'Content-Type': 'application/json', 'token': CuserInfo.token, 'loginUserId': CuserInfo.userId },
      success(res) {
        if (res.data.code == 401) {  //token失效 用code换下token
          wx.showToast({
            title: '认证已过期，请重新登录',
            icon: 'none',
            duration: 2000
          })
          wx.removeStorageSync('CuserInfo')
        }
        if (res.data.code == 200) {
          that.getAddressList();
        }
      },
      fail(e) {
        console.error(e)
        callback(e)
      }
    })
    }else{
      wx.showToast({
        title: '认证已过期，请重新登录',
        icon: 'none',
        duration: 2000
      })
      wx.removeStorageSync('CuserInfo')
    }
  },
  addressClick:function(e){
    let addrForm = JSON.stringify(e.currentTarget.dataset.item);
    let addrDingdang=e.currentTarget.dataset.item;
    if(mime==1){
      wx.navigateTo({
        url: `../addressEdit/addressEdit?addrForm=${addrForm}`,
      })
    }
    else{
      var pages = getCurrentPages()
      var prevPage = pages[pages.length - 2]  //上一个页面
      var that = this
      prevPage.setData({
        addressInfo: addrDingdang,
        hasAddress:true
      })
      wx.navigateBack({//返回
        delta: 1
      })
    }

  },
  addrDelete:function(e){
    var that = this;
    var addressId = e.currentTarget.dataset.itemId;
    var CuserInfo = wx.getStorageSync('CuserInfo');
    wx.showModal({
      title: '确认删除该地址吗？',
      success: function(res) {
        if (res.confirm) {
          request.req5('address/delete', 'POST', addressId, {}, (err, res) => {
            if (res.data.code == 200) {
              that.getAddressList();
            }
          })
        }
      }
    })
  },
  addrEdit:function(e){
   
    let addrForm = JSON.stringify(e.currentTarget.dataset.item);

    wx.navigateTo({
      url: `../addressEdit/addressEdit?addrForm=${addrForm}`,
    })
  },
  addressAdd:function(){
    wx.navigateTo({
      url: '../addressAdd/addressAdd',
    })
  },
  onLoad:function(options){
      mime = options.mime
  },
  onReady: function() {
    // Do something when page ready.
  },
  getAddressList(){
    var that = this;
    request.req('addresslist',uri_address_list, 'POST', {
    }, (err, res) => {
      that.setData({
        addressData: res.data,//接数组
        loginhidden:false
      })
    });
  },
  onShow: function() {
    // 生命周期函数--监听页面加载
    var that = this;
    var CuserInfo = wx.getStorageSync('CuserInfo');

    if (CuserInfo.token) {
    this.getAddressList();
    }else{
      that.setData({
        loginhidden: true,
      });
    }
  },
})