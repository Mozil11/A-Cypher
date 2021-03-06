//删除帖子
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cypher-ckl74',     // 这里填写【环境ID】 而不是环境名
  traceUser: true,    // 是否在将用户访问记录到用户管理中，在控制台中可见
  
})

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    try{
      //找打kklist集，查到id,删除
      return await db.collection('kklist').doc(event._id).remove()
    }catch(e){
      console.error(e)
    }

}