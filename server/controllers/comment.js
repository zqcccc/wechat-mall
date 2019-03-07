const DB = require('../utils/db.js')

module.exports = {
  add: async ctx => {
    let userinfo = ctx.state.$wxInfo.userinfo
    let { openId: user, nickName: username, avatarUrl: avatar } = userinfo

    let productId = + ctx.request.body.product_id
    let content = ctx.request.body.content || null

    let images = ctx.request.body.images || []
    images = images.join(';;')

    if(!isNaN(productId)) {
      try {
        await DB.query('INSERT INTO comment(user, username, avatar, content, images, product_id) VALUES (?, ?, ?, ?, ?, ?)', [user, username, avatar, content, images, productId])
      } catch (err) {
        console.log(err)
      }
    }

    ctx.state.data = {}
  },
  list: async ctx => {
    let productId = ctx.request.query.product_id

    if(!isNaN(productId)) {
      try {
        ctx.state.data = await DB.query('select * from comment where product_id = ?', [productId])
      } catch(err) {
        console.log(err)
      }
    } else {
      ctx.state.data = []
    }
  }
}