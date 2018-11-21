//index.js
//获取应用实例
var app = getApp()
var imgurl = app.globalData.imgsrc;

var request = require('../../utils/https.js')
var uri_home = 'floor/api/indexListAll'
Page({
  data: {
    value3: 0,
    keyword: '',
    loginflag: true,
    imgurl: imgurl,
    setting: {
      autoplay: false,
      autoplaySpeed: 2000,
      dots: "inside",
      radiusDot: false,
      trigger: "click",
      arrow: "hover"
    },
    Items: [],
    hotitem: [],
    aditems: [],
    gameproduct: [],
    gameproductone: {},
    officeproduct: [],
    officeproductone: {},
    houseproduct: [],
    houseproductone: { sale_price: 0 },
    type: [],
    basictype: [],
    tableproduct: [],
    cockpitproduct: [],
    peripheryproduct: [],
    toolbarNologin: {}, //侧边栏个人中心是否登录
    seckillTime: false,
    seckilllist: [{
      switch: '',
    }],
    jsqtime: '',
    day: '',
    hr: '',
    min: 0,
    sec: 0,
    currentPlay: 'red',
    percent: 0,
  },
  onShareAppMessage: function () {
    // 用户点击右上角分享
    return {
      title: 'dxracer官方商城', // 分享标题
      desc: 'O(∩_∩)O哈哈~活捉一只电竞椅', // 分享描述
      path: '/pages/index/index' // 分享路径
    }
  },
  //跳转到goodsdetail
  itemclick: function (e) {
    var specId = e.currentTarget.dataset.specid;
    wx.navigateTo({
      url: '../goodsDetail/goodsDetail?specId=' + specId,
    })
  },
  xin:function(){
    request.req3('index/hotitem', 'GET', null, (err, res) => {
      if (res.code == 200) {
        this.setData({
          xin: res.object
        })
      }
    })
  },
  sort:function(e){
    var keyword = wx.getStorageSync("keyword")
    var type = wx.getStorageSync("type")
    if (type != undefined) {
      wx.removeStorageSync('type')
    }
    if (keyword != undefined) {
      wx.removeStorageSync('keyword')
    }
    if (e.currentTarget.dataset.i != undefined){
      wx.setStorageSync('keyword', e.currentTarget.dataset.i);
    }else{
      wx.setStorageSync('type', e.currentTarget.dataset.type);
    }
    wx.switchTab({
      url: '/pages/sort/sort',
    });
  }, 
  gosearch:function() {
    wx.navigateTo({
      url: '/pages/search/search',
    });
  },
  countdown: function () {
    const end = Date.parse(new Date(this.jsqtime));
    const now = Date.parse(new Date());
    const msec = end - now;
    //当秒杀开始时
    if (msec == 0) {
      this.detail.switch = 1;
      this.jsqtime = this.detail.crush["endTime"];
    }
    let day = parseInt(msec / 1000 / 60 / 60 / 24);
    let hr = parseInt(msec / 1000 / 60 / 60 % 24);
    let min = parseInt(msec / 1000 / 60 % 60);
    let sec = parseInt(msec / 1000 % 60);
    this.day = day;
    hr = day * 24 + hr;
    if (this.day < 3) {
      this.seckillTime = true
    } else {
      this.seckillTime = false
    }
    this.hr = hr > 9 ? hr : '0' + hr;
    this.min = min > 9 ? min : '0' + min;
    this.sec = sec > 9 ? sec : '0' + sec;
    let self = this;
    this.t = setTimeout(() => {
      self.countdown();
    }, 1000);
  },
  getData:function() {
    request.req3('promotion/crush', 'get', null,
      (err,res) => {
      if (res.code == '200') {
        this.seckilllist = res.object;
        if (this.seckilllist[0].switch == '0') {
          this.jsqtime = this.seckilllist[0].crush["startTime"]
        } else {
          this.jsqtime = this.seckilllist[0].crush["endTime"];
        }
        //计时器
        this.countdown();
      }
    });
    request.req3("index/hotitem", "GET", null, (err,res) => {
      console.log()
      if (res.code == "200") {
        this.setData({
          hotitem: res.object,
        })
        
      }
    });
    request.req3("index/poster", "GET", null,(err,res) => {
 
        if (res.code == "200") {
          if(res.object.length>0){
            res.object.map(function(i){
              var num = i.linkUrl.indexOf('?');
              if (i.linkUrl.indexOf('Detail') != -1){
                i.tztype='d';
                i.wxURL = '../sortDetail/sortDetail'+i.linkUrl.substr(num)
              }else{
                i.tztype='s';
                i.wxURL = '../sort/sort' + i.linkUrl.substr(num)
              }
            })
          }
          this.setData({
            Items: res.object,
        })
      }
    });
    request.req3("index/basictype", "GET", null,(err,res) => {
        if (res.code == "200") {
          this.setData({
            basictype: res.object,
          })
      }
    });
    request.req3('index/gameproduct', 'GET', null,(err,res) => {
        if (res.code == '200') {
          this.setData({
            gameproduct: res.object,
          })
          if(this.data.gameproduct.length > 0) {
            this.setData({
              gameproductone: this.data.gameproduct[0].list,
            })
          }

        }
    });
    request.req3('index/officeproduct', 'GET', null,(err,res) => {
       if (res.code == '200') {
        this.setData({
          officeproduct: res.object,
        })
        if (this.data.officeproduct.length > 0) {
          this.setData({
            officeproductone: this.data.officeproduct[0].list,
          })
        }
      }
    });
    request.req3('index/houseproduct', 'GET', null,(err,res) => {
         if (res.code == '200') {
        this.setData({
          houseproduct: res.object,
        })
        if (this.data.houseproduct.length > 0) {
          this.setData({
            houseproductone: this.data.houseproduct[0].list,
          })          
        }
      }
    });
    request.req3('index/tableproduct', 'GET', null,(err,res) => {
      if (res.code == '200') {
        this.setData({
          tableproduct: res.object,
        })
      }
    });
    request.req3('index/cockpitproduct', 'GET', null,(err,res) => {
      if (res.code == '200') {
        this.setData({
          cockpitproduct: res.object,
        })
      }
    });
    request.req3('index/peripheryproduct', 'GET', null,(err,res) => {
      if (res.code == '200') {
        this.setData({
          peripheryproduct: res.object,
        })
      }
    });

  },
  tz(e){
    var url = e.currentTarget.dataset.url;
    var tztype = e.currentTarget.dataset.tztype
    if (tztype=='s'){
      wx.switchTab({
        url: url,
      });
    }else{
      wx.navigateTo({
        url:url
      })
    }
 
  },
  switchimg(e, listImg, imgid) {
    this.$refs[imgid][0].src = this.global_.imgurl + listImg;
  },
  onShow: function () {
      this.getData();
  },
  
})
