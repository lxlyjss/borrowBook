// miniprogram/pages/user/info/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    realname: "",
    phone: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      userInfo = JSON.parse(userInfo)
      this.setData({
        userInfo: userInfo,
        phone: userInfo.phone,
        realname: userInfo.realname
      })
    } else {
      wx.showToast({
        title: '请返回登录',
        icon: 'none'
      })
    }
  },
  onRealnameChange (e) {
    this.setData({
      realname: e.detail.value
    })
  },
  onPhoneChange (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  setMyInfo() {
    wx.showLoading({
      title: '加载中...',
    })
    let userInfo = this.data.userInfo
    let params = {
      id: userInfo._id,
      name: userInfo.nickName,
      gender: userInfo.gender,
      avatar: userInfo.avatarUrl,
      phone: this.data.phone,
      realname: this.data.realname
    }
    // 调用云函数
    wx.cloud.callFunction({
      name: "create_user",
      data: params,
      success: res => {
        console.log(res)
        wx.showToast({
          title: '保存成功',
        })
        let userInfo = this.data.userInfo
        userInfo.realname = this.data.realname
        userInfo.phone = this.data.phone
        this.setData({
          userInfo
        })
        wx.setStorageSync('userInfo', JSON.stringify(userInfo));
        wx.navigateBack({
          complete: (res) => {}
        })
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