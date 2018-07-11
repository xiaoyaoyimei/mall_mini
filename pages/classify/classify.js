// pages/goodlist/goodlist.js
var app = getApp()
var request = require('../../utils/https.js')
var uri = 'product/search' //商品列表的的uri
var keyword = '';
var navlist = [
  { id: " ", title: "综合", icon: "" },
  { id: "salenum", title: "销量", icon: "" },
  { id: "goodsStorePrice", title: "价格", icon: "../../images/pop_select_pray.png" },
  { id: "shaixuan", title: "筛选", icon: "../../images/list_sx.png" },
];
Page({
  data: {
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
    tips: '', //无数据
    total:0,
    showResult: false,
    showKeywords: false,
    value: '',
  },
  cancelSearch() {
    this.setData({
      showResult: false,
      showKeywords: false,
      value:''
    })
    keyword='';
  },
  search(){
    this.getData();
    this.setData({
      showKeywords: false,
      showResult: true
    })
  },
  searchInput(e) {
    var that=this;
      keyword=e.detail.value
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
    request.req('searchpage',uri, 'GET', {
      //搜索过滤     
      keyWord: keyword,
      startRow: that.data.startRow,
      pageSize: that.data.pageSize,
    }, (err, res) => {
        if (res.data.total>0){
          app.globalData.keyword = ""
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
    debugger
    var that = this;
    var tempstart = that.data.startRow;
     tempstart = that.data.startRow + that.data.pageSize;
    if (that.data.startRow > that.data.total) {
      that.setData({
        loadingHidden: true,
        tips: "没有更多数据了~"
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
  onLoad: function (options) {

    keyword = app.globalData.keyword;
    console.log(keyword)
    var that = this;
    //封装https请求
    that.getData();
  },

  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})