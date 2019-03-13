// pages/list/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentType: 0,
    typeList: [
      '全部',
      'python',
      'javascript',
      'php',
      '运维',
      '其他'
    ],
    booksList: []
  },
  changeType(e) {
    let type = e.currentTarget.dataset.item
    this.setData({ currentType: type })
    console.log(this.data.currentType)
    this.getBookList()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getBookList()
  },
  getBookList() {
    wx.showLoading({
      title: '加载中...',
    })
    let bookType = this.data.currentType == 0 ? "" : this.data.typeList[this.data.currentType]
    // 调用云函数
    wx.cloud.callFunction({
      name: "get_book",
      data: {
        bookType: bookType
      },
      success: res => {
        console.log(res)
        this.setData({ booksList: res.result.data })
        console.log(this.data.booksList)
      },
      fail: err => {
        console.log(err)
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },
  toAddPage(e) {
    let id = e.currentTarget.id
    wx.navigateTo({
      url: '/pages/edit_book/index?id=' + id
    })
  },
  toBorrowPage (e) {
    let id = e.currentTarget.id
    wx.navigateTo({
      url: '/pages/book/book_borrow/index?id=' + id,
    })
  },
  deleteBook(e) {
    wx.showModal({
      title: '提示',
      content: '删除后不可恢复, 是否删除此书籍?',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: '加载中...',
          })
          // 调用云函数
          wx.cloud.callFunction({
            name: "remove_book",
            data: {
              id: e.currentTarget.id
            },
            success: res => {
              console.log(res)
              wx.showToast({
                title: '删除成功',
              })
              this.getBookList()
            },
            fail: err => {
              console.log(err)
            },
            complete: () => {
              wx.hideLoading()
            }
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getBookList()
  }
})