// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init()

const db = cloud.database()
/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 * 
 * event 参数包含小程序端调用传入的 data
 * 
 */
exports.main = (event, context) => {
  // const {
  //   OPENID,
  //   APPID,
  //   UNIONID,
  // } = cloud.getWXContext()
  // console.log('event:', event)
  // if (event.id) {
  //   return await db.collection('users').where({
  //     _id: event.id
  //   }).update({
  //     data: {
  //       name: event.name,
  //       gender: event.gender,
  //       phone: event.phone,
  //       avatar: event.avatar,
  //     }
  //   })
  // } else {
    return await db.collection('users').add({
      data: {
        name: event.name,
        gender: event.gender,
        phone: event.phone,
        avatar: event.avatar,
      }
    })
  // }
}
