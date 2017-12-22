const _import = require('./config/_import_' + process.env.NODE_ENV)
import Layout from '@/views/layout/Layout'

const router = [
    {
      path: '/ticket',
      component: Layout,
      redirect: 'noredirect',
      icon: 'ticketcard',
      name: '学习卡',
      children: [
        { path: 'customer-list', name: '客户列表', component: _import('ticket/customerList')},
        { path: 'list', name: '学习卡列表', component: _import('ticket/ticketList'), hidden: true},
        { path: 'course-statistic', name: '参课统计', component: _import('ticket/courseStatistic'), hidden: true}
      ]
    }
]
export default router;
