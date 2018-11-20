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
    nostartpro: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getkill();
  },
  getkill(){
    var that=this;
    request.req3('promotion/crush', 'get',null, (err, res) => {
      if (res.code == '200') {
        that.data.pro = res.object;
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
          
        that.setData({
          hasShow: that.data.hasShow,
          startpro: that.data.startpro,
          nostartpro: that.data.nostartpro
        }); 
      }
  
    });
  },
  
 
})