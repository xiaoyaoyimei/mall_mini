// pages/sort/sort.js
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
    catalog: [],
    type: [],
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
    this.keyword = '';
    this.startRow = 0;
    this.$axios({
      method: 'GET',
      url: '/product/search?catalog=' + this.searchfilter.catalog + '&series=' + this.searchfilter.series + '&type=' + this.searchfilter.type + '&brand=' + this.searchfilter.brand + '&startRow=' + this.startRow + '&pageSize=' + this.pageSize,
    }).then((res) => {
      if (res.itemsList.length > 0) {
        this.productList = res.itemsList;
        this.hasShow = true
      } else {
        this.hasShow = false
      }
      this.totalSize = res.total;
    })
    this.filterModal = false;
  },
  //筛选重置搜索条件
  reset() {
    this.catalogindex = -1;
    this.typeindex = -1;
    this.seriesindex = -1;
    this.brandindex = -1;
    this.searchfilter.catalog = '';
    this.searchfilter.series = '';
    this.searchfilter.type = '';
    this.searchfilter.brand = ''
  },
  xuanzeModal() {
    this.filterModal = true;
  },
  //获取顶部筛选
  getParams() {
    if (this.$route.query.type != undefined) {
      this.getList('type', this.$route.query.type, this.$route.query.typeindex)
    }
    if (this.$route.query.keyword != undefined) {
      this.keyword = this.$route.query.keyword;
      this.fetchData();
    }
  },

  getTop() {
    this.$axios({
      method: 'GET',
      url: '/product/catalog',
    }).then((res) => {
      this.catalog = res;
    })
    this.$axios({
      method: 'GET',
      url: '/product/brand',
    }).then((res) => {
      this.brand = res;
    })
    this.$axios({
      method: 'GET',
      url: '/product/series',
    }).then((res) => {
      this.series = res;
    })
    this.$axios({
      method: 'GET',
      url: '/product/type',
    }).then((res) => {
      this.type = res;
      for (let index = 0; index < this.type.length; index++) {
        if (this.type[index].id == this.catalogId) {
          this.type[index].red = true;
          this.typeindex = -2
        } else {
          this.type[index].red = false;
        }

      }
    })
    this.spinShow = false
  },
  //点击顶部筛选
  getList(type, value, index) {
    if (type == 'catalog') {
      this.catalogindex = index;
      this.searchfilter.catalog = value
    }
    if (type == 'type') {
      this.typeindex = index;
      this.searchfilter.type = value
      for (let i = 0; i < this.type.length; i++) {
        this.type[i].red = false;

      }
    }
    if (type == 'series') {
      this.seriesindex = index;
      this.searchfilter.series = value
    }
    if (type == 'brand') {
      this.brandindex = index;
      this.searchfilter.brand = value
    }

  },
  fetchData() {
    this.productList = [],
      this.startRow = 0;
    this.$axios({
      method: 'GET',
      url: '/product/search?keyWord=' + this.keyword + '&startRow=' + this.startRow + '&pageSize=' + this.pageSize,
    }).then((res) => {
      if (res.total > 0) {
        this.hasShow = true;
        this.productList = res.itemsList;
        this.totalSize = res.total;
      } else {
        this.hasShow = false;
      }
      this.refresh()
    })
  },
  gosearch() {
    this.$router.push('/search');
  },
  refresh(done) {
    setTimeout(() => {
      done()
    }, 2000);

  },
  //scroll下拉加载更多
  infinite(done) {
    let _this = this;
    if (this.productList.length < this.totalSize) {
      this.startRow = this.startRow + this.pageSize;
      return new Promise(resolve => {
        this.$axios({
          method: 'GET',
          url: '/product/search?startRow=' + this.startRow + '&pageSize=' + this.pageSize,
        }).then((res) => {
          _this.productList = _this.productList.concat(res.itemsList);
          done()
        })
        resolve();
      });
    } else {
      this.bottomtext = '已经到底了,没有更多了....';
      done()
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