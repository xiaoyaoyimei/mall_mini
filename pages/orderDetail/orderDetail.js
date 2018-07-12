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
      //状态由orderlist页面带来。以免二次处理
      orderStatus:'',
  },
  onLoad(options) {
    this.setData({
      orderNo: options.orderNo,
        orderStatus: options.orderStatus
    })
    this.getOrder();
    this.getStatusEnum();
  },
  onshow(){
    this.getOrder();
  },
    formatDate(time) {
      var date = new Date(time);
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
    },

    getStatusEnum() {
      request.req('order','order/enums', 'GET', {}, (err, res) => {
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
        title: '温馨提示',
        content: '确定取消该订单?',
        success: function (res) {

          if (res.confirm) {

            request.req2('order/cancel', 'POST', orderNo, (err, res) => {
              if (res.code == 200) {
                self.getOrder();
                wx.showToast({
                  title: '取消成功',
                  icon: 'success',
                  duration: 1000,
                  mask: true
                })
              }else{
                wx.showToast({
                  title: '取消失败',
                  icon: 'loading',
                  duration: 1000,
                  mask: true
                })
              }
            });
          } 
        },
        fail(e) {
          console.error(e)
          callback(e)
        }
      }) 
    },
    quzhifu() {

      //this.$router.push({ name: '/cartthree', query: { orderNo: this.orderNo } });
    },
    editInvoice(e){
      var order = e.currentTarget.dataset.order
      wx.navigateTo({
        url: "../invoice/invoice?orderNo=" + order
      })
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