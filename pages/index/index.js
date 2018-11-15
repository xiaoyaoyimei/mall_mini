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
    request.req3('index/hotitem', 'GET', {}, (err, res) => {
      if (res.data.code == 200) {
        this.setData({
          xin: res.data.object
        })
      }
    })
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
    //判断是否已经登录
    if (this.token != null) {
      this.loginflag = false;
    }
    request.req3('promotion/crush/','get',{},
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
    request.req3("index/hotitem","GET", {}, (err,res) => {
      console.log()
      if (res.data.code == "200") {
        this.setData({
          hotitem: res.data.object,
        })
        
      }
    });
    request.req3("index/poster","GET",{},(err,res) => {
        if (res.data.code == "200") {
          this.setData({
            Items: res.data.object,
        })
      }
    });
    request.req3("index/basictype","GET",{},(err,res) => {
        if (res.data.code == "200") {
          this.setData({
            basictype: res.data.object,
          })
      }
    });
    request.req3('index/gameproduct','GET',{},(err,res) => {
        if (res.data.code == '200') {
          this.setData({
            gameproduct: res.data.object,
          })
          if(this.data.gameproduct.length > 0) {
            this.setData({
              gameproductone: this.data.gameproduct[0].list,
            })
          }

        }
    });
    request.req3('index/officeproduct','GET',{},(err,res) => {
       if (res.data.code == '200') {
        this.setData({
          officeproduct: res.data.object,
        })
        if (this.data.officeproduct.length > 0) {
          this.setData({
            officeproductone: this.data.officeproduct[0].list,
          })
        }
      }
    });
    request.req3('index/houseproduct','GET',{},(err,res) => {
         if (res.data.code == '200') {
        this.setData({
          houseproduct: res.data.object,
        })
        if (this.data.houseproduct.length > 0) {
          this.setData({
            houseproductone: this.data.houseproduct[0].list,
          })          
        }
      }
    });
    request.req3('index/tableproduct','GET',{},(err,res) => {
      if (res.data.code == '200') {
        this.setData({
          tableproduct: res.data.object,
        })
      }
    });
    request.req3('index/cockpitproduct','GET',{},(err,res) => {
      if (res.data.code == '200') {
        this.setData({
          cockpitproduct: res.data.object,
        })
      }
    });
    request.req3( 'index/peripheryproduct','GET',{},(err,res) => {
      if (res.data.code == '200') {
        this.setData({
          peripheryproduct: res.data.object,
        })
      }
    });

  },
  switchimg(e, listImg, imgid) {
    this.$refs[imgid][0].src = this.global_.imgurl + listImg;
  },
  onLoad: function () {
    //调登陆接口
    var that = this
  
    that.getData();
  },
})
