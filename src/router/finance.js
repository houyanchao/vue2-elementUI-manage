const _import = require('./config/_import_' + process.env.NODE_ENV)
import Layout from '@/views/layout/Layout'

const router = [
    {
      path: '/finance',
      component: Layout,
      redirect: 'noredirect',
      icon: 'ticketcard',
      name: '财务管理',
      children: [
        { path: 'list', name: '现金管理', component: _import('finance/list')}
      ]
    }
]
export default router;
