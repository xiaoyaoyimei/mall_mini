// pages/sort/sort.js

var app = getApp()
var imgurl = app.globalData.imgsrc;
var request = require('../../utils/https.js')
var uri_home = 'floor/api/indexListAll'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchdate: '',
    spinShow: false,
    productList: [],
    startRow: 0,
    pageSize: 16,
    title: '',
    totalSize: 0,
    filterModal: false,
    imgurl:imgurl,
    catalog: [],
    type: [],
    hidden:true,
    isActive: false,
    series: [],
    brand: [],
    catalogindex: -1,
    typeindex: -1,
    seriesindex: -1,
    brandindex: -1,
    //顶部筛选条件
    searchfilter: {
      catalog: '',
      type: '',
      series: '',
      brand: '',
    },
    flag: true,
    catalogId: '',
    hasShow: true, //搜索有商品
    keyword: '',
    bottomtext: '',
    loadingHidden: false,
    items: [],
    topNum: 0,
    floorstatus:false,
  },
   // 获取滚动条当前位置
  scrolltoupper:function(e){
    if (e.detail.scrollTop > 100) {
        this.setData({ 
          floorstatus: true 
        });
    } else { 
      this.setData({
           floorstatus: false 
      }); 
    } 
  },
     //回到顶部 
  goTop: function (e) {
     // 一键回到顶部 
      this.setData({ 
        topNum: this.data.topNum = 0
       }); 
  },
  ok() {
      this.setData({
        keyword: '',
        startRow: 0
      })
    this.setData({ loadingHidden: false });
    this.getproduct()
    this.setData({
      hidden: true,
      loadingHidden: true
    })
  },
  //筛选重置搜索条件
  reset() {
    this.setData({
      catalogindex : -1,
      typeindex : -1,
      seriesindex : -1,
      brandindex : -1,
      'searchfilter.catalog' : '',
      'searchfilter.series' : '',
      'searchfilter.type' :'',
      'searchfilter.brand': '',
    })

  },
  xuanzeModal() {
    this.setData({
      hidden:false
    })
  },
  getTop() {
    request.req3('/product/catalog', 'GET',{},(err,res) => {
      this.setData({
        catalog:res
      })
    })
    request.req3('/product/brand','GET',{},(err,res) => {
      this.setData({
        brand: res
      })
    })
    request.req3('/product/series','GET',{},(err,res) => {
      this.setData({
        series: res
      })
    })
    request.req3('/product/type','GET',{},(err,res) => {
      this.setData({
        type: res
      })
      for (let index = 0; index < this.data.type.length; index++) {
          let obj = "data.type["+index+"].red"
        if (this.data.type[index].id == this.data.catalogId) {
          
          this.setData({
            obj:true,
            typeindex:-2
          })
        } else {
          this.setData({
            obj: false,
          })
        }

      }
    })
  },
  //点击顶部筛选
  getList:function(e) {
    let type = e.currentTarget.dataset.catalog
    let index = e.currentTarget.dataset.index
    let value = e.currentTarget.dataset.value
    if (type == 'catalog') {
      this.setData({
        catalogindex:index,
        'searchfilter.catalog' :value
      })
    }
    if (type == 'type') {
      this.setData({
        typeindex: index,
        'searchfilter.type': value
      })
      for (let i = 0; i < this.data .type.length; i++) {
        let obj = 'type['+i+'].red'
        this.setData({
          obj :false
        })
      }
    }
    if (type == 'series') {
      this.setData({
        seriesindex: index,
        'searchfilter.series': value
      })
    }
    if (type == 'brand') {
      this.setData({
        brandindex: index,
        'searchfilter.brand': value
      })
    }

  },
  getproduct(){
    request.req3('/product/search?keyWord=' + this.data.keyword + '&catalog=' + this.data.searchfilter.catalog + '&series=' + this.data.searchfilter.series + '&type=' + this.data.searchfilter.type + '&brand=' + this.data.searchfilter.brand + '&startRow=' + this.data.startRow + '&pageSize=' + this.data.pageSize, 'GET', {},
      (err, res) => {
        if (res.total > 0) {
          this.setData({
            hasShow: true,
            productList: res.itemsList,
            totalSize: res.total
          })
        } else {
          this.setData({
            hasShow: false
          })
        }
        this.setData({
          loadingHidden: true
        })
        // this.refresh()
      })
  },
  fetchData() {
    this.setData({
      productList:[],
      startRow:0,
      loadingHidden: false,
    })
    this.getproduct()
  },
  gosearch: function () {
    wx.navigateTo({
      url: '/pages/search/search',
    });
  },
  // //scroll下拉加载更多
  bindscrolltolower() {
    let that = this;
    if (this.data.productList.length < this.data.totalSize) {
      this.data.startRow = this.data.startRow + this.data.pageSize;
      this.getproduct()
    } else {
      this.setData({
        bottomtext :'已经到底了,没有更多了....'
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var keyword = wx.getStorageSync("keyword")
    var type = wx.getStorageSync("type")
    if (type != undefined) {
      this.setData({
        'searchfilter.type': type
      })
    }
    if (keyword != undefined) {
      this.setData({
        keyword: keyword
      })
    }
    this.fetchData();
    this.getTop()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    var keyword = wx.getStorageSync("keyword")
    var type = wx.getStorageSync("type")
    if (type != undefined) {
      wx.removeStorageSync('type')
    }
    if (keyword != undefined) {
      wx.removeStorageSync('keyword')
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})