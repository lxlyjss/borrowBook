// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  if (event.id) {
    let order = await db.collection('order').where({
      _id: event.id
    }).get()
    let book = {}
    let user = {}
    if (order[0].bookId) {
      book = await db.collection('books').where({
        _id: order[0].bookId
      }).get()
    }
    if (order[0].userId) {
      user = await db.collection('users').where({
        _id: order[0].userId
      }).get()
    }
    order.book = book
    order.user = user
    return order
  } else {
    let order = await db.collection('order').get()
    let count = await db.collection('order').count()
    let list = []
    let orderList = order.data
    async function getTest () {
      for (let i = 0, len = orderList.length; i < len; i++) {
        let book = await db.collection('books').where({
          _id: orderList[i].bookId
        }).get()
        orderList[i].book = book.data[0]
        let user = await db.collection('users').where({
          _id: orderList[i].userId
        }).get()
        orderList[i].user = user.data[0]
        list.push(orderList[i])
      }
    }
    await getTest()
    return {
      list,
      count: count.total
    }
  }
}