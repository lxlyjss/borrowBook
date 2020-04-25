// miniprogram/pages/book/type_edit/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    title: "",
    typeList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTypeList()
  },
  getTypeList() {
    wx.cloud.callFunction({
      name: "get_type_list",
      success: res => {
        console.log(res)
        this.setData({ typeList: res.result.data })
        console.log(this.data.typeList)
      },
      fail: err => {
        console.log(err)
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },
  saveType () {
    if (!this.data.title) {
      return wx.showToast({
        title: '分类名不能为空',
        icon: "none"
      })
    }
    wx.cloud.callFunction({
      name: "save_type",
      data: {
        title: this.data.title,
        id: this.data.currentId
      },
      success: res => {
        console.log(res)
        this.hideShow()
        this.getTypeList()
      },
      fail: err => {
        console.log(err)
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },
  titleInput (e) {
    console.log(e)
    this.setData({
      title: e.detail.value
    })
  },
  openShow (e) {
    console.log(e)
    if (e.currentTarget.id) {
      console.log(e.currentTarget.id)
      this.setData({
        currentId: e.currentTarget.id,
        title: e.currentTarget.dataset.title
      })
    } else {
      this.setData({
        currentId: '',
        title: ''
      })
    }
    this.setData({
      show: true
    })
  },
  hideShow () {
    this.setData({
      show: false
    })
  }
})