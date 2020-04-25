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
  getOrderList () {
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
  },
  deleteOrder (e) {
    wx.showModal({
      title: '提示',
      content: '是否删除此预约记录?',
      success: (res) => {
        if (res.confirm) {
          this.confirmDeleteOrder(e.currentTarget.id)
        }
      }
    })
  },
  confirmDeleteOrder (id) {
    wx.showLoading({
      title: '加载中...',
    })
    // 调用云函数
    wx.cloud.callFunction({
      name: "delete_order",
      data: {
        orderId: id
      },
      success: res => {
        console.log(res)
        wx.showToast({
          title: '删除成功',
        })
        this.getOrderList()
      },
      fail: err => {
        console.log(err)
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },
  receiveOrder (e) {
    let id = e.currentTarget.id
    this.changeOrderStatus(id, 2)
  },
  confirmOrder (e) {
    let id = e.currentTarget.id
    this.changeOrderStatus(id, 4)
  },
  changeOrderStatus (id, status) {
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
        this.getOrderList()
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