
var request = require('../../utils/https.js')
var uri_address_list = 'address' //地址列表
var uri_address_delete = 'address/delete' //删除地址
var mime=0;
Page({
  data:{
    addressData:[],
    loginhidden: true
  },
  addressClick:function(e){
    let addrForm = JSON.stringify(e.currentTarget.dataset.item);
    if(mime==1){
      wx.navigateTo({
        url: `../addressEdit/addressEdit?addrForm=${addrForm}`,
      })
    }
    else{
    
      //从购物车2页面返回
      wx.setStorage({
        key: 'address',
        data: addrForm,
        success() {
          wx.navigateBack();
        }
      })
    }

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