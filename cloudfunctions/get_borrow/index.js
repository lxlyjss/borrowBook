// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  if (event.bookId) {
    let list = []
    return await db.collection('borrow_info').where({
      bookId: event.bookId
    }).orderBy('createTime', 'desc').get()
  }
  if (event.userId) {
    return await db.collection('borrow_info').where({
      userId: event.userId
    }).orderBy('createTime', 'desc').get()
  }
}