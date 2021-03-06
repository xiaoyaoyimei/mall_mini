var util = require('../../utils/util.js')
var request = require('../../utils/https.js')
var imgurl = getApp().globalData.imgsrc;
Page({
  data: {
    cartList: [],               // 购物车列表
    hasList: false,          // 列表是否有数据
    totalPrice: 0,           // 总价，初始为0
    selectAllStatus: false,    // 全选状态，默认全选
    imgurl: imgurl,
    loginhidden:false,
    loadingHidden:false
  },
  getCartList() {
    var self=this;
    self.data.cartList = [];
      request.req('cart','order/shopping/list', 'POST', {}, (err, res) => {

        if (res.code == 200) {

            self.setData({
              hasList: true,
              cartList: res.object,
              loginhidden: false
            })
            self.getTotalPrice();
        }else{
          self.setData({
            loginhidden: false,
            hasList: false
          });
        }
        this.setData({
          loadingHidden: true
        })
      }); 
      setTimeout(function(){
        self.setData({
          loadingHidden: true
        })
      },3000)
  },
  onLoad(){

  },
  onShow() {
    var that=this;
    var CuserInfo = wx.getStorageSync('CuserInfo');
    
    if (CuserInfo.token) {
      that.setData({
        selectAllStatus: false,
      });
     this.getCartList();
    }else{
      that.setData({
        loginhidden: true,
        loadingHidden: true

      });
    }
  },
  /**
   * 当前商品选中事件
   */
  selectList(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.cartList;
   
    const selected = carts[index].selected;
    carts[index].selected = !selected;
    this.setData({
      cartList: carts
    });
    var alllength = this.data.cartList.length;
    var length = 0;
    for (let i = 0; i < alllength; i++) {
      if (carts[i].selected) {
        length += 1
      }
    }
    if (length == alllength) {
      this.setData({
        selectAllStatus: true,
      });
    } else {
      this.setData({
        selectAllStatus: false,
      });
    }
    this.getTotalPrice();
  },

  /**
   * 删除购物车当前商品
   */
  deleteList(e) {
    var ids = [];
    var that=this;
    ids[0] = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认删除该商品吗？',
      success: function (res) {
        if (res.confirm) {
        request.req('cart','order/shopping/deleByIds', 'POST', ids, (err, res) => {
            if (res.code == 200) {
              that.getCartList();
            }
        })
      }
      },
        fail(e) {
          console.error(e)
              callback(e)
        }
    })
  },

  /**
   * 购物车全选事件
   */
  selectAll(e) {
    let selectAllStatus = this.data.selectAllStatus;
    selectAllStatus = !selectAllStatus;
    let carts = this.data.cartList;
    for (let i = 0; i < carts.length; i++) {
      carts[i].selected = selectAllStatus;
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      cartList: carts
    });
    this.getTotalPrice();
  },
  
  /**
   * 绑定加数量事件
   */
  addCount(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.cartList;
    let num = carts[index].quantity;
    num = num + 1;
    carts[index].quantity = num;
    this.setData({
      cartList: carts
    });
    this.getTotalPrice();
  },

  /**
   * 绑定减数量事件
   */
  minusCount(e) {
    const index = e.currentTarget.dataset.index;
    const obj = e.currentTarget.dataset.obj;
    let carts = this.data.cartList;
    let num = carts[index].quantity;
    if (num <= 1) {
      return false;
    }
    num = num - 1;
    carts[index].quantity = num;
    this.setData({
      cartList: carts
    });
    this.getTotalPrice();
  },

  /**
   * 计算总价
   */
  getTotalPrice() {
    let carts = this.data.cartList;                  // 获取购物车列表
    let total = 0;
    for (let i = 0; i < carts.length; i++) {         // 循环列表得到每个数据
      if (carts[i].selected) {                     // 判断选中才会计算价格
        total += carts[i].quantity * carts[i].salePrice;   // 所有价格加起来
      }
    }
    this.setData({                                // 最后赋值到data中渲染到页面
      cartList: carts,
      totalPrice: total.toFixed(2)
    });
  },
  paymoney() {
    let carts = this.data.cartList;    
    let goumai = []
    for (let i = 0; i < carts.length; i++) {         // 循环列表得到每个数据
      if (carts[i].selected) {                     // 判断选中才会计算价格
        goumai.push(carts[i])
      }
    }
    if(goumai.length<1){
      util.showModel('提示','您尚未选择商品')
      return;
    }else{
      
      wx.setStorageSync('cart', JSON.stringify(goumai));
      wx.navigateTo({
        url: "../orderConfirm/orderConfirm?orderfrom=B",
      });

    }
  },

})