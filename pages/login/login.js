//mime.js
var util = require('../../utils/util.js')
var request = require('../../utils/https.js')
var app = getApp()
var uri = 'customer/login'  //登录接口
var option = {}
var uribuy = 'cartapi/addCart' //立即购买
Page({
  data: {
    backcolor: '#f0f2f5',
    username: '',
    psword: '',
    userInfo: {},
    disabled: true,  //是否能点击
    plain: false,
    loading: false,    //true 为加载中
    showToast: '',
  },

  //用户名
  bindusnInput: function (e) {
    this.setData({
      username: e.detail.value,
    })
    if (this.data.username && this.data.psword) {
      this.setData({ disabled: false })
    } else {
      this.setData({ disabled: true })
    }
  },
  //密码
  bindpsdInput: function (e) {
    this.setData({
      psword: e.detail.value,
    })
    if (this.data.username && this.data.psword) {
      this.setData({ disabled: false })
    } else {
      this.setData({ disabled: true })
    }
  },
  //确定--登陆
  loginbutton: function () {

    var that = this;
    that.setData({
      loading: true,
      disabled: true,
    })
    var username = that.data.username;
    var psword = that.data.psword;
    //访问网络
    request.req(option.fromurl,uri,'POST', {
      loginName: username,
      passWord: psword
    }, (err, res) => {

      this.setData({
        loading: false,
        disabled: false,
      })
      //保存
      if (res.data.code =='200') {
        var result = res.data.object
        //存储数据
        var CuserInfo = {
          token: result.token,
          userId: result.userId,
        };

     
        wx.setStorageSync('CuserInfo', CuserInfo);

        //登陆成功 跳转

        if (option.fromurl=="cart") { //立即购买
   
          wx.switchTab({   //加个参数  
            url: '../cartOne/cartOne'
          })
        } else if (option.fromurl == 'addresslist') {
          wx.navigateBack({   //加个参数  
            url: '../addressManager/addressManager'
          })
         
        } else if (option.fromurl == 'orderlist'){
          wx.navigateBack({
            url: '../ordertotal/ordertotal',
          })
        
        } else if (option.fromurl == 'account'){
          wx.switchTab({
            url: '../mime/mime',
          })

        } else if (option.fromurl == 'index'){
          wx.switchTab({
            url: '../index/index',
          })
        }else{
          wx.navigateBack({
            url: '../goodsDetail/goodsDetail?specId=' + option.fromurl,
          })
        }

      } else {
        //提示
        that.setData({
          showToast: res.data.object,
          backcolor: 'red',
        })
      }
    })
  },
  onLoad: function (options) {  //id==1 从商品详情跳转过来的，到确认订单界面
    option = options;  //存储options
  },

})