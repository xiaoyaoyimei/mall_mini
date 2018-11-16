//var rootDocment = 'http://10.0.0.28:8080/mall/wap/';//  前缀-测试环境
var rootDocment ='https://m.shop.dxracer.cn/mall/wap/'
var util = require('./util.js')
var auto = 'customer/login';
//携带TOKEN req req2 req5都需携带token
function req(fromurl,url, methodway, data, callback) {
      
  var fromurl = fromurl;
  var CuserInfo = wx.getStorageSync('CuserInfo');
  //如果登录凭证为空。微信联合登录
  if (CuserInfo.token){
    //如果有token，就把token放到header
    wx.request({
      url: rootDocment + url,
      data: data,
      method: methodway,    //大写
      header: { 'Content-Type': 'application/json', 'token': CuserInfo.token, 'loginUserId': CuserInfo.userId },
      success(res) {
        if (res.data.code == 401) {
          // 清除token
          util.showError(res.data.msg);
          wx.removeStorageSync('CuserInfo')
        } else {
          callback(null, res)
        }
      },
      fail(e) {
        console.error(e)
        callback(e)
      }
    })
 }
  else{
    wx.login({
      success: res => {
        // ------ 获取凭证 ------
        var code = res.code;
        if (code) {
          req4('customer/wxlogin', 'POST', code, (err, res) => {
            if (res.data.code == 200) {
              wx.setStorageSync('openid', res.data)
              callback(null, res)
            } else {
              util.showError(res.data.msg);
              wx.removeStorageSync('CuserInfo')
              // wx.navigateTo({
              //   url: '../login/login?fromurl=index'
              // })
              return;
            }
          })
        } else {
          util.showError('获取用户登录失败');
        }
      }
    })
 
  } 
}

//请求直接加载url 上的
function req2(url, methodway, data, callback) {
  if(data==null||data==undefined){
    url=rootDocment + url 
  }else{
    url=rootDocment + url + '/' + data
  }
  var CuserInfo = wx.getStorageSync('CuserInfo');
  //token未过期
  if (CuserInfo.token){
    wx.request({
      url: url,
      method: methodway,    //大写
      header: { 'Content-Type': 'application/json', 'token': CuserInfo.token, 'loginUserId': CuserInfo.userId },
      success(res) {
        if (res.data.code == 401) {
          util.showError(res.data.msg);
          wx.removeStorageSync('CuserInfo')
        } else {
        callback(null, res)
        }
      },
      fail(e) {
        console.error(e)
        callback(e)
      }
    })
  }else{
    util.showError('认证已过期，请重新登录');
    wx.removeStorageSync('CuserInfo')
  }
}
function req5(url, methodway, uniunid, data, callback) {

  if (uniunid == null || uniunid == undefined) {
    url=rootDocment + url
  }else{
    url=rootDocment + url + '?id=' + uniunid
  }
  var CuserInfo = wx.getStorageSync('CuserInfo');
  if (CuserInfo.token) {
    wx.request({
      url: url,
      method: methodway,    //大写
      data: data,
      header: { 'Content-Type': 'application/json', 'token': CuserInfo.token, 'loginUserId': CuserInfo.userId },
      success(res) {
        callback(null, res)
      },
      fail(e) {
        console.error(e)
        callback(e)
      }
    })
  }
  else {
    util.showError('认证已过期，请重新登录');
    wx.removeStorageSync('CuserInfo')
  }
} 
//无需登录,不带TOKEN请求
function req3(url, methodway, data, callback) {
  wx.request({
  url: rootDocment + url,
  data: data,
  method: methodway,    //大写
  header: { 'Content-Type': 'application/json' },
  success(res) {
    callback(null, res)
  },
  fail(e) {
    console.error(e)
    callback(e)
  }
})
}

function req4(url, methodway, data, callback) {
    wx.request({
      url: rootDocment + url + '/' + data,
      method: methodway,    //大写
      header: { 'Content-Type': 'application/json' },
      success(res) {
        callback(null, res)
      },
      fail(e) {
        console.error(e)
        callback(e)
      }
    })
  } 
function req6(url, methodway, uniunid, data, callback) {
    wx.request({
      url: rootDocment + url + '?' + uniunid,
      method: methodway,    //大写
      data: data,
      header: { 'Content-Type': 'application/json' },
      success(res) {
        callback(null, res)
      },
      fail(e) {
        console.error(e)
        callback(e)
      }
    })
}

module.exports = {
  req: req,
  req2:req2,
  req3:req3,
  req4:req4,
  req5:req5,
  req6:req6
}  