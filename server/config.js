const CONF = {
    port: '5757',
    rootPathname: '',

    // 微信小程序 App ID
    appId: 'wx14ec644ceef0d0d3',

    // 微信小程序 App Secret
    appSecret: '53cedfb4f9e8034527202e03f45201a7',

    // 是否使用腾讯云代理登录小程序
    useQcloudLogin: false,
    qcloudAppId: 1252712273,
    qcloudSecretId: 'AKIDFJh3JOH3x1vcCbQxtALK8lIepoU5jjmh',
    qcloudSecretKey: 'vfEGCxXxHTUKk9ORK0VqdSaZN1NYxEPj',

    /**
     * MySQL 配置，用来存储 session 和用户信息
     * 若使用了腾讯云微信小程序解决方案
     * 开发环境下，MySQL 的初始密码为您的微信小程序 appid
     */
    mysql: {
        host: 'localhost',
        port: 3306,
        user: 'root',
        db: 'cAuth',
        pass: 'wx14ec644ceef0d0d3',
        char: 'utf8mb4'
    },

    cos: {
        /**
         * 地区简称
         * @查看 https://cloud.tencent.com/document/product/436/6224
         */
      region: 'ap-guangzhou',
        // Bucket 名称
        fileBucket: 'wechat-mall',
        // 文件夹
        uploadFolder: 'commentsImg'
    },

    // 微信登录态有效期
    wxLoginExpires: 7200,
    wxMessageToken: 'abcdefgh'
}

module.exports = CONF
