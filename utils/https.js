var rootDocment = 'https://m.shop.dxracer.cn/mall/wap/';//  前缀
var auto = 'customer/login';
function req(fromurl,url, methodway, data, callback) {
  var fromurl = fromurl;
  var CuserInfo = wx.getStorageSync('CuserInfo');
  
  if (CuserInfo.token) {  //如果有token，就把token放到header
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
         // var code = CuserInfo.code
          // if (code) {
          //   wx.request({  //获取新token
          //     url: rootDocment + auto,
          //     data: {code: code},
          //     method: methodway,
          //     success: function (res) {
          //       if (res.data == 0) {  //跳转到login
          //         wx.redirectTo({   //不一定走
          //           url: '../login/login',
          //         })
          //       } else {
          //         console.log(res)
          //         var newtoken = res.data.token ; //重新请求 并保存新token
          //         var newUserId = res.data.userId;
          //         CuserInfo.userId = newUserId;
          //         CuserInfo.token=newtoken;
          //          wx.setStorageSync('CuserInfo', CuserInfo);   //重新保存用户信息
          //         wx.request({
          //           url: rootDocment + url,
          //           data:  data ,
          //           method: methodway,
          //           header: { 'Content-Type': 'application/json', 'token': newtoken },
          //           success: function (res) {
          //             console.log("成功")
          //             callback(null, res)
          //           },
          //           fail(e) {
          //              console.log("失败")
          //             console.error(e)
          //             callback(e)
          //           }
          //         })
          //       }
          //     },
          //   })
          // }
        }else{
        callback(null, res)
        }
      },
      fail(e) {
        console.error(e)
        callback(e)
      }
    })
  } else {
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
module.exports = {
  req: req,
  req2:req2
}  