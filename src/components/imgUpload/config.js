// 图片上传配置
const env = process.env.NODE_ENV

const upyun = {
  development: {
    api: 'http://v0.api.upyun.com/',
    bucket: 'weixue-hztbc',
    apiSecret: 'tbQ8Z1aoYwu5Kitxxzet6Wzqv0s=',
    domain: '//res.eweixue.com',
    'save-key-file': '/file/{filemd5}{.suffix}',
    'save-key': '/img/{filemd5}{.suffix}'
  },
  test: {
    api: 'http://v0.api.upyun.com/',
    bucket: 'weixue-hztbc',
    apiSecret: 'tbQ8Z1aoYwu5Kitxxzet6Wzqv0s=',
    domain: '//res.eweixue.com',
    'save-key-file': '/file/{filemd5}{.suffix}',
    'save-key': '/img/{filemd5}{.suffix}'
  },
  production: {
    api: 'http://v0.api.upyun.com/',
    bucket: 'weixue-hztbc',
    apiSecret: 'tbQ8Z1aoYwu5Kitxxzet6Wzqv0s=',
    domain: '//res.eweixue.com',
    'save-key-file': '/file/{filemd5}{.suffix}',
    'save-key': '/img/{filemd5}{.suffix}'
  }
}

module.exports = upyun[env]
