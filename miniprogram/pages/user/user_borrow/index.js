// miniprogram/pages/user/borrow_list/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderCount: 0,
    orderList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOrderList()
  },
  getOrderList() {
    wx.showLoading({
      title: '加载中...',
    })
    // 调用云函数
    wx.cloud.callFunction({
      name: "get_order",
      success: res => {
        console.log(res)
        this.setData({
          orderCount: res.result.count,
          orderList: res.result.list
        })
        // console.log(this.data.orderList)
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