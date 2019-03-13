//index.js

Page({
  data: {
    id: "",
    name: "",
    gender: "",
    phone: "",
    avatar: "",
  },

  onLoad(options) {
    if (options.id) {
      this.data.id = options.id
      this.getUser()
    }
  },
  onNameChange(e) {
    this.setData({ name: e.detail.value })
  },
  onGenderChange(e) {
    this.setData({ gender: e.detail.value })
  },
  onPhoneChange(e) {
    this.setData({ phone: e.detail.value })
  },
  // 上传图片
  chooseImage() {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
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
            console.log('[上传文件] 成功：', res)
            this.setData({ avatar: res.fileID })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
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
  deleteImage () {
    this.setData({ avatar: '' })
  },
  submitData() {
    console.log(this.data.name, this.data.gender, this.data.phone, this.data.avatar)
    if (!this.data.name) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      })
      return
    }
    if (!this.data.gender) {
      wx.showToast({
        title: '请输入性别',
        icon: 'none'
      })
      return
    }
    if (!this.data.phone) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      return
    }
    if (!this.data.avatar) {
      wx.showToast({
        title: '请上传头像',
        icon: 'none'
      })
      return
    }
    const params = {
      id: this.data.id,
      name: this.data.name,
      gender: this.data.gender,
      phone: this.data.phone,
      avatar: this.data.avatar
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
      },
      fail: err => {
        console.log(err)
        wx.showToast({
          title: '保存失败',
          icon: 'none'
        })
      }
    })
  },
  getUser () {
    if (this.data.id) {
      wx.showLoading({
        title: '加载中...',
      })
      // 调用云函数
      wx.cloud.callFunction({
        name: "get_user",
        data: {
          id: this.data.id
        },
        success: res => {
          console.log(res)
          this.setData({
            id: res.result.data[0]._id,
            name: res.result.data[0].name,
            gender: res.result.data[0].gender,
            phone: res.result.data[0].phone,
            avatar: res.result.data[0].avatar
          })
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
