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
    cartModal: false,
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
  },
  cartmodal() {
    this.cartModal = true
  },
  //喜欢
  likepro() {
    if (this.token != null && this.token != "" && this.token != undefined) {
      this.$axios({
        method: 'post',
        url: `/like/insert/${this.productId}`,
      }).then((res) => {
        if (res.code == '200') {
          this.$Message.info('收藏成功');
          this.likeshow = true;
        } else if (res.code == '500') {
          this.$Message.error(res.object);
          this.likeshow = true;
        } else {
          this.$Message.error('收藏失败');
          this.likeshow = false;
        }

      })
    } else {
      this.$Message.error('您尚未登录,请先登录');
    }

  },
  getlikepro() {
    let id = this.data.shangp.product.id
    request.req3(`/like/queryIsLiked/${id}`, 'post',{},(err,res) => {
      this.setData({
        likeshow:res
      })
    })
  },
  //点赞
  zan(value, isZan) {
    var zanid = value;
    var Like = isZan;
    if (Like == 'N') {
      Like = 'yes'
    } else {
      Like = 'no'
    }

    request.req2('/comment/beLike/' + zanid + '/' + Like, 'post',{},(res) => {
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

  changeNumber: function (event) {
    var obj = event.target;
    this.quantity = parseInt(obj.value);
    let n = /^[1-9]\d*$/;
    if (!n.test(obj.value)) {
      this.$Message.warning('商品数量须大于0个，请输入正整数');
      obj.value = 1
      this.quantity = 1
      return false;
    }
    if (this.quantity >= this.max) {
      this.quantity = this.max
    }
    this.calculate();
  },
  //添加
  jia: function () {
    if (this.quantity >= this.max) {
      this.quantity = this.max
    } else {
      this.quantity = parseInt(this.quantity) + 1;
    }
  },
  //减
  jian: function () {
    if (this.quantity == 1) {
      this.quantity == 1
    } else {
      this.quantity = parseInt(this.quantity) - 1;
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
    if (this.token != null && this.token != "" && this.token != undefined) {
      if (this.productItemId == "") {
        this.$Message.error('请选择商品属性');
        return
      }
      this.cartOne.id = this.choosesp.id;
      this.cartOne.productId = this.choosesp.productId;
      this.cartOne.image = this.choosesp.img;
      this.cartOne.productName = this.choosesp.itemNo;
      this.cartOne.quantity = this.quantity;
      this.cartOne.originSalePrice = this.choosesp.price;
      this.cartOne.salePrice = this.choosesp.cuxiaoprice;
      this.cartOne.promotionTitle = this.choosesp.activityName;
      this.cartOne.productType = this.shangp.product.typeId;
      this.cartOne.productCatalog = this.shangp.product.catalogId;
      this.cartList[0] = this.cartOne;
      //0为单个立即下单，1为推荐组合中的立即下单
      //				if(v==1){
      //					this.cartList=this.cartList.concat(this.compineList)
      //				}
      sessionStorage.removeItem('cart');
      sessionStorage.setItem('cart', JSON.stringify(this.cartList));
      this.$router.push({
        name: '/carttwo'
      });
      localStorage.setItem('orderfrom', 'A')
    } else {
      this.$router.push({
        path: '/login',
        query: {
          redirect: this.$route.fullPath
        }
      })
    }
  },
  //加入购物车addtocart
  atc() {
    if (this.token != null && this.token != "" && this.token != undefined) {
      if (this.productItemId == "") {
        this.$Message.error('请选择商品属性');
        return
      }
      let productItemIds = [];
      productItemIds.push(this.productItemId);
      if (this.compineId.length > 0) {
        productItemIds = this.compineId.concat(productItemIds);
        this.quantity = 1;
      }
      this.$axios({
        method: 'post',
        url: '/order/shopping/add',
        data: {
          productItemIds: productItemIds,
          quantity: this.quantity
        }
      }).then((res) => {
        if (res.code == '200') {
          this.$router.push({
            name: '/cart',
          });
        } else {
          this.$Message.error('加入购物车失败');
        }
      })
    } else {
      this.$router.push({
        path: '/login',
        query: {
          redirect: this.$route.fullPath
        }
      })
    }
  },
  //选择商品
  detail() {
    var self = this;
    return new Promise(function (resolve, reject) {
      var chooseId = "",
        jishu = 0;
      let dditem = self.$refs['dditem'];
      if (dditem != null) {
        for (let n = 0; n < dditem.length; n++) {
          if (dditem[n].getAttribute("class") == 'active') {
            chooseId += dditem[n].getAttribute("titleid") + ',';
            jishu++
          }
        }
      }
      chooseId = (chooseId.slice(chooseId.length - 1) == ',') ? chooseId.slice(0, -1) : chooseId;
      var flag = false;
      if (jishu == self.shangp.productAttrList.length) {
        //通过选择属性读出productItemId
        for (let chooseItem of self.shangp.productItemList) {
          if (chooseItem.productModelAttrs == chooseId) {
            self.shangp.product.modelNo = chooseItem.itemNo;
            self.ImgUrl = chooseItem.listImg;
            self.choosesp.id = chooseItem.id;
            self.choosesp.productId = chooseItem.productId;
            self.choosesp.img = chooseItem.listImg;
            self.choosesp.itemNo = chooseItem.itemNo;
            self.choosesp.price = chooseItem.salePrice;

            //若无促销，则促销价为原价
            self.choosesp.cuxiaoprice = chooseItem.salePrice;
            self.productItemId = chooseItem.id;
            if (self.shangp.promotions.length > 0) {
              for (let cxitem of self.shangp.promotions) {
                if (cxitem.productItemId == self.productItemId) {
                  self.cxshow = true;
                  self.choosesp.cuxiaoprice = cxitem.onSalePrice;
                  self.choosesp.activityName = cxitem.activityName;
                  self.choosesp.startTime = cxitem.startTime;
                  self.choosesp.endTime = cxitem.endTime;
                  self.choosesp.quantity = cxitem.quantity;
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
          self.choosesp.itemNo = "";
          self.choosesp.price = "";
          self.xiajia = true
          self.firstshow = false
        } else {
          self.xiajia = false;
          self.firstshow = true
        }
        //计算库存（库存需大于0才显示）
        var kucunflag = false;
        if (self.shangp.inventory.length > 0) {
          for (let kucunitem of self.shangp.inventory) {
            if (kucunitem.skuId == self.productItemId) {
              kucunflag = true;
              self.choosesp.kucun = kucunitem.quantity - kucunitem.lockQuantity;
              //设置加入购物车的最大值
              self.max = self.choosesp.kucun;
              if (self.choosesp.kucun < 0) {
                self.choosesp.kucun = 0;
                self.max = 0;
              }
            }
          }
        }
        if (!kucunflag) {
          self.choosesp.kucun = 0;
        }
        if (self.choosesp.kucun < 1) {
          self.wuhuotongzhi = true;
        } else {
          self.wuhuotongzhi = false;
        }
        self.getlikepro(self.productItemId);

      } else {
        return;
      }
    });
  },
  //选择属性
  chooseSP(e, pa) {
    this.cxshow = false;
    let p = [];
    var i = 0;
    if (e.target.tagName == "IMG") {
      p = e.target.parentNode.parentNode.parentNode.children;
      for (i = 0; i < p.length; i++) {
        p[i].children[0].className = "";
      }
      e.target.parentNode.className = "active";
    } else {
      p = e.target.parentNode.parentNode.children;
      for (i = 0; i < p.length; i++) {
        p[i].children[0].className = "";
      }
      e.target.className = "active";
    }
    this.detail();
  },
  //获取该商品信息
  getProduct() {
    var _this = this;
    return new Promise(function (resolve, reject) {
      _this.videoshow = false;
      request.req3('/product/' + _this.data.productId, 'post',{},(err,res) => {
        if (res.data.code == '200') {
          //原始数据用于合并求得的数据=>新数据
          _this.setData({
            shangp: Object.assign( _this.data.oldshangp, res.data.object)
          })
          if (_this.data.shangp.inventory.length > 0) {
            for (let kucunitem of _this.data.shangp.inventory) {
              var choosespkucun;
              choosespkucun += kucunitem.quantity - kucunitem.lockQuantity
              _this.setData({
                'choosesp.kucun':choosespkucun
              })
            }
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
      }).catch(function () {
        reject();
      });
    })
  },
  getProductDesc() {
    //详情
    request.req3('/product/desc/' + this.data.productId, 'post',{},(err,res) => {
      this.setData({
        productDesc:res.data
      })
    });

    request.req3('/product/img/' + this.data.productId, 'post',{},(err,res) => {
      this.setData({
        productimg: res.data
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
    request.req3('/comment/search/' + this.data.productId + '/' + imgshow, 'get',{},(err,res) => {
      console.log(res.data)
      if (res.data.code == "200" && res.data.object.length > 0) {
        this.setData({
          commentList: res.data.object,
          hasPJ:true
        })
      } else {
        this.setData({
          hasPJ:false
        })
      }
    });
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