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
            } else if (res.data.code == 404) {
              wx.navigateTo({
                url: '../login/login?fromurl=index'
              })
            } else {
              wx.navigateTo({
                url: '../regi/regi?fromurl=index'
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
        if (res.data.code == 401) {  //token失效 用code换下token
          wx.navigateTo({   //不一定走
            url: '../login/login?fromurl=' + fromurl,
               })
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


//
function req2(url, methodway, data, callback) {
  var CuserInfo = wx.getStorageSync('CuserInfo');

    wx.request({
      url: rootDocment + url+'/'+data,
     // data: data,
      method: methodway,    //大写
      header: { 'Content-Type': 'application/json', 'token': CuserInfo.token, 'loginUserId': CuserInfo.userId },
      success(res) {
        if (res.data.code == 401) {  //token失效 用code换下token
          console.log(res.data.msg)
          wx.redirectTo({   //不一定走
            url: '../login/login',
          })
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
//不带TOKEN请求
module.exports = {
  req: req,
  req2:req2,
  req3:req3
}  