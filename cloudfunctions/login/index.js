//登录
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cypher-ckl74',     // 这里填写【环境ID】 而不是环境名
  traceUser: true,    // 是否在将用户访问记录到用户管理中，在控制台中可见

})

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  console.log(context)
  // 可执行其他自定义逻辑
  // console.log 的内容可以在云开发云函数调用日志查看

  const wxContext = cloud.getWXContext()

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}