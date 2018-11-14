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
    items: [],
  },
  ok() {
      this.setData({
        keyword: '',
        startRow: 0
      })
    request.req3('/product/search?catalog=' + this.data.searchfilter.catalog + '&series=' + this.data.searchfilter.series + '&type=' + this.data.searchfilter.type + '&brand=' + this.data.searchfilter.brand + '&startRow=' + this.data.startRow + '&pageSize=' + this.data.pageSize,
       'GET',{},
     (err,res) => {
      if (res.data.itemsList.length > 0) {
        this.setData({
          productList: res.data.itemsList,
          hasShow:true
        })
      } else {
        this.setData({
          hasShow: false
        })
      }
       this.setData({
         totalSize: res.data.total
       })
    })
    this.setData({
      hidden: true
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
        catalog:res.data
      })
    })
    request.req3('/product/brand','GET',{},(err,res) => {
      this.setData({
        brand: res.data
      })
    })
    request.req3('/product/series','GET',{},(err,res) => {
      this.setData({
        series: res.data
      })
    })
    request.req3('/product/type','GET',{},(err,res) => {
      this.setData({
        type: res.data
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
    // this.setData({
    //   spinShow:false
    // })
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
  fetchData() {
    this.setData({
      productList:[],
      startRow:0
    })
    request.req3('/product/search?keyWord=' + this.data.keyword + '&startRow=' + this.data.startRow + '&pageSize=' + this.data.pageSize,'GET',{},
    (err,res) => {
      if (res.data.total > 0) {
        this.setData({
          hasShow:true,
          productList: res.data.itemsList,
          totalSize:res.data.total
        })
      } else {
        this.setData({
          hasShow: false
        })
      }
      // this.refresh()
    })
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
      request.req3('/product/search?catalog=' + this.data.searchfilter.catalog + '&series=' + this.data.searchfilter.series + '&type=' + this.data.searchfilter.type + '&brand=' + this.data.searchfilter.brand + '&startRow=' + this.data.startRow + '&pageSize=' + this.data.pageSize,
        'GET', {},
        (err, res) => {
          if (res.data.itemsList.length > 0) {
            this.setData({
              productList: that.data.productList.concat( res.data.itemsList),
              hasShow: true
            })
          } else {
            this.setData({
              hasShow: false
            })
          }
          this.setData({
            totalSize: res.data.total
          })
        })

    } else {
      this.bottomtext = '已经到底了,没有更多了....';
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    if (options.type != undefined) {
      this.getList('type', options.type, options.typeindex)
    }
    if (options.keyword != undefined) {
      this.setData({
        keyword: options.keyword
      })
      this.fetchData();
    }
    this.getTop()
    this.fetchData();
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
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
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