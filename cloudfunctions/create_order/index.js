// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('order').add({
    data: {
      realname: event.realname,
      phone: event.phone,
      date: event.date,
      time: event.time,
      address: event.address,
      remark: event.remark,
      bookId: event.bookId,
      userId: event.userId
    }
  })
}