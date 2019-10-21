// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cypher-ckl74',     // 这里填写【环境ID】 而不是环境名
  traceUser: true,  
})
const db = cloud.database()//数据库
// 云函数入口函数
exports.main = async (event, context) => {
  
  let a = db.collection('kklist').where({
    _id:event.createId
  }).update({
    data:{
      count:event.count
    }
  })
  return a;
}