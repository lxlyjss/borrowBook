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
    userInfo: {},
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
    let userInfo = wx.getStorageSync('userInfo');
    console.log(userInfo)
    if (userInfo) {
      this.setData({
        userInfo: JSON.parse(userInfo)
      })
    }
  },
  goLogin () {
    wx.switchTab({
      url: '/pages/user/user_center/index',
    })
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
    wx.navigateTo({
      url: '/pages/book/submit_borrow/index?bookId=' + this.data.bookId,
    })
  },
  confirmReturn () {
    this.changeOrderStatus(this.data.borrowList[0]._id, 3)
  },
  changeOrderStatus (id, status) {
    console.log(id, status)
    wx.showLoading({
      title: '加载中...',
    })
    // 调用云函数
    wx.cloud.callFunction({
      name: "change_order_status",
      data: {
        orderId: id,
        status
      },
      success: res => {
        console.log(res)
        wx.showToast({
          title: '提交成功',
        })
        this.getBorrowList()
      },
      fail: err => {
        console.log(err)
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },
  getBorrowList () {
    wx.showLoading({
      title: '加载中...',
    })
    // 调用云函数
    wx.cloud.callFunction({
      name: "get_order",
      data: {
        bookId: this.data.bookId
      },
      success: res => {
        console.log(res)
        res.result.list.forEach(item => {
          item.createTime = formatDate(item.createTime, 'yyyy年MM月dd日 hh:mm:ss')
        })
        this.setData({ borrowList: res.result.list })
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
    let userInfo = this.data.borrowList[0].user
    let type = this.data.borrowList[0].status
    if (userInfo._id == getApp().globalData.userInfo._id && type == 2) {
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