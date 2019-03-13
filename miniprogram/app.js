//app.js
App({
  onLaunch: function () {
    wx.cloud.init()
    this.getUserInfo()
  },
  globalData: {
    userInfo: {}
  },
  getUserInfo () {
    let userInfo = wx.getStorageSync('userInfo')
    console.log(userInfo)
    if (userInfo) {
      userInfo = JSON.parse(userInfo)
      this.globalData.userInfo = userInfo
    }
  }
})
