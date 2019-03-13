// pages/list/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    users: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
  },
  getList () {
    wx.showLoading({
      title: '加载中...',
    })
    // 调用云函数
    wx.cloud.callFunction({
      name: "get_user",
      data: {},
      success: res => {
        console.log(res)
        this.setData({ users: res.result.data })
        console.log(this.data.users)
      },
      fail: err => {
        console.log(err)
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },
  toAddPage (e) {
    let id = e.currentTarget.id
    wx.navigateTo({
      url: '/pages/edit_user/index?id=' + id
    })
  },
  deleteUser (e) {
    wx.showLoading({
      title: '加载中...',
    })
    // 调用云函数
    wx.cloud.callFunction({
      name: "remove_user",
      data: {
        id: e.currentTarget.id
      },
      success: res => {
        console.log(res)
        wx.showToast({
          title: '删除成功',
        })
        this.getList()
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getList()
  }
})