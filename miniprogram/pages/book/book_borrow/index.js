// miniprogram/pages/book/book_borrow/index.js
import { formatDate } from "../../../utils/utils.js";

// function formatDate(time) { 
//   var now = new Date(time)
//   var year=now.getFullYear();  //取得4位数的年份
//   var month=now.getMonth()+1;  //取得日期中的月份，其中0表示1月，11表示12月
//   var date=now.getDate();      //返回日期月份中的天数（1到31）
//   var hour=now.getHours();     //返回日期中的小时数（0到23）
//   var minute=now.getMinutes(); //返回日期中的分钟数（0到59）
//   var second=now.getSeconds(); //返回日期中的秒数（0到59）
//   return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second; 
//   }

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookId: "",
    bookInfo: {},
    scanBookNo: "",
    borrowList: [],
    borrowCount: 0,
    userInfo: {},
    canReturn: false,        //是否可以归还
    canBorrow: false, // 是否可借书
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
    this.getBorrowList()
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
    this.changeOrderStatus(this.data.borrowList[0]._id, 4)
  },
  changeOrderStatus (id, status) {
    console.log(id, status)
    wx.showLoading({
      title: '加载中...',
    })
    // 调用云函数
    wx.cloud.callFunction({
      name: "change_order",
      data: {
        orderId: id,
        status
      },
      success: res => {
        console.log(res)
        wx.showToast({
          title: '提交成功',
        })
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
  },
  getBorrowList () {
    wx.showLoading({
      title: '加载中...',
    })
    // 调用云函数
    wx.cloud.callFunction({
      name: "get_order_by_book_id",
      data: {
        bookId: this.data.bookId
      },
      success: res => {
        console.log(res)
        res.result.list.forEach(item => {
          item.dateTimeStr = formatDate(item.dateTime, "yyyy年MM月dd日 hh:mm")
          item.returnTimeStr = formatDate(item.returnTime, "yyyy年MM月dd日 hh:mm")
        })
        this.setData({ borrowList: res.result.list, borrowCount: res.result.count })
        // this.setCanReturn()
        this.setCanBorrow()
      },
      fail: err => {
        console.log(err)
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },
  connect(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  setCanBorrow () {
    this.setData({ 
      canReturn: false,
      canBorrow: false
    })
    if (this.data.borrowList.length == 0) {
      this.setData({ canBorrow: true })
      return;
    }
    let userInfo = this.data.borrowList[0].user
    let type = this.data.borrowList[0].status
    if (userInfo._id == getApp().globalData.userInfo._id) {
      if (type == 4) {
        this.setData({ canBorrow: true })
      }
      if (type == 3) {
        this.setData({ btnInfo: "我已申请还书" })
      }
      if (type == 1) {
        this.setData({ btnInfo: "我已申请借书" })
      }
      if (type == 2) {
        this.setData({ canReturn: true })
      }
    }
    if (userInfo._id != getApp().globalData.userInfo._id) {
      if (type == 2 || type == 1 || type == 3) {
        this.setData({ btnInfo: "已被别人借阅" })
      }
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