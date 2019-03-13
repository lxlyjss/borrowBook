// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  if (!event.userId || !event.bookId || !event.type) {
    return {
      code: 400,
      msg: 'params loss!'
    }
  }
  let nowTime = new Date().getTime()
  let userInfo = await db.collection('users').doc(event.userId).get()
  let bookInfo = await db.collection('books').doc(event.bookId).get()
  if (bookInfo.data.status == 1 && event.type == 1) {
    return {
      code: 400,
      msg: '此书已被别人借走'
    }
  }
  if (bookInfo.data.status == 0 && event.type == 2) {
    return {
      code: 400,
      msg: '此书已归还,不需要再次归还'
    }
  }
  let borrowInfo = await db.collection('borrow_info').add({
    data: {
      userId: event.userId,
      bookId: event.bookId,
      userInfo: userInfo.data,
      bookInfo: bookInfo.data,
      createTime: nowTime,
      type: event.type
    }
  })
  console.log('borrowInfo:', borrowInfo)
  let type = event.type
  if (type == 1) {
    await db.collection('books').where({
      _id: event.bookId
    }).update({
      data: {
        status: 1
      }
    })
    await db.collection('user_borrow').add({
      data: {
        status: 0,
        borrowTime: nowTime,
        returnTime: "",
        userInfo: userInfo.data,
        bookInfo: bookInfo.data
      }
    })
  } else if (type == 2) {
    await db.collection('books').where({
      _id: event.bookId
    }).update({
      data: {
        status: 0
      }
    })
    let log = await db.collection('user_borrow').where({
      'userInfo._id': event.userId,
      'bookInfo._id': event.bookId,
      status: 0
    }).update({
      data: {
        status: 1,
        returnTime: nowTime
      }
    })
    console.log('ddd:',log)
  }
  return {
    code: 200,
    data: {
      id: borrowInfo._id
    },
    msg: 'success'
  }
}