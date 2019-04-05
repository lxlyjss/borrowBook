// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  if (event.id) {
    return await db.collection('books').where({
      _id: event.id
    }).update({
      data: {
        bookName: event.bookName,
        bookType: event.bookType,
        bookNo: event.bookNo,
        bookImg: event.bookImg,
        bookIntro: event.bookIntro
      }
    })
  } else {
    return await db.collection('books').add({
      data: {
        bookName: event.bookName,
        bookType: event.bookType,
        bookNo: event.bookNo,
        bookImg: event.bookImg,
        bookIntro: event.bookIntro,
        status: 0
      }
    })
  }
}