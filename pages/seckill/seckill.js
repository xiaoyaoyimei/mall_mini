var request = require('../../utils/https.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pro: [],
    hasShow: true,
    list: [],
    startpro: [],
    nostartpro: [],
    day: 0,
    hr: 0,
    min: 0,
    sec: 0,
    nostartday: 0,
    nostarthr: 0,
    nostartmin: 0,
    nostartsec: 0,
    starttime: 0,
    nostarttime: 0,
    not:'',
    t:'',
    loadingHidden: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    this.getkill();
  },
  startcountdown: function () {
    const end = Date.parse(new Date(this.data.starttime));
    const now = Date.parse(new Date());
    const msec = end - now;
    let day = parseInt(msec / 1000 / 60 / 60 / 24);
    let hr = parseInt(msec / 1000 / 60 / 60 % 24);
    let min = parseInt(msec / 1000 / 60 % 60);
    let sec = parseInt(msec / 1000 % 60);

    this.setData({
      day: day,
      hr :hr > 9 ? hr : '0' + hr,
      min: min > 9 ? min : '0' + min,
      sec: sec > 9 ? sec : '0' + sec,
    })
    let self = this;
    this.data.t = setTimeout(() => {
      self.startcountdown();
    }, 1000);
  },
  nostartcountdown: function () {
    const end = Date.parse(new Date(this.data.nostarttime));
    const now = Date.parse(new Date());
    const msec = end - now;
    let nostartday = parseInt(msec / 1000 / 60 / 60 / 24);
    let nostarthr = parseInt(msec / 1000 / 60 / 60 % 24);
    let nostartmin = parseInt(msec / 1000 / 60 % 60);
    let nostartsec = parseInt(msec / 1000 % 60);
   
    this.setData({
      nostartday: nostartday,
      nostarthr :nostarthr > 9 ? nostarthr : '0' + nostarthr,
      nostartmin: nostartmin > 9 ? nostartmin : '0' + nostartmin,
      nostartsec: nostartsec > 9 ? nostartsec : '0' + nostartsec,
    })
    let self = this;
    this.data.not = setTimeout(() => {
      self.nostartcountdown();
    }, 1000);
  },
  getkill(){

    var that=this;
    request.req3('promotion/crush', 'get',null, (err, res) => {
      console.log('0000')
      if (res.code == '200') {
        that.data.pro = res.object;
        console.log(res.object.length)
        if(res.object.length>0){
          that.data.hasShow=true;
        }else{
          that.data.hasShow = false;
        }
        that.data.startpro = [];
        that.data.nostartpro = [];
        that.data.pro.map(function (item) {
          if (item.switch == '1') {
            that.data.startpro.push(item)
          } else {
            that.data.nostartpro.push(item)
          }
        })
        if (this.data.startpro.length > 0) {
          this.setData({starttime : this.data.startpro[0].crush["endTime"]})
          this.startcountdown();
        }
        if (this.data.nostartpro.length > 0) {
          this.setData({ nostarttime: this.data.nostartpro[0].crush["crateTime"] })
          this.nostartcountdown();
        }  
        that.setData({
          hasShow: that.data.hasShow,
          startpro: that.data.startpro,
          nostartpro: that.data.nostartpro
        }); 
      }else{
        that.setData({
          hasShow: false,
          })
      }
        setTimeout(function(){
          that.setData({
            loadingHidden: true
          })
        },1000)
    });
  },
  
 
})