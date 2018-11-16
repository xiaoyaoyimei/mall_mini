// pages/refund/refund.js
import { $init, $digest } from '../../utils/util.js'
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
    reasonList:[],
    rforder:'',
    pics: [],
    refundCauseId:'',
    index:0,
    images: [],
    remarks:'',
    refundVideo:''
  },
   onReady: function (res) {
    this.videoContext = wx.createVideoContext('prew_video');
  },
  //退货理由
  bindTextarea: function (e) {
    this.setData({
      remarks: e.detail.value
    })
  },
  bindPickerChange: function (e) {

    let causeId = this.data.reasonList[e.detail.value].causeId;

    this.setData({
      index: e.detail.value,
      refundCauseId: causeId
    })
  },
  removeImage(e) {
    const idx = e.target.dataset.idx
    this.data.images.splice(idx, 1)
    this.setData({
      images: this.data.images
    })
  },
  removeVideo(){

    this.setData({
      refundVideo: ''
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

  handleVideoPreview(e){
    var status = e.detail.fullScreen;
    var play = {
      playVideo: false
    }
    if (status) {
      play.playVideo = true;
    } else {
      this.videoContext.pause();
    }
    this.setData(play);
  },
  getStatus: function () {
    var that = this;
    request.req2('refund/getRefundCauseList', 'GET', null, (err, res) => {
        that.setData({
          reasonList: res.data,
          refundCauseId: res.data[0].causeId
        })
    })
  },
  chooseImage(e) {
    var that = this;
    wx.chooseImage({
      count: 5, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
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
  //上传视频
  chooseVideo(e) {
    var that=this;
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success(res) {
       console.log(res.tempFilePath)
     
        wx.uploadFile({
          url: `${baseorgin}/upload/upload?path=account`,
            filePath: res.tempFilePath,
          name: 'file',
          success: function (res) {
            let resdata = JSON.parse(res.data)
            if (resdata.code=="200"){
            that.setData({
              refundVideo: resdata.msg
            })

           
            }
          }
        })
       
      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  var  rforder = options.rforder
    this.setData({
      rforder: rforder
    })
    this.getStatus();
  },

  add() {
    var that = this;
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
          imgs += item + ','
        })
        imgs = (imgs.slice(imgs.length - 1) == ',') ? imgs.slice(0, -1) : imgs;
        request.req5('refund/create', 'POST', null, {
          orderNo: that.data.rforder,
          refundCauseId: that.data.refundCauseId,
          refundImgs: imgs,
          remarks: that.data.remarks,
          refundVideo: that.data.refundVideo
        }, (err, res) => {
          if (res.data.code == '200') {
            wx.navigateTo({
              url: "../refundList/refundList",
            });

          }
        })
      }).catch(err => {
        console.log(">>>> create question error:", err)
      }).then(() => {
        wx.hideLoading()
      })
    }
 
})