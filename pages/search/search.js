let timeId = null;
var request = require('../../utils/https.js')
var uri = 'product/search' //商品列表的的uri
var app = getApp()
var imgurl = app.globalData.imgsrc;
Page({
    data: {
        history: [],
        hot: ['电竞椅', 'OH/DM133', '吃鸡款'],
        result: [],
        showKeywords: false,
        keywords: [],
        value: '',
        showResult: false,
        startRow:0,
        pageSize:10,
        tips: '没有更多数据了~', //无数据
        loadingHidden: true,
        moreshow:false,
        clientHeight:0,
        imgurl: imgurl,
      floorstatus: false,
      topNum:0
    },
    cancelSearch() {
        this.setData({
            showResult: false,
            showKeywords: false,
            moreshow: false,
            value: ''
        })
    },
    searchInput(e) {

      this.setData({
         value: e.detail.value
      })
      
        if(!e.detail.value){
            this.setData({
                showKeywords: false
            })
        }else{
            if(!this.data.showKeywords){
                    this.setData({
                        showKeywords: true,
                    })
            }
        }
    },
  searchPro(e){
    //在当前页面的搜索将初始置0
    this.setData({
      value: e.detail.value,
      startRow:0
    })
    this.search();
  },
    search(){
     var that=this;
      request.req('searchpage', uri, 'GET', {
        //搜索过滤     
        keyWord: that.data.value,
        startRow: that.data.startRow,
        pageSize: that.data.pageSize,
      }, (err, res) => {
        if (res.total > 0) {
          app.globalData.keyword = "";
          that.setData({
            loadingHidden: true,
            result: that.data.result.concat(res.itemsList),
            total: res.total,
          });
        }
        else {
          that.setData({
            result: [],
            loadingHidden: true,
          })
        }
        this.setData({
          value: that.data.value,
          showKeywords: false,
          showResult: true,
        }) 
        //当搜索的值不为空时，加入搜索记录
        if (that.data.value!=""){
          this.historyHandle(that.data.value);  
        }     
      })
    },
    keywordHandle(e) {
      const text = e.target.dataset.text;
      this.setData({
        value: text,
        showKeywords: false,
        showResult: true
      })
      this.historyHandle(text);  
      this.search();
    },
    historyHandle(value) {
        let history = this.data.history;
        const idx = history.indexOf(value);
        if (idx === -1) {
            // 搜索记录只保留8个
            if (history.length > 7) {
                history.pop();
            }
        } else {
            history.splice(idx, 1);
        }
        history.unshift(value);
        wx.setStorageSync('history', JSON.stringify(history));
        this.setData({
          history: history,
          keywords: history
        });
    },
    bindscrolltolower: function () { 
      var that = this;
      var tempstart = that.data.startRow;
      tempstart = that.data.startRow + that.data.pageSize;
      if (tempstart > that.data.total) {
        that.setData({
          loadingHidden: true,
          moreshow:true
        });
        return;
      } else {
        that.setData({
          startRow: tempstart
        });

        that.search();
      } //pageNo++,并传到数组中
    }, 

    onLoad() {
      var that=this;
        const history = wx.getStorageSync('history');
        if (history) {
          that.setData({
                history: JSON.parse(history)
            })
        }
        wx.getSystemInfo({
          success: function (res) {
            let height = res.windowHeight;
            wx.createSelectorQuery().selectAll('.search-box').boundingClientRect(function (rects) {
              rects.forEach(function (rect) {
                that.setData({
                  clientHeight: res.windowHeight - rect.bottom
                });
              })
            }).exec();
          }
        });

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
})