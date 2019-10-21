// miniprogram/pages/aip/aip.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command;
Page({
  data: {
    statusBarH: 20,
    objectArray: [],
    typeIndex: 0,

    access_token:'',
    imgList: [],
    disabled: false,
    isRelease: false,
    baseUrl:'',


    result: []    // 识别数据
  },
  onLoad: function (options) {
    this.onServices();
    this.getBaiduToken()
  },
  onServices() {
    db.collection('services').get().then(res => {
      if (res.data.length) {
        this.setData({
          isRelease: res.data[0].isRelease,
          baseUrl: res.data[0].baseUrl,
          objectArray: res.data[0].aipType
        })
      } else {
        this.setData({
          isRelease: false
        })
      }
    })
  },
  onShow: function () {
  },
  // 选择
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      typeIndex: e.detail.value
    })
    this.onSubmit()
  },
  onSubmit(e) {
    let _imgList = this.data.imgList;
    let _that = this;
    if (_imgList.length > 0) {
      // 先上传再提交表单
      this.lastUpload(e); // 提交时上传图片
    }
  },
  // -----------------------------------上传图片start----------------------------------
  chooseImage() {
    let _this = this;
    wx.chooseImage({
      count: 1,
      success: function (res) {
        console.log(res)
        _this.updateImgFile(res);
      }
    })
  },
  // 准备上传图片
  updateImgFile(obj) {
    let _this = this;
    let _imgList = [];
    console.log('updateImgFile:'+obj)
    if (obj.tempFilePaths) {
      obj.tempFilePaths.map((item, index) => {
        // _imgList = _this.data.imgList;
        _imgList=[]
        _imgList.push(item); // 临时图片数组
        _this.setData({
          imgList: _imgList
        })
        _this.onSubmit()
      })
    }
  },

  // 最后上传
  lastUpload(e) {
    let _this = this;
    let _imgList = _this.data.imgList,
      _imgListed = [];
      _this.setData({
        disabled:true
      })
    wx.showLoading({
      title: '识别中...',
    })
    _imgList.map((item, index) => {
      console.log(item)
      // 图片开始异步上传
      _this.aip(item)
    })

  },
  // -----------------------------------上传图片end------------------------------------
  previewImage(e) {
    let _currUrl = e.currentTarget.dataset.currUrl;
    let _urls = this.data.imgList;
    wx.previewImage({
      current: _currUrl,
      urls: _urls
    })
  },
  longpressImage(e) {
    console.log(e);
    let _that = this;
    wx.showModal({
      title: '提示',
      content: '是否删除',
      success: function (res) {
        if (res.confirm) {
          _that.delImg(e);
        }
      }
    })
  },
  delImg(e) {
    let idx = e.currentTarget.dataset.index;
    let _imgList = this.data.imgList;
    _imgList.splice(idx, 1);
    this.setData({
      imgList: _imgList
    })
    console.log(this.data.imgList)
  },
  //获取Access Token
  getBaiduToken(){
    wx.request({
      url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=0ykzn4GXkfbcWaxWMHxSdXFp&client_secret=QyV8LYmAzbwcqbDiS1HGXpH9eBirqU0y', //开发者服务器接口地址",
       //请求的参数",
      method: 'GET',
      // dataType: 'json', //如果设为json，会尝试对返回的数据做一次 JSON.parse
      success: res => {
        console.log(res)
        this.setData({
          access_token:res.data.access_token
        })
      },
      fail: () => {},
      complete: () => {}
    });
  
  },
  //-------------------------------上传并识别----------------------------------
  aip(filePath) {
    let _that = this
    // let _baseUrl = 'http://127.0.0.1:3001'
    let _baseUrl = _that.data.baseUrl
    console.log('_baseUrl:'+_baseUrl)
    wx.getFileSystemManager().readFile({
      filePath: filePath, //选择图片返回的相对路径
      encoding: 'base64', //编码格式
      success: res => { //成功的回调
        
        var img = encodeURIComponent(res.data)
        console.log(img)
        wx.request({
          url:  _baseUrl+_that.data.objectArray[_that.data.typeIndex - 0].type+'?access_token='+this.data.access_token,  //开发者服务器接口地址",
          data: 'image='+img, //请求的参数",
          'Content-Type':'application/x-www-form-urlencoded',
          method: 'POST',
          // dataType: 'json', //如果设为json，会尝试对返回的数据做一次 JSON.parse
          success: res => {
            console.log(res)
             //do something
            _that.setData({
              disabled: false
            })
            wx.hideLoading();  // 成功后隐藏
            // res = JSON.parse(res.data)
            if (res.errMsg == "request:ok") {
              if (res.data.result.length) {
                res.data.result.map(item=>{
                  if (item.score) {
                    item.score = ((item.score - 0) * 100).toFixed(2) + '%'
                  }
                  if (item.probability) {
                    item.probability = ((item.probability-0) * 100).toFixed(2) + '%'
                  }
                })
              }
              _that.setData({
                result:res.data.result
              })
            }
          },
          fail: () => {},
          complete: () => {}
        });
      }
    })

   
  },
  backPage() {
    wx.navigateBack({
      delta: 1
    })
  }
})