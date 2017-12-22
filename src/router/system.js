const _import = require('./config/_import_' + process.env.NODE_ENV)
import Layout from '@/views/layout/Layout'

const router = [
    {
      path: '/ticket',
      component: Layout,
      redirect: 'noredirect',
      icon: 'system',
      name: '系统设置',
      children: [
        // { path: 'system-list', name: '分区管理', component: _import('system/list')},
        // { path: 'list', name: '学习卡列表', component: _import('ticket/ticketList'), hidden: true}
      ]
    }
]
export default router;
