// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
/*
  status: 1: 已提交 2.借阅中 3.归还中 4.已归还
 */
// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('order').add({
    data: {
      realname: event.realname,
      phone: event.phone,
      dateTime: new Date().getTime(),
      day: event.day,
      remark: event.remark || "",
      bookId: event.bookId,
      userId: event.userId,
      returnTime: "",
      status: 2
    }
  })
}