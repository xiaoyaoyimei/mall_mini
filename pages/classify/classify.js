// pages/goodlist/goodlist.js
var app = getApp()
var imgurl = app.globalData.imgsrc;
var request = require('../../utils/https.js')
var uri = 'product/search' //商品列表的的uri
var navlist = [
  { id: " ", title: "综合", icon: "" },
  { id: "salenum", title: "销量", icon: "" },
  { id: "goodsStorePrice", title: "价格", icon: "../../images/pop_select_pray.png" },
  { id: "shaixuan", title: "筛选", icon: "../../images/list_sx.png" },
];
Page({
  data: {
    imgurl: imgurl,
    startRow: 0,
    pageSize: 10,
    activeIndex: 0,
    navList: navlist,
    systemInfo: [],
    loadingHidden: false,
    list: [],
    num: 1,
    limt: 20,
    tab: '',
    tips: false, //无数据
    total:0,
    clientHeight:0,
    scrollTop:0,
  },
  goTop: function (e) {
    this.setData({
      scrollTop: 0
    });
  },
  scroll: function (e, res) {
    // 容器滚动时将此时的滚动距离赋值给 this.data.scrollTop
    if (e.detail.scrollTop > 500) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },

  //切换TAB
  onTapTag: function (e) {
    var that = this;
    var tab = e.currentTarget.id;
    var index = e.currentTarget.dataset.index;
    that.setData({
      activeIndex: index,
      tab: tab,
      startRow: that.data.startRow,
      pageSize: that.data.pageSize,
    })
    if (tab == 'shaixuan') {    //筛选跳转到specValue
      wx.navigateTo({
        url: '../specValue/specValue',    //加参数
        //获取specValue
      })
    } else {
      that.getData();
    }
  },
  getData: function () {
    var that = this;
    var tab = that.data.tab;

    that.setData({ loadingHidden: false });
    request.req3(uri, 'GET', {
      //搜索过滤     
      startRow: that.data.startRow,
      pageSize: that.data.pageSize,
    }, (err, res) => {
        if (res.data.total>0){
          that.setData({
            loadingHidden: true,
            list: that.data.list.concat(res.data.itemsList),
            total: res.data.total
          });
        }
      else {
          that.setData({
            list:[],
            loadingHidden: true,
          }) 
        }
      })

  },
  //加载更多
  bindscrolltolower: function () {
    var that = this;
    var tempstart = that.data.startRow;
     tempstart = that.data.startRow + that.data.pageSize;
    if (that.data.startRow > that.data.total) {
      that.setData({
        loadingHidden: true,
        tips: true
      });
      return ;
    }else{
    that.setData({
      startRow: tempstart
    });

    that.getData(); 
    } //pageNo++,并传到数组中
  },
  clickitem: function (e) {   //带着specId 去详情界面
    var specId = e.currentTarget.dataset.specid;
    wx.navigateTo({
      url: '../goodsDetail/goodsDetail?specId=' + specId,
    })
  },
  onLoad: function () {
    var that = this;
    //封装https请求
    that.getData();
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          clientHeight: res.windowHeight
        });
      }
    });
  },

})