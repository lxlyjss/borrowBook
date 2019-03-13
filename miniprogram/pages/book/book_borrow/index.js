// miniprogram/pages/book/book_borrow/index.js
import { formatDate } from "../../../utils/utils.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookId: "",
    bookInfo: {},
    scanBookNo: "",
    borrowList: [],
    canReturn: false,        //是否可以归还
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      this.data.bookId = options.id
      this.getBook()
      this.getBorrowList()
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  getBook () {
    wx.showLoading({
      title: '加载中...',
    })
    // 调用云函数
    wx.cloud.callFunction({
      name: "get_book",
      data: {
        id: this.data.bookId
      },
      success: res => {
        console.log(res)
        this.setData({ bookInfo: res.result.data[0] })
      },
      fail: err => {
        console.log(err)
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },
  confirmBorrow () {
    console.log(getApp().globalData.userInfo)
    if (!getApp().globalData.userInfo.openid) {
      wx.showToast({
        title: '请先登录, 谢谢!',
        icon: 'none'
      })
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/user/user_center/index'
        })
      }, 1500)
      return
    }
    wx.showModal({
      title: '温馨提示',
      content: '请扫描书后底部的条形码, 点击确定开始扫描.',
      success: (res) => {
        if (res.confirm) {
          wx.scanCode({
            onlyFromCamera: true,
            scanType: ['barCode'],
            success: (e) => {
              console.log(e.result)
              this.setData({ scanBookNo: e.result })
              this.checkCode(1)
            }
          })
        }
      }
    })
  },
  confirmReturn () {
    wx.showModal({
      title: '温馨提示',
      content: '请扫描书后底部的条形码, 点击确定开始扫描.',
      success: (res) => {
        if (res.confirm) {
          wx.scanCode({
            onlyFromCamera: true,
            scanType: ['barCode'],
            success: (e) => {
              console.log(e.result)
              this.setData({ scanBookNo: e.result })
              this.checkCode(2)
            }
          })
        }
      }
    })
  },
  checkCode (type) {
    wx.showLoading({
      title: '请稍候...',
    })
    if (this.data.bookInfo.bookNo != this.data.scanBookNo) {
      wx.showToast({
        title: '抱歉, 扫描的条形码编号与本书编号不一致, 请重新扫描',
        duration: 3000,
        icon: 'none'
      })
    } else {
      let params = {
        bookId: this.data.bookId,
        userId: getApp().globalData.userInfo._id,
        type: type
      }
      wx.cloud.callFunction({
        name: "create_borrow",
        data: params,
        success: res => {
          console.log(res)
          if (type == 1) {
            wx.showModal({
              title: '温馨提示',
              content: '恭喜你借书成功, 记得及时归还哦~',
              showCancel: false
            })
          } else {
            wx.showModal({
              title: '温馨提示',
              content: '恭喜你还书成功, 继续保持良好的借还习惯哦~',
              showCancel: false
            })
          }
          this.getBook()
          this.getBorrowList()
        },
        fail: err => {
          console.log(err)
        },
        complete: () => {
          wx.hideLoading()
        }
      })
    }
  },
  getBorrowList () {
    wx.showLoading({
      title: '加载中...',
    })
    // 调用云函数
    wx.cloud.callFunction({
      name: "get_borrow",
      data: {
        bookId: this.data.bookId
      },
      success: res => {
        console.log(res)
        res.result.data.forEach(item => {
          item.createTime = formatDate(item.createTime, 'yyyy年MM月dd日 hh:mm:ss')
        })
        this.setData({ borrowList: res.result.data })
        this.setCanReturn()
      },
      fail: err => {
        console.log(err)
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },
  setCanReturn () {
    if (this.data.borrowList.length == 0) return
    let userInfo = this.data.borrowList[0].userInfo
    let type = this.data.borrowList[0].type
    if (userInfo._id == getApp().globalData.userInfo._id && type == 1) {
      this.setData({ canReturn: true })
    } else {
      this.setData({ canReturn: false })
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})