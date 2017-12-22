const _import = require('./config/_import_' + process.env.NODE_ENV)
import Layout from '@/views/layout/Layout'

const router = [
    {
      path: '/customer',
      component: Layout,
      redirect: 'noredirect',
      icon: 'ticketcard',
      name: '客户管理',
      children: [
        { path: 'enterprise/list', name: '购课企业列表', component: _import('customer/enterpriseList')},
        { path: 'user/list', name: '购课用户列表', component: _import('customer/userList')},
      ]
    }
]
export default router;
