// pages/components/dianzan/dianzan.js
const db = wx.cloud.database();
const _ = db.command;
const _dbc = 'feelgood'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    openId:String,
    createId:String
  },

  /**
   * 组件的初始数据
   */
  data: {
    isDianzan:false,
    animateDian:{},//动画
    unAnimateDian:{},
    img:'../../../images/common/dianzan.png',
    imag:'../../../images/common/dianzan2.png'
  },
  attached () {
    console.log(this.properties.openId)
    this.getgood()
   },
   pageLifetimes:{

     show(){
      this.getgood()
     },
   },
  /**
   * 组件的方法列表
   */
  methods: {
    //查询是否点赞
    getgood(){
      var that = this
      wx.cloud.callFunction({
        name:'feelgood',
        data:{
          _myid:that.properties.createId,
          myopenId:that.properties.myopenId
        }
      }).then(res=>{
        // console.log("查看",res)
        if(res.result.data.length==0){
          that.setData({
            isDianzan:false
          })
        }
        if(res.result.data.length>0){
          that.setData({
            isDianzan:true
          })
        }
      }).catch(e=>{
        console.log(e)
      })
    },
    //点赞添加数据
    tapanimate(){
      var that = this;
      console.log(1)
      var animateDian = wx.createAnimation({
        duration: 500,
        timingFunction: 'linear',
        
      })
      var unAnimateDian = wx.createAnimation({
        duration: 500,
        timingFunction: 'linear',
        
      })
      unAnimateDian.scale(1,1).opacity(1).step()
      animateDian.scale(1.5,1.5).opacity(0).step()
      this.setData({
        unAnimateDian:unAnimateDian.export(),
        animateDian:animateDian.export(),
        
      })
      setTimeout(()=>{
        this.setData({
          isDianzan:true
        })
      },400)
      db.collection('feelgood').add({
        data:{
          _myid:that.properties.createId,
          myopenId:that.properties.myopenId
        },
        success:(res)=>{
          console.log(res)
        }
      })
    },
    //取消点赞删除数据
    untap(){
      var that = this;
      console.log(2)
      var animateDian = wx.createAnimation({
        duration: 500,
        timingFunction: 'linear',
        
      })
      var unAnimateDian = wx.createAnimation({
        duration: 500,
        timingFunction: 'linear',
        
      })
      animateDian.scale(1,1).opacity(1).step()
      unAnimateDian.scale(1.5,1.5).opacity(0).step()
      this.setData({
        animateDian:animateDian.export(),
        unAnimateDian:unAnimateDian.export(),
        
      })
      setTimeout(()=>{
        this.setData({
          isDianzan:false
        })
      },400)
      wx.cloud.callFunction({
        name:'deletgood',
        data:{
          _myid:that.properties.createId,
          myopenId:that.properties.myopenId
        }
      }).then(res=>{
        console.log(res)
      })
    }
  }
})
