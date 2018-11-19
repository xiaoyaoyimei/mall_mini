// pages/seckilldetail/seckilldetail.js
var request = require('../../utils/https.js')
var util = require('../../utils/util.js')
Page({
  day: 0,
  hr: 0,
  min: 0,
  sec: 0,
  jsqtime: 0,
  productDesc: [],
  productimg: [],
  onlyimg: false,
  commentList: [],
  data: {
    detail: {
      productItem: {
        salePrice: 0
      },
      product: {},
      crush: {
        salePrice: 0
      }
    },
    address: { receiveProvince:''},
    hasAddr:true,
    skuId:''
  },
  //获取初始地址
  getAddress() {
    var that=this;
    request.req2(`address`, 'post', null, (err, res) => {
      if (res.length > 0) {
        res.map(function (i) {
          if (i.isDefault == 'Y' && that.address.receiveProvince == '') {
            that.address = i;
            that.hasAddr = true
          }
        });
        that.setData({
          address: that.data.address,
          hasAddr: that.data.hasAddr,
        }); 
      }
      if (self.hasAddr) {
        this.getExpressPrice();
      }
    });
    

  },
  //获取运费
  getExpressPrice() {
    if (this.data.address.receiveProvince == '') {
      util.shoshowError('请先选择收货地址')
      return false
    }
    let data= {
      "price": [this.freightPrice],
      "province": this.addressList.receiveProvince,
      "quantity": [this.quantity],
      "typeIds": [this.freightTypeId]
    }
    request.req3(`order/getShipPrice`, 'post', data, (err, res) => {
      if (res.code == 200) {
        this.data.freight = res.object;
        this.setData({
          freight: that.data.freight
        });
      }
    });
  },
  countdown: function () {
    const end = Date.parse(new Date(this.data.jsqtime));
    const now = Date.parse(new Date());
    const msec = end - now;
    //当秒杀开始时
    if (msec == 0) {
      this.data.detail.switch = 1;
      this.data.jsqtime = this.data.detail.crush["endTime"];
    }
    let day = parseInt(msec / 1000 / 60 / 60 / 24);
    let hr = parseInt(msec / 1000 / 60 / 60 % 24);
    let min = parseInt(msec / 1000 / 60 % 60);
    let sec = parseInt(msec / 1000 % 60);
    this.data.day = day;
    this.data.hr = hr > 9 ? hr : '0' + hr;
    this.data.min = min > 9 ? min : '0' + min;
    this.data.sec = sec > 9 ? sec : '0' + sec;
    let self = this;
    this.t = setTimeout(() => {
      self.countdown();
    }, 1000);
    this.setData({
      day: this.data.day,
      hr: this.data.hr,
      min: this.data.min,
      sec: this.data.sec
    });
  },
  //获取秒杀详情
  getDetail() {
    let skuId = wx.getStorageSync('skuId');
    request.req3(`promotion/crush/${skuId}`, 'get', null, (err, res) => {
      if (res.code == '200') {
        this.data.detail = res.object;

        this.data.max = this.data.detail.crush.unitQuantity;
        if (this.data.detail.switch == '0') {
          this.data.jsqtime = this.data.detail.crush["startTime"]
        } else {
          this.data.jsqtime = this.data.detail.crush["endTime"];
        }
        this.setData({
          detail: this.data.detail,
          max: this.data.max,
          jsqtime: this.data.jsqtime
        });
        //计时器
        this.countdown();
        //this.proId = res.object.productItem.productId;
        request.req3(`product/desc/${skuId}`, 'get', null, (err, res) => {
          this.data.productDesc=res
          this.setData({
            productDesc: this.data.productDesc
          });
        })
        request.req3(`product/img/${skuId}`, 'get', null, (err, res) => {
          this.data.productimg = res
          this.setData({
            productimg: this.data.productimg
          });
        })
        this.showcomments();
      }
    });

  },
  //显示评论。0位全部评论，1为显示带图评论
  showcomments() {
    let skuId = wx.getStorageSync('skuId');
    var imgshow = this.onlyimg;
    if (imgshow == true) {
      imgshow = 1
    } else {
      imgshow = 0
    }
    request.req3(`comment/search/${skuId}/${imgshow}`, 'get', null, (err, res) => {
      if (res.code == "200" && res.object.length > 0) {
        this.data.commentList = res.object;
        this.data.hasPJ = true;
      }else{
        this.data.hasPJ = false;
      }
      this.setData({
        commentList: this.data.commentList,
        hasPJ: this.data.hasPJ
      });
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setStorageSync('skuId', options.skuId);
    this.getDetail()
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