// miniprogram/pages/book/submit_borrow/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookId: '',
    bookInfo: {},
    bookName: '',
    realname: '',
    phone: '',
    date: '',
    day: '',
    time: '',
    address: '',
    ramark: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.bookId) {
      this.data.bookId = options.bookId
      this.getBook()
    } else {
      setTimeout(() => {
        wx.navigateBack({})
      }, 1000)
      wx.showToast({
        title: '没有bookId'
      })      
    }
  },
  onRealnameChange(e) {
    console.log(e.detail.value)
    this.setData({ realname: e.detail.value })
  },
  onDateChange (e) {
    console.log(e.detail.value)
    this.setData({ date: e.detail.value })
  },
  onTimeChange(e) {
    console.log(e.detail.value)
    this.setData({ time: e.detail.value })
  },
  onDayChange (e) {
    this.setData({ day: e.detail.value })
  },
  onAddressChange (e) {
    console.log(e.detail.value)
    this.setData({ address: e.detail.value })
  },
  onPhoneChange (e) {
    console.log(e.detail.value)
    this.setData({ phone: e.detail.value })
  },
  onRemarkChange(e) {
    console.log(e.detail.value)
    this.setData({ remark: e.detail.value })
  },
  submitData() {
    if (!this.data.realname) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      })
      return
    }
    if (!this.data.phone) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      return
    }
    if (!this.data.date) {
      wx.showToast({
        title: '请选择日期',
        icon: 'none'
      })
      return
    }
    if (!this.data.time) {
      wx.showToast({
        title: '请选择时间',
        icon: 'none'
      })
      return
    }
    if (!this.data.day) {
      wx.showToast({
        title: '请输入借阅的天数',
        icon: 'none'
      })
      return
    }
    if (!this.data.address) {
      wx.showToast({
        title: '请选择地点',
        icon: 'none'
      })
      return
    }
    const params = {
      realname: this.data.realname,
      phone: this.data.phone,
      date: this.data.date,
      time: this.data.time,
      day: this.data.day,
      address: this.data.address,
      remark: this.data.remark,
      userId: getApp().globalData.userInfo._id,
      bookId: this.data.bookId
    }
    // 调用云函数
    wx.cloud.callFunction({
      name: "create_order",
      data: params,
      success: res => {
        console.log(res)
        setTimeout(() => {
          wx.showToast({
            title: '提交预约成功',
          })
        }, 600)
        wx.navigateBack({})
      },
      fail: err => {
        console.log(err)
        wx.showToast({
          title: '提交预约失败',
          icon: 'none'
        })
      }
    })
  },
  getBook() {
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