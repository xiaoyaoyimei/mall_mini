//数据转化
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 时间戳转化为年 月 日 时 分 秒
 * number: 传入时间戳
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致
*/
function formatTime(number, format) {
  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];

  var date = new Date(number);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}

//价格xxx,xxx.00
var pricefilter = (num) => {
  num = parseFloat(num);
  var SUM = "";
  var sumFol = num.toFixed(2);
  var sumtotalStr = sumFol;
  var sumEndStr = sumtotalStr.slice(sumtotalStr.indexOf("."));
  var sumStr = sumtotalStr.slice(0, sumtotalStr.indexOf("."));
  var count = 0;
  if (sumStr.toString().length % 3 == 0) {
    count = sumStr.toString().length / 3;
  } else {
    count = (sumStr.toString().length - sumStr.toString().length % 3) / 3;
  }
  var text = "";
  for (let i = 0; i < count; i++) {
    if ((count - i - 1) * 3 + sumStr.toString().length % 3 != 0) {
      text = "," + sumStr.slice((count - i - 1) * 3 + sumStr.toString().length % 3, (count - i - 1) * 3 + sumStr.toString().length % 3 + 3) + text;
    } else {
      text = sumStr.slice((count - i - 1) * 3 + sumStr.toString().length % 3, (count - i - 1) * 3 + sumStr.toString().length % 3 + 3) + text;
    }
  }
  SUM = sumStr.slice(0, sumStr.toString().length % 3) + text + sumEndStr;
  return SUM;
  return sumFol;
}

// 显示繁忙提示
var showBusy = text => wx.showToast({
  title: text,
  icon: 'loading',
  duration: 10000
})

// 显示成功提示
var showSuccess = text => wx.showToast({
  title: text,
  icon: 'success'
})

// 显示失败提示
var showModel = (title, content) => {
  wx.hideToast();

  wx.showModal({
    title,
    content: JSON.stringify(content),
    showCancel: false
  })
}

module.exports = { formatTime, showBusy, showSuccess, showModel, pricefilter}
