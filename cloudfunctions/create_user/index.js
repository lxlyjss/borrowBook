// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  if (event.id) {
    return await db.collection('users').where({
      _id: event.id
    }).update({
      data: {
        name: event.name,
        gender: event.gender,
        phone: event.phone,
        avatar: event.avatar,
      }
    })
  } else {
    let hasUser = await db.collection('users').where({
      openid: OPENID
    }).get()
    console.log(hasUser)
    if (hasUser.data.length > 0) {
      await db.collection('users').where({
        openid: OPENID
      }).update({
        data: {
          name: event.name,
          gender: event.gender,
          phone: event.phone,
          avatar: event.avatar
        }
      })
      return {
        code: 200,
        data: {
          id: hasUser.data[0]._id,
          type: 'update'
        },
        msg: 'success'
      }
    } else {
      let user = await db.collection('users').add({
        data: {
          name: event.name,
          gender: event.gender,
          phone: event.phone,
          avatar: event.avatar,
          openid: OPENID,
          role: 2
        }
      })
      return {
        code: 200,
        data: {
          id: user._id,
          type: 'create'
        },
        msg: 'success'
      }
    }
  }
}