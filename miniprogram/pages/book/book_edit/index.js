//index.js

Page({
  data: {
    bookId: "",
    bookName: "",
    bookType: "",
    bookPrice: "", 
    bookImg: "",
    bookIntro: "",
    bookTypeList: []
  },

  async onLoad(options) {
    await this.getTypeList()
    if (options.id) {
      this.data.bookId = options.id
      this.getBook()
      wx.setNavigationBarTitle({
        title: '编辑图书',
      })
    }
  },
  onShow() {
    this.getTypeList()
  },
  toTypeEditPage() {
    wx.navigateTo({
      url: "/pages/book/type_edit/index"
    })
  },
  getTypeList () {
    wx.cloud.callFunction({
      name: "get_type_list",
      success: res => {
        console.log(res)
        let typeList = res.result.data.map(item => {
          return item.title
        })
        this.setData({ bookTypeList: typeList })
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
  getBook () {
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
        let book = res.result.data[0]
        this.setData({ 
          bookName: book.bookName,
          bookType: String(this.data.bookTypeList.findIndex(item => item == book.bookType)),
          bookPrice: book.bookPrice,
          bookImg: book.bookImg,
          bookIntro: book.bookIntro
        })
        console.log(this.data.bookType)
      },
      fail: err => {
        console.log(err)
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },
  onBookNameChange(e) {
    this.setData({ bookName: e.detail.value })
  },
  onBookTypeChange(e) {
    console.log(e.detail.value)
    this.setData({ bookType: e.detail.value })
  },
  onBookPriceChange (e) {
    this.setData({ bookPrice: e.detail.value })
  },
  onBookIntroChange (e) {
    this.setData({ bookIntro: e.detail.value })
  },
  // 上传图片
  chooseImage() {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['camera'],
      success: (res) => {
        wx.showLoading({
          title: '上传中',
        })
        const filePath = res.tempFilePaths[0]
        // 上传图片
        const cloudPath = 'upload_img/' + new Date().getTime() + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传图片] 成功：', res)
            this.setData({ bookImg: res.fileID })
          },
          fail: e => {
            console.error('[上传图片] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })
      },
      fail: e => {
        console.error(e)
      }
    })
  },
  submitData() {
    console.log(this.data.bookName, this.data.bookType, this.data.bookNo, this.data.bookImg, this.data.bookIntro)
    if (!this.data.bookName) {
      wx.showToast({
        title: '请输入书名',
        icon: 'none'
      })
      return
    }
    if (!this.data.bookType) {
      wx.showToast({
        title: '请选择书类别',
        icon: 'none'
      })
      return
    }
    if (!this.data.bookPrice) {
      wx.showToast({
        title: '请输入书籍价格',
        icon: 'none'
      })
      return
    }
    if (!this.data.bookImg) {
      wx.showToast({
        title: '请上传书籍照片',
        icon: 'none'
      })
      return
    }
    const params = {
      id: this.data.bookId,
      bookName: this.data.bookName,
      bookType: this.data.bookTypeList[this.data.bookType],
      bookPrice: this.data.bookPrice,
      bookImg: this.data.bookImg,
      bookIntro: this.data.bookIntro
    }
    // 调用云函数
    wx.cloud.callFunction({
      name: "create_book",
      data: params,
      success: res => {
        console.log(res)
        wx.showToast({
          title: '保存成功',
        })
        wx.navigateBack({})
      },
      fail: err => {
        console.log(err)
        wx.showToast({
          title: '保存失败',
          icon: 'none'
        })
      }
    })
  }
})
