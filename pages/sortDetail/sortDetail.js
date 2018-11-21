// pages/sortDetail/sortDetail.js
var app = getApp()
var imgurl = app.globalData.imgsrc;
var util = require('../../utils/util.js')
var request = require('../../utils/https.js')
var uri_home = 'floor/api/indexListAll'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videonum: 1,
    hasPJ: true,
    cartList: [],
    cartOne: {
      id: '',
      image: '',
      originSalePrice: 0,
      productName: '',
      quantity: 1,
      salePrice: 0,
      productType: '',
    },
    onlyimg: false, //0为img为空。1显示图片
    //库存是否为0添加购物车显示按钮
    num: 0,
    isActive: false,
    videoshow: false,
    controlshow: false,
    mousehidden: true,
    format:util.formatTime,
    xiajia: false,
    wuhuotongzhi: false,
    firstshow: false,
    selectedId: -1,
    modal2: false,
    videoIcon: false,
    //商品最原始数据
    oldshangp: {
      product: {
        modelNo: ''
      },
      promotions: [],
      productImageList: [],
      productItemList: [],
      inventory: [],
      productAttrList: [],
    },
    //请求product之后的商品数据
    shangp: {
      product: {
        modelNo: '',
        salePrice: 0
      },
      promotions: [],
      productImageList: [],
      productItemList: [],
      inventory: [],
      productAttrList: [],
    },
    gaoliang:{},
    productDesc: [],
    productimg: [],
    cxshow: false,
    stock: false,
    choosesp: {
      id: '',
      img: '',
      itemNo: '',
      price: 0, //现价
      cuxiaoprice: 0,
      activityName: '',
      startTime: '',
      endTime: '',
      kucun: 0,
      quantity: 1,
    },
    hidden:true,
    productItemId: '',
    quantity: 1,
    max: 100,
    productId: '',
    ImgUrl: '',
    imgurl: imgurl,
    choosepPrice: false,
    productImageListNew: [],
    recomm: [],
    commentList: [],
    dpjiage: 0,
    dpnum: 0,
    compineId: [],
    likeshow: false,
    player: {},
    topNum: 0,
  },

    
  cartmodal() {
    var CuserInfo = wx.getStorageSync('CuserInfo');

    if (CuserInfo.token) {
      this.setData({
        hidden: false
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      });
    }
  },
  // 获取滚动条当前位置
  scrolltoupper: function (e) {
    if (e.detail.scrollTop > 100) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },
  //回到顶部 
  goTop: function (e) {
    // 一键回到顶部 
    this.setData({
      topNum: this.data.topNum = 0
    });
  },
  //喜欢
  likepro() {
    let id = this.data.productId
    request.req2(`like/insert/${id}`,'post','',(err,res) => {
        if (res.code == '200') {
          util.showError('收藏成功');
          this.setData({
            likeshow: true
          })
        } else if (res.code == '500') {
          util.showError(res.object);
          this.setData({
            likeshow: true
          })
        } else if (res.code == '401'){
          wx.navigateTo({
            url: '/pages/login/login',
          });          
        }else {
          util.showError('收藏失败');
          this.setData({
            likeshow: false
          })
        }

      })

  },
  getlikepro() {
    let id = this.data.shangp.product.id
    var CuserInfo = wx.getStorageSync('CuserInfo');
    if (CuserInfo.token) {
    request.req2(`/like/queryIsLiked/${id}`, 'post','',(err,res) => {
      this.setData({
        likeshow:res
      })
    })
    }
  },
  //点赞
  zan(e) {
    var zanid = e.currentTarget.dataset.id;
    var Like = e.currentTarget.dataset.iszan;
    if (Like == 'N') {
      Like = 'yes'
    } else {
      Like = 'no'
    }

    request.req2('/comment/beLike/' + zanid + '/' + Like, 'post','',(err,res) => {
      if (res.code == '200') {
        this.showcomments()
      }
    })
  },
  //只显示带图评论
  toggleimg() {
    this.setData({
      onlyimg: !this.data.onlyimg
    })
    this.showcomments();
  },

  //切换商品介绍和规格
  toggletab(e) {
    this.setData({
      num : e.currentTarget.dataset.index
    })
  },
  closemodal:function(){
    this.setData({
      hidden:true
    })
  },
  gohome:function(){
    wx.switchTab({
      url: '/pages/index/index',
    });
  },
  gocart: function () {
    wx.switchTab({
      url: '/pages/cartOne/cartOne',
    });
  },
  searchInput: function (e) {
    var obj = e.detail.value;
    this.setData({
      quantity: parseInt(obj)
    })
    let n = /^[1-9]\d*$/;
    if (!n.test(obj)) {
      util.showError('商品数量须大于0个，请输入正整数');
      obj = 1
      this.setData({
        quantity:1
    })
      return false;
    }
    if (this.data.quantity >= this.data.max) {
      this.setData({
        quantity: this.data.max
      })
    }
  },
  //添加
  jia: function () {

    if (this.data.quantity >= this.data.max) {
      this.setData({
        quantity: this.data.max
      })
    } else {
      this.setData({
        quantity: parseInt(this.data.quantity) + 1
      })
    }
  },
  //减
  jian: function () {
    if (this.data.quantity < 1) {
      this.setData({
        quantity:0
      })
    } else {
      this.setData({
        quantity: parseInt(this.data.quantity) - 1
      })
    }
  },

  close() {
    this.videoshow = false;
    this.videonum = 1
  },
  togglevideotab(v) {
    this.videonum = v;
    if (v == 0) {
      this.player.playVideo();
    }
  },
  buynow(v) {
      if (this.data.productItemId == "") {
        util.showError('请选择商品属性');
        return
      }
      this.setData({
        'cartOne.id' :this.data.choosesp.id,
       'cartOne.productId' : this.data.choosesp.productId,
        'cartOne.image' : this.data.choosesp.img,
        'cartOne.productName' : this.data.choosesp.itemNo,
        'cartOne.quantity': this.data.quantity,
        'cartOne.originSalePrice' :this.data.choosesp.price,
        'cartOne.salePrice' : this.data.choosesp.cuxiaoprice,
        'cartOne.promotionTitle':this.data.choosesp.activityName,
        'cartOne.productType' : this.data.shangp.product.typeId,
        'cartOne.productCatalog' :this.data.shangp.product.catalogId,
        'cartList[0]': this.data.cartOne,
      })
      //0为单个立即下单，1为推荐组合中的立即下单
      //				if(v==1){
      //					this.cartList=this.cartList.concat(this.compineList)
      //	
    var cart = wx.getStorageSync("cart")		
      if(cart != undefined){
        wx.removeStorage('cart');
      }
      wx.setStorageSync('cart', JSON.stringify(this.data.cartList));
  
      wx.navigateTo({
        url: '/pages/orderConfirm/orderConfirm?orderfrom=A',
      });
      
  },
  //加入购物车addtocart
  atc() {

    let productItemIds = [];
      if (this.data.productItemId == "") {
        util.showError('请选择商品属性');
        return
      }
      productItemIds.push(this.data.productItemId);
      if (this.data.compineId.length > 0) {
        productItemIds = this.data.compineId.concat(productItemIds);
        this.data.quantity = 1;
      }
      request.req2('/order/shopping/add', 'post',
        {
          productItemIds: productItemIds,
          quantity: this.data.quantity
        },(err,res) => {
        if (res.code == '200') {
          wx.switchTab({
            url: '/pages/cartOne/cartOne',
          });
        } else if (res.code == '401'){
          wx.navigateTo({
            url: '/pages/login/login',
          });
        } else{
          util.showError('加入购物车失败');
        }
      })
    },
  //选择商品
  detail(e) {
      var chooseId = "",
        jishu = 0;
   
    let dditem = this.data.shangp.productAttrList;
      if (dditem != null) {
        for (let n = 0; n < dditem.length; n++) {
          if (dditem[n].attrValues.length == '1') {
            chooseId += dditem[n].attrValues[0].id + ',';
            jishu++
          }else{
            for (let m = 0; m < dditem[n].attrValues.length; m++){
              let active = dditem[n].attrValues[m].active
              if (active){
                chooseId += dditem[n].attrValues[m].id + ',';
                jishu++
              }else{
                var aaa = 'shangp.productAttrList[' + n + '].attrValues[' +m + '].active'
                this.setData({
                  [aaa]:false
                })

              }
            }
          }
        }
      }
      chooseId = (chooseId.slice(chooseId.length - 1) == ',') ? chooseId.slice(0, -1) : chooseId;
      var flag = false;
      if (jishu == this.data.shangp.productAttrList.length) {
        //通过选择属性读出productItemId
        for (var chooseItem of this.data.shangp.productItemList) {
          if (chooseItem.productModelAttrs == chooseId) {
            this.setData({
              'shangp.product.modelNo': chooseItem.itemNo,
              'Imgurl': chooseItem.listImg,
              "choosesp.id": chooseItem.id,
              'choosesp.productId': chooseItem.productId,
              'choosesp.img': chooseItem.listImg,
              'choosesp.itemNo': chooseItem.itemNo,
              "choosesp.price": chooseItem.salePrice,
            })
            //若无促销，则促销价为原价
            this.setData({
              'choosesp.cuxiaoprice': chooseItem.salePrice,
              'productItemId': chooseItem.id
            })
            if (this.data.shangp.promotions.length > 0) {
              for (let cxitem of this.data.shangp.promotions) {
                if (cxitem.productItemId == this.data.productItemId) {
                  this.setData({
                    'cxshow': true,
                    'choosesp.cuxiaoprice' : cxitem.onSalePrice,
                    'choosesp.activityName': cxitem.activityName,
                    'choosesp.startTime' : cxitem.startTime,
                   ' choosesp.endTime' :cxitem.endTime,
                    'choosesp.quantity' : cxitem.quantity,
                  })
                  
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
          this.setData({
            'choosesp.itemNo' : "",
            'choosesp.price': "",
            'xiajia' : true,
            'firstshow': false,
          })

        } else {
          this.setData({
            'xiajia': false,
            'firstshow': true,
          })
        }
        //计算库存（库存需大于0才显示）
        let kucunflag = false;
        if (this.data.shangp.inventory.length > 0) {
          for (let kucunitem of this.data.shangp.inventory) {
            if (kucunitem.skuId == this.data.productItemId) {
              kucunflag = true;
              this.setData({
                'choosesp.kucun': kucunitem.quantity - kucunitem.lockQuantity,
                'max':this.data.choosesp.kucun,
              })
              //设置加入购物车的最大值
              if (this.data.choosesp.kucun < 0) {
                this.setData({
                  'choosesp.kucun': 0,
                  'max':0,
                })
              }
            }
          }
        }
        if (!kucunflag) {
          this.setData({
            'choosesp.kucun': 0,
          })
        }
        if (this.data.choosesp.kucun < 1) {
          this.setData({
            wuhuotongzhi:true
          })
        } else {
          this.setData({
            wuhuotongzhi: false
          })
        }
        this.getlikepro(this.data.productItemId);

      } else {
        return;
      }
  },
  //选择属性
  chooseSP(e, pa) {
    this.cxshow = false;
    let p = [];
    var i = 0;
    for (var j = 0; j < this.data.shangp.productAttrList.length;j++){
      if (j == e.currentTarget.dataset.i){
        
        for (var k = 0; k < this.data.shangp.productAttrList[j].attrValues.length; k++){
          if (k == e.currentTarget.dataset.index){
            var aa = 'shangp.productAttrList['+j+'].attrValues['+k+'].active'
            this.setData({
              [aa]:true
            })
          }else{
            var aa = 'shangp.productAttrList[' + j + '].attrValues[' + k + '].active'
            this.setData({
              [aa]: false
            })
          }
        }
      }

    }
    this.detail();
  },
  //获取该商品信息
  getProduct() {
    var _this = this;
    return new Promise(function (resolve, reject) {
      _this.videoshow = false;
      request.req3('/product/' + _this.data.productId, 'post',{},(err,res) => {
        if (res.code == '200') {
          //原始数据用于合并求得的数据=>新数据
          _this.setData({
            shangp: Object.assign( _this.data.oldshangp, res.object)
          })
          
          if (_this.data.shangp.inventory.length > 0) {
            var choosespkucun = 0;
            for (let kucunitem of _this.data.shangp.inventory) {
              
              choosespkucun += kucunitem.quantity - kucunitem.lockQuantity

            }
            _this.setData({
              'choosesp.kucun': choosespkucun
            })
            if (_this.data.choosesp.kucun < 0) {
              this.setData({
                'choosesp.kucun':0
              })
            }
          }
          if (_this.data.choosesp.kucun < 1) {
            _this.setData({
              wuhuotongzhi: true
            })
          } else {
            _this.setData({
              wuhuotongzhi: false
            })
          }
          _this.setData({
            ImgUrl: _this.data.shangp.product.modelImg
          })
          // let vwidth = document.body.clientWidth;
          // console.log(vwidth);
          // console.log(_this.data.shangp.product.video);
          // if (_this.data.shangp.product.video != '') {
          //   _this.player = new YKU.Player('youkuplayer', {
          //     styleid: '0',
          //     client_id: '0996850d68cf40fe',
          //     vid: _this.data.shangp.product.video,
          //     newPlayer: true,
          //     isAutoPlay: true,
          //     // width: vwidth,
          //     // height: vwidth
          //   });
          //   _this.setData({
          //     videoshow :true,
          //     controlshow: true
          //   })

          // }

        }
        _this.getlikepro();
        resolve();
      });
    }).catch(function () {
      reject();
    })
  },
  getProductDesc() {
    //详情
    request.req3('/product/desc/' + this.data.productId, 'post',{},(err,res) => {
      this.setData({
        productDesc:res
      })
    });
    request.req3('/product/img/' + this.data.productId, 'post', {}, (err, res) => {
      this.setData({
        productimg: res
      })
    });
  },
  //显示评论。0位全部评论，1为显示带图评论
  showcomments() {
    var imgshow = this.data.onlyimg;
    if (imgshow == true) {
      imgshow = 1
    } else {
      imgshow = 0
    }

    var CuserInfo = wx.getStorageSync('CuserInfo');
    if (CuserInfo.token) {
    request.req2('/comment/search/' + this.data.productId + '/' + imgshow, 'get',{},(err,res) => {
      if (res.code == "200" && res.object.length > 0) {
        this.setData({
          commentList: res.object,
          hasPJ:true
        })
      } else {
        this.setData({
          hasPJ:false
        })
      }
    });
    } else {
      request.req3('/comment/search/' + this.data.productId + '/' + imgshow, 'get', {}, (err, res) => {
        if (res.code == "200" && res.object.length > 0) {
          this.setData({
            commentList: res.object,
            hasPJ: true
          })
        } else {
          this.setData({
            hasPJ: false
          })
        }
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.productId = options.id;
    this.getProduct().then(res => {
      this.detail();
    });
    this.showcomments();
    this.getProductDesc()
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