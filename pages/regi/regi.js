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
    txm:'',
    yzm:'',
    userInfo: {},
    disabled: true,  //是否能点击
    plain: false,
    loading: false,    //true 为加载中
    showToast: '',
    txv:1,
    verimg:'',
    hadsend:false,
  },

  //用户名
  bindusnInput: function (e) {
    this.setData({
      username: e.detail.value,
    })

  },
  //图形码
  bindimgInput: function (e) {
   this.setData({
     txm: e.detail.value,
  })
},
//短信码
    bindmesInput: function(e) {
    this.setData({
      yzm: e.detail.value,
    })
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
  getimgcode(){
    var that=this;
      if (this.data.username == "") {
        wx.showToast({
          title: '手机号不能为空',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      var myreg = /^[1][0-9]{10}$/; 
      if (!myreg.test(this.data.username)) {
        wx.showToast({
          title: '手机号格式不正确',
          icon: 'none',
          duration: 2000
        })
        return;
      } else {
      wx.request({
        url: 'https://m.shop.dxracer.cn/mall/wap/customer/validate?userName=' + that.data.username,
        method: 'POST',    //大写
        header: { 'Content-Type': 'application/json'},
        success(res) {
          if (res.data.code == '200') {
            console.log("res")
            that.data.txv++;
            that.data.verimg = 'https://m.shop.dxracer.cn/mall/wap/customer/' + that.data.username + '/verification.png?v=' + that.data.txv;
            that.setData({
              verimg: that.data.verimg,
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
        }
        })
      }

  },
  getdxcode(){
    var that=this;
    let txm = this.data.txm;
    if (txm == null || txm == '') {
      wx.showToast({
        title: '图形码不能为空',
        icon: 'none',
        duration: 2000
      })
      return;
    } else {
      that.setData({
        hadsend: true,
      })
      wx.request({
        url: 'https://m.shop.dxracer.cn/mall/wap/customer/register/shortmessage' ,
        method: 'POST',    //大写
        header: { 'Content-Type': 'application/json' },
        data: {
          "mobile": that.data.username,
          "verificationCode": that.data.txm
          },
        success(res) {
          var data=res.data;
          if (data.code == 200) {
           
            that.setData({
              hadsend: false,
            })
          } else {
            
            wx.showToast({
              title: data.msg,
              icon: 'none',
              duration: 2000
            })
            that.setData({
              hadsend: true,
            })
          }
        }
      })

    }
  },

  //确定
  loginbutton: function () {

    var that = this;
    that.setData({
      loading: true,
      disabled: true,
    })
    var username = that.data.username;
    var psword = that.data.psword;
    var txm = that.data.txm;
    var yzm = that.data.yzm;
    //访问网络
    wx.login({
      success: res => {
        var code = res.code;
        if (code) {
          request.req('regi', 'customer/register', 'POST', {
            loginName: username,
            passWord: psword,
            verificationCode: txm,
            shortMessage: yzm,
            wxcode:code
          }, (err, res) => {
            this.setData({
              loading: false,
              disabled: false,
            })
            //保存
            if (res.data.code == '200') {
              //登陆成功 跳转
              wx.navigateTo({   //加个参数  
                url: '../login/login?fromurl=index'
              })

            } else {
              //提示
              that.setData({
                showToast: res.data.msg,
                backcolor: 'red',
              })
            }
          })
        }
      }
    })
 
  },


})