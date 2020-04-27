// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
/*
  status: 1: 已提交 2.借阅中 3.归还中 4.已归还
 */
// 云函数入口函数
exports.main = async (event, context) => {
  let aBook = await db.collection('books').where({
    _id: event.bookId
  }).get()
  console.log(aBook)
  if (aBook.data && aBook.data.length > 0) {
    if (aBook.data[0].status == 1) {
      return {
        result: 0,
        msg: "此书已被借走"
      }
    } else {
      await db.collection('books').where({
        _id: event.bookId
      }).update({
        data: {
          status: 1
        }
      })
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
  } else {
    return {
      result: 0,
      msg: "找不到该书"
    }
  }
}