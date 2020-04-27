// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
/*
  status: 1: 已提交 2.借阅中 3.归还中 4.已归还
 */
// 云函数入口函数
exports.main = async (event, context) => {
  await db.collection('books').where({
    _id: event.bookId
  }).update({
    data: {
      status: 0
    }
  })
  let order = await db.collection('order').where({
    _id: event.orderId
  }).update({
    data: {
      status: 4,
      returnTime: new Date().getTime()
    }
  })
  return order;
}