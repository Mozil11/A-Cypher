// pages/components/menu.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    isPopping: false,//是否已经弹出
    animPlus: {},//旋转动画
    // animCollect: {},//item位移,透明度
    animTranspond: {},//item位移,透明度
    animInput: {},//item位移,透明度
    //内部属性 
    drag_style: {
      x: "250px",
      y: "480px"
    },
    preX: "",
    preY: "",
    screen: {
      width: "",
      height: ""
    },
    w: 50,
    h:50,
    type: "",
    dragx: "",
    dragy: ""
  },

  /**
   * 组件的方法列表
   */
  attached(){
    // 生命周期函数--监听页面加载
    this.pubMove = 0;
    // 生命周期函数--监听页面初次渲染完成
    var self = this;
    wx.getSystemInfo({
      success: function (res) {
        // 可使用窗口宽度、高度
        // console.log('height=' + res.windowHeight);
        // console.log('width=' + res.windowWidth);
        // Math.ceil()
        console.log(res)
        if (res.platform == "android") {
          res.windowHeight = res.screenHeight;
        }


        self.setData({
          screen: {
            width: res.windowWidth,
            height: res.windowHeight,
            pixelRatio: res.pixelRatio,
            ratio: res.windowWidth * res.pixelRatio / 750
          }
        })
      }
    })
  },
  
  methods: {
    //点击弹出
  plus () {
    console.log(this.data.isPopping)
    if (this.data.isPopping) {
      //缩回动画
      this.takeback();
      this.setData({
        isPopping: false
      })
    } else {
      //弹出动画
      this.popp();
      
      this.setData({
        isPopping: true
      })
    }
  },
  // 点击展开的单个按钮
  onItemTap(event) {
    var item = event.currentTarget.dataset.item;
    // 微信小程序中是通过triggerEvent来给父组件传递信息的
    //triggerEvent：https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/events.html
    var menuEventDetail = {
      item
    }
    this.triggerEvent('handleMenu', menuEventDetail)
    //menuEventOption是触发事件的选项，包括设置事件是否冒泡之类的，不过这里默认是不冒泡的
    // var menuEventOption = {
    //   
    // }
    // this.triggerEvent('handleMenu', menuEventDetail, menuEventOption)
  },
  // 内部方法建议以下划线开头
  //拖拽
  touchMoveChange(e) {
    if(!this.data.isPopping){

      if (this.pubMove >= 3) {
          this.pubMove = 0;
          // this.plus()
        } else {
          ++this.pubMove;
          return;
        }
  
      this.takeback();
      
      var _e$currentTarget = e.currentTarget,
        currentTarget = _e$currentTarget === undefined ? {} : _e$currentTarget;
      var _currentTarget$datase = currentTarget.dataset,
        dataset = _currentTarget$datase === undefined ? {} : _currentTarget$datase;
        
      var tmpx = parseInt(e.touches[0].clientX);
      var tmpy = parseInt(e.touches[0].clientY);
      if (tmpx <= 0 || tmpy <= 0 || tmpx >= this.data.screen.width || tmpy >= this.data.screen.height) {
        console.log('1',tmpx)
      } else {
        console.log('2',tmpx)
        if (tmpx != this.data.preX || tmpy != this.data.preY) {
          // console.log(e.touches[0].clientX, "-X-", e.touches[0].pageX)
          // console.log(e.touches[0].clientY, "-Y-", e.touches[0].pageY)
          this.data.preX = tmpx
          this.data.preY = tmpy
          this.setData({
            drag_style: {
              x: tmpx - this.data.w + "px",
              y: tmpy - this.data.h + "px",
            }
          })
        }
      }
    }
    // this.triggerEvent('touchMove', {});
  },
  input: function () {
    console.log("input")
    wx.navigateTo({ url: 'release/release' });
    
  },
  ref: function () {
    console.log("ref")
    this.triggerEvent('backTop', {})
  },
  collectAi: function () {
    console.log("collect")
    wx.navigateTo({ url: '../aip/aip' });
  },

  //弹出动画
  popp: function () {
    
    //plus顺时针旋转
    var animationPlus = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationcollect = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animRef = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationInput = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animAi = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var x = (typeof this.data.drag_style.x) == 'number' ? 0 :  this.data.drag_style.x.slice(0,-2);
    if (this.data.screen.width / 2 > x) {
      animationPlus.rotateZ(135).step();
      animAi.translate(-5, -70).rotateZ(360).opacity(1).step();
      // animationcollect.translate(40, 60).rotateZ(360).opacity(1).step();
      animationInput.translate(40, -50).rotateZ(360).opacity(1).step();
      animRef.translate(55, -5).rotateZ(360).opacity(1).step();
    } else {
      animationPlus.rotateZ(135).step();
      animAi.translate(-5, -70).rotateZ(360).opacity(1).step();
      // animationcollect.translate(-40, -60).rotateZ(180).opacity(1).step();
      animationInput.translate(-55, -55).rotateZ(360).opacity(1).step();
      animRef.translate(-70, -5).rotateZ(360).opacity(1).step();
    }
    this.setData({
      animPlus: animationPlus.export(),
      // animCollect: animationcollect.export(),
      animRef: animRef.export(),
      animInput: animationInput.export(),
      animAi: animAi.export()
    })
  },
  //收回动画
  takeback: function () {
    //plus逆时针旋转
    var animationPlus = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationcollect = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animRef = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationInput = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animAi = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    animationPlus.rotateZ(0).step();
    animAi.translate(0, 0).rotateZ(0).opacity(0).step();
    animationcollect.translate(0, 0).rotateZ(0).opacity(0).step();
    animRef.translate(0, 0).rotateZ(0).opacity(0).step();
    animationInput.translate(0, 0).rotateZ(0).opacity(0).step();
    this.setData({
      animPlus: animationPlus.export(),
      // animCollect: animationcollect.export(),
      animRef: animRef.export(),
      animInput: animationInput.export(),
      animAi: animAi.export(),
    })
  },

  }
})
