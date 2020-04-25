// pages/list/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentType: 0,
    typeList: [],
    booksList: [],
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getBookList()
    if (getApp().globalData.userInfo._id) {
      this.setData({ userInfo: getApp().globalData.userInfo })
    }
  },
  getTypeList () {
    wx.cloud.callFunction({
      name: "get_type_list",
      success: res => {
        console.log(res)
        let typeList = res.result.data.map(item => {
          return item.title
        })
        this.setData({ typeList: this.data.typeList.concat(typeList) })
        console.log(this.data.bookTypeList)
      },
      fail: err => {
        console.log(err)
      },
      complete: () => {
        wx.hideLoading()
      }
    })
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
  changeType (e) {
    let type = e.currentTarget.dataset.item
    console.log(e)
    this.setData({ currentType: type })
    this.getBookList()
  },
  toEditPage(e) {
    let id = e.currentTarget.id
    wx.navigateTo({
      url: '/pages/book/book_edit/index?id=' + id
    })
  },
  toAddPage () {
    wx.navigateTo({
      url: '/pages/book/book_edit/index'
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