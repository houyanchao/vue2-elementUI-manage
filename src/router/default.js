const _import = require('./config/_import_' + process.env.NODE_ENV)
import Layout from '@/views/layout/Layout'

const router = [
  { path: '/login', name: '登录', component: _import('account/login') , hidden: true},
  { path: '/login-admin', name: '超级管理员登录', component: _import('account/loginAdmin') , hidden: true},
  { path: '/404', component: _import('404'), hidden: true },
  {
    path: '/password',
    component: Layout,
    redirect: '/password/update',
    hidden: true,
    children: [{ path: '/password/update', name: '修改密码', component: _import('account/updatePwd')}]
  },
  {
    path: '/message',
    component: Layout,
    redirect: '/message/list',
    hidden: true,
    children: [{ path: '/message/list', name: '站内信消息', component: _import('message/list')}]
  },
  {
    path: '',
    component: Layout,
    redirect: '/index',
    icon: 'index',
    noDropdown: true,
    children: [{ path: 'index', name: '首页', component: _import('index')}]
  },

  { path: '*', redirect: '/404', hidden: true ,name:'404'}
]
export default router;
