// miniprogram/pages/index/audio.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command;
const recorderManager = wx.getRecorderManager();
const innerAudioContext =  wx.createInnerAudioContext()
const options = {
  
  sampleRate: 44100,
  numberOfChannels: 1,
  encodeBitRate: 192000,
  format: 'm4a',
  frameSize: 50
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hadAudio:false,
    myAudio:'',
    showAudio:false,
    src:'',
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  getMyAudio(){
    this.setData({
      showAudio:true
    })
    recorderManager.start(options)
  },
  stopAudio(){
    recorderManager.stop()
    recorderManager.onStop((res) => {
      console.log('recorder stop', res)
      innerAudioContext.src=res.tempFilePath
      
      this.setData({
        myAudio : res,
        hadAudio:true,
        showAudio:false
      })
      
      let _floder = this.getUserId();
      let _openid = wx.getStorageSync('userInfo')._openid;
      const cloudPath = 'kklist/' + _openid + '-' + _floder + '/' + _floder + res.tempFilePath.match(/\.[^.]+?$/)[0]
      wx.cloud.uploadFile({
        cloudPath: cloudPath,
        filePath: res.tempFilePath,
      }).then(res => {
        if (res.statusCode === 200) {
          
          console.log(res)
          let _userInfo = wx.getStorageSync('userInfo');
          let _obj = {
            audio: res.fileID,
            content:'',
            nickName: _userInfo.nickName,
            avatarUrl: _userInfo.avatarUrl,
            createTime: db.serverDate()
          }
          db.collection('kklist').add({
            data:_obj,
            success:(res)=>{
              console.log('加入成功',res);
            }
          })
        }
      })


    
    })
  },
  // 获取随机字符串
  getUserId() {
    let w = "abcdefghijklmnopqrstuvwxyz0123456789",
      firstW = w[parseInt(Math.random() * (w.length))];
    let userId = firstW + (Date.now()) + (Math.random() * 100000).toFixed(0)
    return userId;
  },
  audioPlay () {
    console.log(innerAudioContext)
    // innerAudioContext.autoplay = true
    innerAudioContext.play()
    innerAudioContext.onPlay(()=>{
      console.log('play')
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
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