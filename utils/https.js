
// var rootDocment = 'http://10.0.0.28:8080/mall/wap/';//  前缀-测试环境

var rootDocment ='https://m.shop.dxracer.cn/mall/wap/'
var util = require('./util.js')
//携带TOKEN req req2 都需携带token
function req(fromurl,url, methodway, data, callback) {
   
  var fromurl = fromurl;
  var CuserInfo = wx.getStorageSync('CuserInfo');
 
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
          callback(null, res.data)
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
          req3(`customer/wxlogin/${code}`, 'POST', null, (err, res) => {
            
            if (res.code == 200) {
              wx.setStorageSync('openid', res);
             // 微信联合登录设置用户token
              var CuserInfo = {
                token: res.object.token,
                userId: res.object.userId,
              };
              wx.setStorageSync('CuserInfo', CuserInfo);

              callback(null, res)
            } else {
              util.showError(res.msg);
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

//请求直接加载url 上的 包含（/和?）
function req2(url, methodway, data, callback) {
  var CuserInfo = wx.getStorageSync('CuserInfo');
if (data == null || data== undefined) {
    //token未过期
          if (CuserInfo.token){
            wx.request({
              url: rootDocment+url,
              method: methodway,    //大写
              header: { 'Content-Type': 'application/json', 'token': CuserInfo.token, 'loginUserId': CuserInfo.userId },
              success(res) {
                if (res.data.code == 401) {
                  util.showError(res.data.msg);
                  wx.removeStorageSync('CuserInfo')
                } else {
                callback(null, res.data)
                }
              },
              fail(e) {
                console.error(e)
                callback(e)
              }
            })
          } else {
            util.showError('认证已过期，请重新登录');
            wx.removeStorageSync('CuserInfo')
          }
  }else{
    if (CuserInfo.token) {
      wx.request({
        url: rootDocment+url,
        method: methodway,    //大写
        data: data,
        header: { 'Content-Type': 'application/json', 'token': CuserInfo.token, 'loginUserId': CuserInfo.userId },
        success(res) {
          if (res.data.code == 401) {
            util.showError(res.data.msg);
            wx.removeStorageSync('CuserInfo')
          } else {
            callback(null, res.data)
          }
        },
        fail(e) {
          console.error(e)
          callback(e)
        }
      })
    } else {
      util.showError('认证已过期，请重新登录');
      wx.removeStorageSync('CuserInfo')
    }
  }
}

//无需登录,不带TOKEN请求(url中包含/和?)
function req3(url, methodway, data, callback) {

  if (data == null || data == undefined) {
  wx.request({
  url: rootDocment + url,
  method: methodway,    //大写
  header: { 'Content-Type': 'application/json' },
  success(res) {
    callback(null, res.data)
  },
  fail(e) {
    console.error(e)
    callback(e)
  }
})
}else{
    wx.request({
      url: rootDocment + url,
      data: data,
      method: methodway,    //大写
      header: { 'Content-Type': 'application/json' },
      success(res) {

        callback(null, res.data)
      },
      fail(e) {
        console.error(e)
        callback(e)
      }
    })
}
}


module.exports = {
  req: req,
  req2:req2,
  req3:req3,

}  