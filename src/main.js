import Vue from 'vue'
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-default/index.css'
import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
import locale from 'element-ui/lib/locale/lang/zh-CN'
import App from './App'
import Map from 'vue-amap';
import router from './router'
import copyClipboard from 'vue-clipboards'

import '@/utils'//公用方法、工具类
import '@/icons' // icon
import '@/utils/auth' //登录相关

// 虽然没用 有空研究下fetch（旧的框架中登录页面有fetch例子）
// import 'whatwg-fetch';
// import Es6Promise from 'es6-promise'
// Es6Promise.polyfill()

Vue.use(ElementUI, { locale })
Vue.use(Map);
Vue.use(copyClipboard)

Map.initAMapApiLoader({
  key: process.env.MAP_AK,
  plugin: ['Map.Autocomplete', 'Map.PlaceSearch', 'Map.Scale', 'Map.OverView', 'Map.ToolBar', 'Map.MapType', 'Map.PolyEditor', 'Map.CircleEditor', 'Geocoder']
});
Vue.config.productionTip = true

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
