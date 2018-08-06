var rootDocment = 'https://m.shop.dxracer.cn/mall/wap/';//  前缀
var auto = 'customer/login';
//携带TOKEN
function req(fromurl,url, methodway, data, callback) {

  var fromurl = fromurl;
  var CuserInfo = wx.getStorageSync('CuserInfo');
  if (CuserInfo=={}){
    wx.login({
      success: res => {
        // ------ 获取凭证 ------
        var code = res.code;
        if (code) {
          req2('customer/wxlogin', 'POST', code, (err, res) => {
            if (res.data.code == 200) {
              // console.log("获取到的openid为：" + res.data)
              // that.globalData.openid = res.data
              wx.setStorageSync('openid', res.data)
            } else  {
              wx.navigateTo({
                url: '../login/login?fromurl=index'
              })
              return;
            }
          })
        } else {
          console.log('获取用户登录失败：' + res.errMsg);
        }
      }
    })
 }
  else{
    //如果有token，就把token放到header
    wx.request({
      url: rootDocment + url,
      data: data,
      method: methodway,    //大写
      header: { 'Content-Type': 'application/json', 'token': CuserInfo.token, 'loginUserId': CuserInfo.userId},
      success(res) {
        if (res.data.code == 401) {  

          //token失效 用code换下token
          wx.showToast({
                title: res.data.msg,
                 icon: 'none',
                 duration: 1000
               })
           wx.removeStorageSync('CuserInfo')
        }else{
        callback(null, res)
        }
      },
      fail(e) {
        console.error(e)
        callback(e)
      }
    })
  } 
}


function req2(url, methodway, data, callback) {

  var CuserInfo = wx.getStorageSync('CuserInfo');
  //token未过期
  if (CuserInfo.token){
    wx.request({
      url: rootDocment + url+'/'+data,
      method: methodway,    //大写
      header: { 'Content-Type': 'application/json', 'token': CuserInfo.token, 'loginUserId': CuserInfo.userId },
      success(res) {
        if (res.data.code == 401) {

          //token失效 删除缓存token
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000
          })
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
    wx.showToast({
      title: '认证已过期，请重新登录',
      icon: 'none',
      duration: 2000
    })
    wx.removeStorageSync('CuserInfo')
  }
}
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
//无需登录,不带TOKEN请求
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
function req5(url, methodway,uniunid, data, callback) {
  var CuserInfo = wx.getStorageSync('CuserInfo');
  if (CuserInfo.token) {
  wx.request({
    url: rootDocment + url+'?id='+ uniunid,
    method: methodway,    //大写
    data:data,
    header: { 'Content-Type': 'application/json', 'token': CuserInfo.token, 'loginUserId': CuserInfo.userId},
    success(res) {
      callback(null, res)
    },
    fail(e) {
      console.error(e)
      callback(e)
    }
  })
  }
  else{
    wx.showToast({
      title: '认证已过期，请重新登录',
      icon: 'none',
      duration: 2000
    })
    wx.removeStorageSync('CuserInfo')
  }
} 

module.exports = {
  req: req,
  req2:req2,
  req3:req3,
  req4:req4,
  req5:req5
}  