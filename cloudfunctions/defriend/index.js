//拉黑
// 云函数入口文件
const cloud = require('wx-server-sdk')


cloud.init({
  env:'cypher-ckl74', // 这里填写【环境ID】 而不是环境名
  traceUser: true,    // 是否在将用户访问记录到用户管理中，在控制台中可见
})
const db = cloud.database()//数据库

// 云函数入口函数
exports.main = async (event, context) => {
  
  let obj = event._obj;
  obj.createTime = db.serverDate()//服务器响应的时间
  try{
    //找到defriend集，添加data
    return await db.collection('defriend').add({
      data:obj
    })
  }catch(e){
    console.error(e)
  }

}