import { $init, $digest} from '../../utils/util.js'
import { promisify } from '../../utils/promise.util'
var request = require('../../utils/https.js')
var baseorgin = getApp().globalData.baseorgin;
//上传图片
const wxUploadFile = promisify(wx.uploadFile)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: '',
    simg: '',
    sname: '',
    stitle: '',
    pics: [],
    productId: '',
    orderItemsId: '',
    images: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    $init(this)
    var simg = options.simg;
    var sname = options.sname;
    var stitle = options.stitle;
    var productId = options.productId;
    var orderItemsId = options.evaItemId;
    this.setData({
      simg: simg,
      sname: sname,
      stitle: stitle,
      productId: productId,
      orderItemsId: orderItemsId
    })
     
  },
  //评论内容
  textarea: function(e) {
    this.setData({
      content: e.detail.value
    })
  },
  removeImage(e) {
    const idx = e.target.dataset.idx
    this.data.images.splice(idx, 1)
    this.setData({
      images: this.data.images
    })
  },
  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    const images = this.data.images
    wx.previewImage({
      current: images[idx], //当前预览的图片 
      urls: images, //所有要预览的图片 
    })
  },
  chooseImage(e) {
    var that=this;
    wx.chooseImage({
      count: 5, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        //选择5张
        console.log(res.tempFilePaths);
      
        const images = that.data.images.concat(res.tempFilePaths)
        that.data.images = images.length <= 5 ? images : images.slice(0, 5)
        that.setData({
          images: images
        })

      }
    })

  },
  add() {
    const content = this.data.content;
    var that=this;
    if (content) {
      const arr = [] //将选择的图片组成一个Promise数组，准备进行并行上传
      for (let path of this.data.images) {
        arr.push(wxUploadFile({
          url: `${baseorgin}/upload/upload?path=account`,
          filePath: path,
          name: 'file',
        }))
      }
      wx.showLoading({
        title: '正在创建...',
        mask: true
      }) // 开始并行上传图片 
      Promise.all(arr).then(res => { 
      
        return res.map(item => JSON.parse(item.data).msg)
      }).catch(err => {
        console.log(">>>> upload images error:", err)
      }).then(urls => { // 调用保存问题的后端接口 

        
          let isimgs = 0;
          let imgs = '';
          if (urls.length > 0) {
            isimgs = 1
          } else {
            isimgs = 0;
          }
      
          urls.forEach((item, index) => {
            imgs += item+','
          })
          imgs = (imgs.slice(imgs.length - 1) == ',') ? imgs.slice(0, -1) : imgs;
        request.req5('comment/create', 'POST', null, {
            commentContent: that.data.content,
            commentPics: imgs,
            orderItemsId: that.data.orderItemsId,
            productId: that.data.productId,
            isImg: isimgs
          }, (err, res) => {
             if(res.data.code=='200'){
               const pages = getCurrentPages();
               const currPage = pages[pages.length - 1];
               const prevPage = pages[pages.length - 2];
               // 将新创建的问题，添加到前一页（问题列表页）第一行 
               prevPage.data.questions.unshift(res)
               $digest(prevPage)
               wx.navigateBack()
             }
          })
        }).catch(err => {
          console.log(">>>> create question error:", err)
        }).then(() => {
          wx.hideLoading()
        })
  }
}
})