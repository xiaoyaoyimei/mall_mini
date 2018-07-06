var request = require('../../utils/https.js')
Page({
  data: {
      statusList: [],
      orderdetail:{
        shippingOrder: {},
        shippingInvoice: {},
        shippingAddress: {},
        shippingOrderItems: []
      },
      orderNo: '',
  },
  onLoad(options) {
    console.log(options.orderNo)
    this.setData({
      orderNo: options.orderNo
    })
    this.getOrder();
    this.getStatusEnum();
  },
    formatDate(time) {
      var date = new Date(time);
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
    },

    getStatusEnum() {
      request.req('order/enums', 'GET', {}, (err, res) => {
        if (res.code == '200') {  
          this.setData({
          statusList: res.object
        })
        }
      });
    },
    statusfilter(value) {
      for (var i = 0; i < this.statusList.length; i++) {
        if (this.statusList[i].key == value) {
          return this.statusList[i].value;
        }
      }
    },
    cancel() {
      var orderNo = this.data.orderNo;
      wx.showModal({
        title: '提示',
        content: '确定取消该订单?',
        success: function (res) {
          if (res.confirm) {
            request.req2('order/cancel', 'POST', {orderNo}, (err, res) => {
              if (res.code == '200') {
                self.getOrder();
              }else{
                wx.showToast({
                  title: '取消成功',
                  icon: 'succes',
                  duration: 1000,
                  mask: true
                })
              }
            });
          } else if (res.cancel) {
            wx.showToast({
              title: '取消失败',
              duration: 1000,
              mask: true
            })
          }
        }
      }) 
    },
    quzhifu() {

      //this.$router.push({ name: '/cartthree', query: { orderNo: this.orderNo } });
    },
    productFeejun(item) {
      return item.productFee / item.quantity
    },

    getOrder() {
      var orderNo = this.data.orderNo;
      request.req2('order', 'GET', orderNo, (err, res) => {
          this.setData({
            orderdetail: res.data
          })    
        
      })
    },
    //   this.$axios({
    //     method: 'get',
    //     url: '/order/' + this.orderNo,
    //   }).then((res) => {
    //     this.orderdetail = res;
    //   });
    // },
 
    
})