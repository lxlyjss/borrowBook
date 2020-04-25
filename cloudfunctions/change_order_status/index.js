// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
/*
  status: 1: 已提交 2.借阅中 3.归还中 4.已归还
 */
// 云函数入口函数
exports.main = async (event, context) => {
  let order = await db.collection('order').where({
    _id: event.orderId
  }).update({
    data: {
      status: event.status
    }
  })
  return order
}