let timeId = null;
var request = require('../../utils/https.js')
var uri = 'product/search' //商品列表的的uri
var app = getApp()
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
        tips: '', //无数据
        loadingHidden: true,
    },
    cancelSearch() {
        this.setData({
            showResult: false,
            showKeywords: false,
            value: ''
        })
    },
    searchInput(e) {
    //  value = e.detail.value
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

    search(){
     var that=this;
     console.log(that.data.value);
      request.req('searchpage', uri, 'GET', {
        //搜索过滤     
        keyWord: that.data.value,
        startRow: that.data.startRow,
        pageSize: that.data.pageSize,
      }, (err, res) => {
        if (res.data.total > 0) {
          app.globalData.keyword = "";
          that.setData({
            loadingHidden: true,
            result: that.data.result.concat(res.data.itemsList),
            total: res.data.total,
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
          showResult: true
        }) 
        this.historyHandle(that.data.value);  
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
          tips: "没有更多数据了~"
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
        const history = wx.getStorageSync('history');
        if (history) {
            this.setData({
                history: JSON.parse(history)
            })
            console.log(this.data.history);
        }
    }
})