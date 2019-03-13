// miniprogram/pages/user/user_center/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getCode()
    this.setUserInfo()
  },
  setUserInfo () {
    if (getApp().globalData.userInfo._id) {
      this.setData({ userInfo: getApp().globalData.userInfo })
    }
  },
  getUserInfo (e) {
    wx.showLoading({
      title: '加载中...',
    })
    wx.getUserInfo({
      success: (user) => {
        console.log(user)
        let userInfo = user.userInfo
        let params = {
          name: userInfo.nickName,
          gender: userInfo.gender,
          avatar: userInfo.avatarUrl
        }
        // 调用云函数
        wx.cloud.callFunction({
          name: "create_user",
          data: params,
          success: res => {
            console.log(res)
            wx.showToast({
              title: '登录成功',
            })
            this.data.userInfo._id = res.result.data.id
            this.getUserData()
          },
          fail: err => {
            console.log(err)
          },
          complete: () => {
            wx.hideLoading()
          }
        })
      }
    })
  },
  getUserData () {
    wx.showLoading({
      title: '加载中...',
    })
    // 调用云函数
    wx.cloud.callFunction({
      name: "get_user",
      data: {
        id: this.data.userInfo._id
      },
      success: res => {
        console.log(res)
        console.log(this.data.userInfo._id)
        this.setData({
          userInfo: res.result.data[0]
        })
        getApp().globalData.userInfo = this.data.userInfo
        wx.setStorageSync('userInfo', JSON.stringify(this.data.userInfo))
      },
      fail: err => {
        console.log(err)
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },
  toBookListPage () {
    wx.navigateTo({
      url: '/pages/book/book_list/index',
    })
  },
  toMyBorrowPage () {
    wx.navigateTo({
      url: '/pages/user/user_borrow/index',
    })
  },
  toUserListPage () {
    wx.navigateTo({
      url: '/pages/user_list/index',
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