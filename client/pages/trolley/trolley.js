// pages/trolley/trolley.js
const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    locationAuthType: app.data.locationAuthType,
    trolleyList: [], // 购物车商品列表
    trolleyCheckMap: [], // 购物车中选中的id哈希表
    trolleyAccount: 0, // 购物车结算总价
    isTrolleyEdit: false, // 购物车是否处于编辑状态
    isTrolleyTotalCheck: false, // 购物车中商品是否全选
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  

  onTapLogin: function() {
    app.login({
      success: ({
        userInfo
      }) => {
        this.setData({
          userInfo,
          locationAuthType: app.data.locationAuthType
        })

        this.getTrolley()
      },
      error: () => {
        this.setData({
          locationAuthType: app.data.locationAuthType
        })
      }
    })
  },

  onTapEditTrolley() {
    let isTrolleyEdit = this.data.isTrolleyEdit

    if (isTrolleyEdit) {
      this.updateTrolley()
    } else {
      this.setData({
        isTrolleyEdit: !isTrolleyEdit
      })
    }
  },

  getTrolley() {
    wx.showLoading({
      title: '刷新购物车数据',
    })

    qcloud.request({
      url: config.service.trolleyList,
      login: true,
      success: res => {
        wx.hideLoading()

        let data = res.data
        if (!data.code) {
          this.setData({
            trolleyList: data.data
          })
        } else {
          wx.showToast({
            title: '数据刷新失败',
            icon: 'none'
          })
        }
      },
      fail: res => {
        wx.hideLoading()

        wx.showToast({
          title: '数据刷新失败',
          icon: 'none'
        })
      }
    })
  },

  onTapCheckSingle(event) {
    let checkId = event.currentTarget.dataset.id
    let trolleyCheckMap = this.data.trolleyCheckMap
    let trolleyList = this.data.trolleyList
    let isTrolleyTotalCheck = this.data.isTrolleyTotalCheck
    let numTotalProduct
    let numCheckedProduct = 0

    trolleyCheckMap[checkId] = !trolleyCheckMap[checkId]

    numTotalProduct = trolleyList.length
    trolleyCheckMap.forEach(checked => {
      numCheckedProduct = checked ? numCheckedProduct + 1 : numCheckedProduct
    })

    isTrolleyTotalCheck = (numTotalProduct === numCheckedProduct) ? true : false

    let trolleyAccount = this.count(trolleyList, trolleyCheckMap)
    this.setData({
      trolleyCheckMap,
      isTrolleyTotalCheck,
      trolleyAccount
    })
  },

  onTapCheckTotal() {
    let trolleyCheckMap = this.data.trolleyCheckMap
    let trolleyList = this.data.trolleyList
    let isTrolleyTotalCheck = this.data.isTrolleyTotalCheck

    isTrolleyTotalCheck = !isTrolleyTotalCheck

    trolleyList.forEach(product => {
      trolleyCheckMap[product.id] = isTrolleyTotalCheck
    })

    let trolleyAccount = this.count(trolleyList, trolleyCheckMap)
    this.setData({
      isTrolleyTotalCheck,
      trolleyCheckMap,
      trolleyAccount
    })
  },

  count(trolleyList, trolleyCheckMap) {
    let cost = 0

    trolleyList.forEach(product => {
      cost = trolleyCheckMap[product.id] ? cost + product.price * product.count : cost
    })

    return cost
  },

  adjustTrolleyProductCount(event) {
    let trolleyCheckMap = this.data.trolleyCheckMap
    let trolleyList = this.data.trolleyList
    let dataset = event.currentTarget.dataset
    let adjustType = dataset.type
    let productId = dataset.id
    let product
    let index

    for (index = 0; index < trolleyList.length; index++) {
      if (productId === trolleyList[index].id) {
        product = trolleyList[index]
        break
      }
    }

    if (product) {
      if (adjustType === 'add') {
        product.count++
      } else {
        if (product.count <= 1) {
          delete trolleyCheckMap[productId]
          trolleyList.splice(index, 1)
        } else {
          product.count--
        }
      }
    }

    let trolleyAccount = this.count(trolleyList, trolleyCheckMap)
    this.setData({
      trolleyAccount,
      trolleyList,
      trolleyCheckMap
    })
  },

  updateTrolley() {
    wx.showLoading({
      title: '更新购物车数据...',
    })

    let trolleyList = this.data.trolleyList

    qcloud.request({
      url: config.service.updateTrolley,
      login: true,
      method: 'POST',
      data: {
        list: trolleyList
      },
      success: res => {
        wx.hideLoading()
        let data = res.data

        if (!data.code) {
          this.setData({
            isTrolleyEdit: false
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '更新购物车失败'
          })
        }
      },
      fail: () => {
        wx.hideLoading()

        wx.showToast({
          icon: 'none',
          title: '更新购物车失败'
        })
      }
    })
  },

  onTapPay() {
    if (!this.data.trolleyAccount) return

    wx.showLoading({
      title: '结算中',
    })

    let trolleyCheckMap = this.data.trolleyCheckMap
    let trolleyList = this.data.trolleyList

    let needToPayProductList = trolleyList.filter(product => {
      return !!trolleyCheckMap[product.id]
    })

    qcloud.request({
      url: config.service.addOrder,
      login: true,
      method: 'POST',
      data: {
        list: needToPayProductList
      },
      success: res => {
        wx.hideLoading()

        let data = res.data
        if (!data.code) {
          wx.showToast({
            title: '结算成功',
          })
        } else {
          wx.showToast({
            title: '结算失败',
            icon: 'none',
          })
        }
      },
      fail: () => {
        wx.showToast({
          title: '结算失败',
          icon: 'none',
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 同步授权状态
    this.setData({
      locationAuthType: app.data.locationAuthType
    })
    app.checkSession({
      success: ({
        userInfo
      }) => {
        this.setData({
          userInfo
        })

        this.getTrolley()
        console.log(this.data)
        this.checkPageData()
      }
    })
  },

  checkPageData() { // 从其它页面添加商品到购物车后，改变全选态
    let trolleyList = this.data.trolleyList
    let trolleyCheckMap = this.data.trolleyCheckMap
    let isTrolleyTotalCheck = false
    if(!trolleyList.length) {
      return this.setData({
        isTrolleyTotalCheck
      })
    }
    trolleyList.every(product => {
      return !!trolleyCheckMap[product.id]
    })

    this.setData({
      isTrolleyTotalCheck
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})