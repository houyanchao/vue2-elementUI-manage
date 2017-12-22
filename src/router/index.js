import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./config/_import_' + process.env.NODE_ENV)
import Layout from '@/views/layout/Layout'

let routes = [];
import routesDefault from "./default.js"
import couseCenter from "./courseCenter/index.js"
import ticket from "./ticket.js"
import system from "./system.js"
import finance from "./finance.js"
import customer from "./customer.js"

Vue.use(Router)

/**
* icon : 导航栏选项前面的图标
* hidden : 是否显示左侧导航栏
* redirect : 重定向
* noDropdown : 一个选项且可点击
**/

routes = routes.concat(routesDefault, couseCenter, ticket, finance, customer, system)

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ x:0, y: 0 }),
  routes: routes
})
