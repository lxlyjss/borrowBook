// miniprogram/pages/user/user_borrow/index.js
import { formatDate } from "../../../utils/utils.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    borrowList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(getApp().globalData.userInfo)
    if (getApp().globalData.userInfo._id) {
      this.getUserBorrowList()
    }
  },
  getUserBorrowList () {
    wx.showLoading({
      title: '加载中...',
    })
    // 调用云函数
    wx.cloud.callFunction({
      name: "get_user_borrow",
      data: {
        userId: getApp().globalData.userInfo._id
      },
      success: res => {
        console.log(res)
        res.result.data.forEach(item => {
          item.borrowTime = formatDate(item.borrowTime, 'yyyy年MM月dd日 hh:mm:ss')
          item.returnTime = formatDate(item.returnTime, 'yyyy年MM月dd日 hh:mm:ss')
        })
        this.setData({ borrowList: res.result.data })
      },
      fail: err => {
        console.log(err)
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },
  toBookBorrowPage (e) {
    let id = e.currentTarget.id
    wx.navigateTo({
      url: '/pages/book/book_borrow/index?id=' + id
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
    this.getUserBorrowList()
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