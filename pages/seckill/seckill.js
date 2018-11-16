var request = require('../../utils/https.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pro: [],
    show: false,
    list: [],
    startpro: [],
    nostartpro: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  getkill(){
    var that=this;
    request.req4('promotion/crush', 'get',null, (err, res) => {
      if (res.data.code == '200') {
        that.data.pro = res.object;
        that.data.startpro = [];
        that.data.nostartpro = [];
        that.data.pro.map(function (item) {
          if (item.switch == '1') {
            that.data.startpro.push(item)
          } else {
            this.data.nostartpro.push(item)
          }
        })
      }
      else {
        this.data.show = true;
      }
    });
  
  },
  
 
})