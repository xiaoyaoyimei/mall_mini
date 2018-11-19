import objectUtil from './object.util'
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
// 显示错误提示
var showError = text => wx.showToast({
  title: text,
  icon: 'none'
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
const $init = (page) => {
  page.$data = objectUtil.$copy(page.data, true)
}

const $digest = (page) => {
  let data = page.data
  let $data = page.$data
  let ready2set = {}

  for (let k in data) {
    if (!objectUtil.$isEqual(data[k], $data[k])) {
      ready2set[k] = data[k]
      $data[k] = objectUtil.$copy(data[k], true)
    }
  }

  if (Object.keys(ready2set).length) {
    page.setData(ready2set)
  }
}
module.exports = { $init, $digest, showBusy, showSuccess, showError,showModel}
