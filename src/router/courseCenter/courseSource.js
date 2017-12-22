const _import = require('../config/_import_' + process.env.NODE_ENV)
import Layout from '@/views/layout/Layout'

const router = [
    {
      path: '/courseSource',
      component: Layout,
      redirect: 'noredirect',
      icon: 'course',
      name: '课程库',
      children: [
        { path: 'list', name: '课程列表', component: _import('courseCenter/courseSource/list')},
        { path: 'create', name: '添加课程', component: _import('courseCenter/courseSource/create')},
        { path: 'edit', name: '编辑课程', component: _import('courseCenter/courseSource/create'), hidden: true}
      ]
    }
]
export default router;
