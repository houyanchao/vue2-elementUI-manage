const _import = require('../config/_import_' + process.env.NODE_ENV)
import Layout from '@/views/layout/Layout'

const router = [
    {
      path: '/teacher',
      component: Layout,
      redirect: 'noredirect',
      icon: 'teacher',
      name: '讲师库',
      children: [
        { path: 'list', name: '讲师库列表', component: _import('courseCenter/teacher/list')}
      ]
    }
]
export default router;
