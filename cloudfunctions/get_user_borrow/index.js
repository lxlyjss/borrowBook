// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  if (event.userId) {
    let list = []
    return await db.collection('user_borrow').where({
      'userInfo._id': event.userId
    }).orderBy('borrowTime', 'desc').get()
  }
}