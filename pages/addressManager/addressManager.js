
var request = require('../../utils/https.js')
var uri_address_list = 'address' //地址列表
var uri_address_delete = 'address/delete' //删除地址

Page({
  data:{
    addressData:[],
  },
  addressClick:function(e){
    var addr = {};
    addr = e.currentTarget.dataset.item;
    wx.setStorage({
      key: 'address',
      data: addr,
      success() {
        wx.navigateBack();
      }
    })
  },
  addrDelete:function(e){
    var that = this;
    var addressId = e.currentTarget.dataset.item.id;
    var CuserInfo = wx.getStorageSync('CuserInfo');
    wx.showModal({
      title: '确认删除该地址吗？',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: 'https://m.shop.dxracer.cn/mall/wap/address/delete?id=' + addressId,
            method: 'POST',    //大写
            header: { 'Content-Type': 'application/json', 'token': CuserInfo.token, 'loginUserId': CuserInfo.userId },
            success(res) {
              if (res.data.code == 401) {  //token失效 用code换下token
                wx.redirectTo({   
                  url: '../login/login',
                })
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
        }
      }
    })
  },
  addressAdd:function(){
    wx.navigateTo({
      url: '../addressAdd/addressAdd',
    })
  },
  onLoad:function(options){
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
      })
    });
  },
  onShow: function() {
    // 生命周期函数--监听页面加载
    this.getAddressList();
  },
})