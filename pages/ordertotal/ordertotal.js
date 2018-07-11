//ordertotal.js
var util = require('../../utils/util.js')
var request = require('../../utils/https.js')
var uri = 'order/list'
var statusuri ="order/enums"
Page({
  data: {
    pageNo: 1,
    hidden: false,
    list: [],
    newlist: [],
    statusenums:[],
  },
  onLoad: function () {
    //刷新数据
    this.getData();
    this.getStatus()
  },
  getStatus:function(){
    var that = this;
    request.req('order',statusuri, 'GET', {
    }, (err, res) => {
      if (res.data.code == 200) {
          that.setData({
            hidden: true,
            statusenums: res.data.object,
          }) 
      }
    })
  },
  statusfilter(value) {
    for (var i = 0; i < this.data.statusenums.length; i++) {
      if (this.data.statusenums[i].key == value) {
        return this.data.statusenums[i].value;
      }
    }
  }, 
   getData: function () {
    var that = this;
    var status = "";
    var pageNo = that.data.pageNo;
    var CuserInfo = wx.getStorageSync('CuserInfo');
    request.req('order',uri,'GET', {
    }, (err, res) => {
      if (res.data.code == 200) {
        if (!res.data) {   //无数据
          that.setData({hidden: true, tips: "没有数据~" })
        } else {
          that.setData({
            hidden: true,
            list: res.data.object,
          })
          //处理数据
          var list = that.data.list;
         
          for (var i = 0; i < list.length; i++) {
            list[i].order.orderStatus = that.statusfilter(list[i].order.orderStatus);
           }
          console.log(list)
           that.setData({
             newlist: list
           })
     
        }
      }
    })
  },
  //点击到相应的页面
  orderbutton: function (options) {
    var type = options.currentTarget.dataset.button;
    console.log(type)
    if (type == "去支付") {
      
    } else if (type == "查看详情") {

    } else if (type == "确认收货") {

    }
  },



})
