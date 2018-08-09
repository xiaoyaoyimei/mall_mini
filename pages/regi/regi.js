//mime.js
var util = require('../../utils/util.js')
var request = require('../../utils/https.js')
var app = getApp()
var baseUrl = app.globalData.baseorgin;
var uri = 'customer/login'  //登录接口
var option = {}
var uribuy = 'cartapi/addCart' //立即购买

var countdown = 180;
var settime = function (that) {
  if (countdown == 0) {
    that.setData({
      is_show: true
    })
    countdown = 180;
    return;
  } else {
    that.setData({
      is_show: false,
      last_time: countdown
    })

    countdown--;
  }
  setTimeout(function () {
    settime(that)
  }, 1000)
}
Page({
  data: {
    backcolor: '#f0f2f5',
    username: '',
    psword: '',
    txm:'',//图形码bindimgInput
    yzm:'',
    userInfo: {},
    disabled: true,  //是否能点击
    plain: false,
    loading: false,    //true 为加载中
    showToast: '',
    txv:1,
    verimg:'',
    last_time: '',
    is_show: true
  },
  //手机号
  gettxNum(e) {
    var phone = e.detail.value;
    if (!(/^1\d{10}$/.test(phone))) {
      util.showError('手机号格式不正确');
      return;
    }else{
      this.setData({
        username: phone,
      });
      this.getimgcode();
    }
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
  //获取图形码
  getimgcode(){
    var that=this;
      if (this.data.username == "") {
        util.showError('手机号不能为空');
        return;
      } else {
        request.req6('customer/register/shortmessage', 'POST', `userName=${that.data.username}`,{
          //搜索过滤     
          "mobile": that.data.username,
          "verificationCode": that.data.txm
        }, (err, res) => {
          if (res.data.code == 200) {
             that.data.txv++;
             that.data.verimg = `${baseUrl}customer/${that.data.username}/verification.png?v=${that.data.txv}`;
             that.setData({
               verimg: that.data.verimg,
             })
          } else {
             util.showError(res.data.msg);
           }
        });

      }

  },
  //获取验证码
  getdxcode(){
    var that=this;
    // 将获取验证码按钮隐藏180s，180s后再次显示
    let txm = this.data.txm;
    if (txm == null || txm == '') {
      util.showError('图形码不能为空');
      return;
    } else {  
    // 将获取验证码按钮隐藏180s，180s后再次显示
    that.setData({
      is_show: (!that.data.is_show)  //false
    })
    settime(that);
      request.req3('customer/register/shortmessage', 'POST', {
        //搜索过滤     
        "mobile": that.data.username,
        "verificationCode": that.data.txm
      }, (err, res) => {
        if (res.data.code == 200) {

        } else {
          that.setData({
            showToast: res.data.msg,
            backcolor: 'red',
          })
        }
      });
    }
  },

  //确定
  regibutton: function () {

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
          request.req3('customer/register', 'POST', {
            loginName: username,
            passWord: psword,
            verificationCode: txm,
            shortMessage: yzm,
            wxCode:code
          }, (err, res) => {
            this.setData({
              loading: false,
              disabled: false,
            })
            //保存
            if (res.data.code == '200') {
              util.showSuccess('注册成功');
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