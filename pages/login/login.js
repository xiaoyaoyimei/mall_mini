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
    request.req(uri,'POST', {
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
        if (option.specId && option.goodsId) { //立即购买
          var that = this;
          request.req(uribuy,'POST', {
            specId: option.specId,
            count: '1',
            saveType: '1',
            goodsId: option.goodsId
          }, (err, res) => {
            var result = res.data;
            console.log(result);
            if (result.result == 1) { //获取cartId
              //拿着cartId跳转到确认订单界面
              console.log("哈哈")
              var cartIds = result.data[0].cartIds;
              wx.redirectTo({   //获取cartId
                url: '../orderConfirm/orderConfirm?cartIds=' + cartIds,
              })

            } else {
              console.log(res.data.msg)
              that.setData({ showToast: res.data.msg })
              //跳转到goodsDetail**
              setTimeout(
                wx.redirectTo({   //获取cartId
                  url: '../goodsDetail/goodsDetail?specId=' + option.specId,
                }), 2000)
            }
          })
        } else if (option.id == 2) {
          wx.navigateTo({   //加个参数  
            url: '../addressManager/addressManager'
          })
          console.log("跳转到售后界面")
        } else {
          wx.navigateTo({
            url: '../ordertotal/ordertotal?id=' + option.id,
          })
          console.log("跳转到ordertotal界面")
        }

      } else {
        //提示
        console.log(res)
        that.setData({
          showToast: res.data.msg,
          backcolor: 'red',
        })
      }
    })
  },
  onLoad: function (options) {  //id==1 从商品详情跳转过来的，到确认订单界面
    console.log(options)
    option = options;  //存储options
  },

})