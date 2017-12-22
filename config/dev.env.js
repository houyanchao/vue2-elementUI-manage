var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"https://test.eweixue.com/"',  // 开发环境
  MAP_AK: '"3fb4de7e3e9ad59cc88520f3440e7515"' // 高德地图AK
})
