// pages/order/order.js
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    locationAuthType: app.data.locationAuthType,
    orderList: [
      // {
      //   id: 0,
      //   list: [{
      //     count: 1,
      //     image: 'https://wechat-mall-1252712273.cos.ap-guangzhou.myqcloud.com/product7.jpg',
      //     name: '果蔬大礼包',
      //     price: 158,
      //   }]
      // },
      // {
      //   id: 1,
      //   list: [{
      //     count: 1,
      //     image: 'https://wechat-mall-1252712273.cos.ap-guangzhou.myqcloud.com/product7.jpg',
      //     name: '果蔬大礼包',
      //     price: 158,
      //   },
      //   {
      //     count: 1,
      //     image: 'https://wechat-mall-1252712273.cos.ap-guangzhou.myqcloud.com/product9.jpg',
      //     name: '风驰电掣小摩托',
      //     price: 249,
      //   }
      //   ]
      // },
      // {
      //   id: 2,
      //   list: [{
      //     count: 1,
      //     image: 'https://wechat-mall-1252712273.cos.ap-guangzhou.myqcloud.com/product14.jpg',
      //     name: '金刚轱辘圈',
      //     price: 34,
      //   }]
      // }
    ], // 订单列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onTapLogin: function () {
    app.login({
      success: ({ userInfo }) => {
        this.setData({
          userInfo,
          locationAuthType: app.data.locationAuthType
        })
        this.getOrder()
      },
      error: () => {
        this.setData({
          locationAuthType: app.data.locationAuthType
        })
      }
    })

  },

  getOrder() {
    wx.showLoading({
      title: '刷新订单数据...',
    })

    qcloud.request({
      url: config.service.orderList,
      login: true,
      success: result => {
        console.log("123");
        wx.hideLoading()

        let data = result.data
        console.log(data)
        if (!data.code) {
          this.setData({
            orderList: data.data
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '刷新订单数据失败',
          })
        }
      },
      fail: () => {
        wx.hideLoading()

        wx.showToast({
          icon: 'none',
          title: '刷新订单数据失败',
        })
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
    // 同步授权状态
    this.setData({
      locationAuthType: app.data.locationAuthType
    })
    app.checkSession({
      success: ({ userInfo }) => {
        this.setData({
          userInfo
        })
        this.getOrder()
      }
    })
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