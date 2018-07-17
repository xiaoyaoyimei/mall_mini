//商品分类页传来的商品Id
var specId = ''
var app = getApp();
var imgurl = getApp().globalData.imgsrc;
var request = require('../../utils/https.js')
var uribuy = 'order/shopping/add'; //立即购买
var uri = 'product';
var selectAttrid = [];//选择的属性id
var selectIndexArray=[];//选中属性的名称
Page({
  data: {
    imgurl: imgurl,
    showModal: false,
    tips: '',
    max: 100,
    detailData: {
      product: { modelNo: '', salePrice: 0 },
      promotions: [],
      productImageList: [],
      productItemList: [],
      inventory: [],
      productAttrList: []
      },
    quantity:1,
    indicatorDots: true,
    interval: 5000,
    duration: 1000,
    selectName: "",//已选的属性名字
    selectAttrid: [],//选择的属性id
    choosesp: {
      img: '',
      itemNo: '',
      price: 0,
      cuxiaoprice: '',
      activityName: '',
      startTime: '',
      endTime: '',
      kucun: 0,
    },//选中的商品信息
    cxshow: false,
    xiajia: false,
    kuncunEmpty:false,
    productItemId: '',
    quantity: 1,
    max: 100,
    firstshow: false,
    productDesc: [],
    productimg: [],
    selected: true,
    selected1: false
  },
  selected: function (e) {
    this.setData({
      selected1: false,
      selected: true
    })
  },
  selected1: function (e) {
    this.setData({
      selected: false,
      selected1: true
    })
  },
  onShareAppMessage: function (res) {
    var that=this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    console.log(that.data.detailData.product.modelTitle);
    return {
      title: that.data.detailData.product.modelTitle,
      path: `/pages/goodsDetail/goodsDetail?specId=${specId}`
    }
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    var that = this;
    specId = options.specId;
    this.requestData(specId);
    this.getimgdetail(specId);
  },
  getimgdetail(oo){
    specId = oo;
    var that=this;
    request.req2('product/desc', 'POST', specId, (err, res) => {
        that.setData({
          productDesc: res.data,
        })
    });
    request.req2('product/img', 'POST', specId, (err, res) => {
        that.setData({
          productimg: res.data,
        })
      });
  },
  //数据请求*(直接带post参数)
  requestData: function (oo) {
    specId = oo;
    var that = this;
    request.req2(uri, 'POST',specId, (err, res) => {
      console.log(res.data.object)
      if (res.data.code == 200) {
        that.setData({
          detailData: Object.assign(that.data.detailData, res.data.object),
        })
        var temp = that.data.detailData;
        var jishu=0;
        var selectName = "";

        for (var i = 0; i < temp.productAttrList.length; i++) {
          if (temp.productAttrList[i].attrValues.length==1){
            temp.productAttrList[i].selectedValue =0;
            selectAttrid[i] = temp.productAttrList[i].attrValues[0].id;   
            selectName += ' "' + temp.productAttrList[i].attrValues[0].modelAttrValue + '" ';         
            jishu+=1;
          }
         // temp.productAttrList[i].selectedValue = temp.productAttrList[i].attrValues[0].id;
        }
        if (jishu == temp.productAttrList.length){
          this.showpro(selectAttrid);
        }
        that.setData({
          detailData: temp,
          selectAttrid: selectAttrid,
          selectName: selectName,
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  showbynow:function(){
    this.setData({
      showModal: true
    })
  },
  showDialogBtn: function () {
    this.setData({
      showModal: true
    })
  },
  /**
      * 弹窗
      */
  showDialogBtn: function () {
    this.setData({
      showModal: true
    })
  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },

  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {
  },
  

  /* 选择属性值事件 */
  selectAttrValue: function (e) {

//点击过，修改属性
    var selectIndex = e.currentTarget.dataset.index;//属性索引 
    var columnIndex = e.currentTarget.dataset.columnIndex;
    var detailData = this.data.detailData;
    detailData.productAttrList[selectIndex].selectedValue = columnIndex;
   

    var key = e.currentTarget.dataset.key;
    //当前属性item
    var itemvalue = e.currentTarget.dataset.value;
    e.currentTarget.dataset.selectedvalue = itemvalue.id;
  
    var count = detailData.productAttrList[selectIndex].attrValues.length;

    //点击过，修改属性
    var selectName = "";
    //点击过，修改属性
    selectIndexArray[selectIndex] = itemvalue.modelAttrValue;
    selectAttrid[selectIndex] = itemvalue.id;
    //将数组的所有属性名拼接起来
    for (var i = 0; i < selectIndexArray.length; i++) {  
      selectName += ' "' + selectIndexArray[i] + '" ';
    }
    
    this.setData({
      detailData: detailData,
      selectName: selectName,
      selectAttrid: selectAttrid
    });
    var jishu = 0;
    for (var i = 0; i < selectAttrid.length; i++) {
      if (selectAttrid[i]!=undefined) {
        jishu += 1;
      }
    }
    if (jishu == selectAttrid.length) {
      this.showpro(selectAttrid);
    } 
  },
  showpro: function (selectAttrid){
        //将选中的数组ID转换成字符串
    var chooseId = "";
    for (let n = 0; n < selectAttrid.length; n++) {
      chooseId += selectAttrid[n] + ',';
    }

    chooseId = (chooseId.slice(chooseId.length - 1) == ',') ? chooseId.slice(0, -1) : chooseId;
    var chooseId = chooseId;
    var flag = false;
    //通过选择属性读出productItemId
    for (let chooseItem of this.data.detailData.productItemList) {
      if (chooseItem.productModelAttrs == chooseId) {
        this.data.choosesp.img = chooseItem.listImg;
        this.data.choosesp.itemNo = chooseItem.itemNo;
        this.data.choosesp.price = chooseItem.salePrice;
        this.data.productItemId = chooseItem.id;
        if (this.data.detailData.promotions.length > 0) {
          for (let cxitem of this.data.detailData.promotions) {
            if (cxitem.productItemId == this.productItemId) {
              this.data.cxshow = true;
              this.data.choosesp.cuxiaoprice = cxitem.onSalePrice;
              this.data.choosesp.activityName = cxitem.activityName;
              this.data.choosesp.startTime = cxitem.startTime;
              this.data.choosesp.endTime = cxitem.endTime;
            }
          }
        }
        flag = true;
        break;
      } else {
        flag = false
      }
    }
    if (flag == false) {
      this.data.choosesp.itemNo = "";
      this.data.choosesp.price = "";
      this.data.xiajia = true;
      this.data.firstshow = false;
    } else {
      this.data.xiajia = false;
      //只有符合选到商品才会显示弹出框mini product
      this.data.firstshow = true
    }
    //计算库存（库存需大于0才显示）
    if (this.data.detailData.inventory.length > 0) {
      for (let kucunitem of this.data.detailData.inventory) {
        if (kucunitem.skuId == this.data.productItemId) {
          this.data.choosesp.kucun = kucunitem.quantity - kucunitem.lockQuantity
        }
      }
    }
    if (this.data.choosesp.kucun < 1) {
      this.data.kuncunEmpty = true;
    } else {
      this.data.kuncunEmpty = false;
    }
    this.setData({
      choosesp: this.data.choosesp,
      xiajia: this.data.xiajia,
      firstshow: this.data.firstshow,
      kuncunEmpty: this.data.kuncunEmpty,
    });
  },
  addCount: function () {
    let quantity = this.data.quantity;
    if (quantity >= this.data.max) {
      quantity = this.data.max
    } else {
      quantity = parseInt(quantity) + 1;
    }
    this.setData({
      quantity: quantity
    });
  },
  //减
  minusCount: function () {
    let quantity = this.data.quantity;
    if (quantity == 1) {
      quantity == 1
    } else {
      quantity = parseInt(quantity) - 1;
    }
    this.setData({
      quantity: quantity
    });
  },
  atc() {

    if (this.data.productItemId == "") {
      wx.showToast({
        title: "请选择商品属性"
      })
      return;
    }else{

      request.req(specId,'order/shopping/add', 'POST', {
          productItemId: this.data.productItemId,
          quantity: this.data.quantity
        }, (err, res) => {
          if (res.data.code == 200) {
            wx.switchTab({
              url: '../cartOne/cartOne',
            })
            }
            else {
            wx.showToast({
              title: res.data.msg
            })
              return;
            }

        })
      }
    }


})