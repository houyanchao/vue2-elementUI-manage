const _import = require('../config/_import_' + process.env.NODE_ENV)
import Layout from '@/views/layout/Layout'

const router = [
    {
      path: '/open-course',
      component: Layout,
      redirect: 'noredirect',
      icon: 'opencourse',
      name: '公开课',
      children: [
        { path: 'list', name: '公开课列表', component: _import('courseCenter/openCourse/list')},
        { path: 'create', name: '添加公开课', component: _import('courseCenter/openCourse/create')},
        { path: 'edit', name: '编辑公开课', hidden:true, component: _import('courseCenter/openCourse/edit')},
        { path:'/attendance/:course_id/list', name: '课程考勤列表',hidden:true, component: _import('courseCenter/attendance/list')},
        // { path: 'test', name: '测试新增公开课', component: _import('courseCenter/openCourse/test')},
        { path: '/open-course/:course_id', name: '公开课详情', hidden: true, component: _import('courseCenter/openCourse/detail')},
        { path: '/practice/:course_id/list', name: '练习列表',hidden:true, component: _import('courseCenter/practice/list')},
        { path: '/practice/:course_id/create', name: '添加练习',hidden:true, component: _import('courseCenter/practice/create')},
        { path: '/practice/:course_id/edit', name: '编辑练习',hidden:true, component: _import('courseCenter/practice/create')},
        { path: '/practice/:course_id/score-list', name: '练习评分列表',hidden:true, component: _import('courseCenter/practice/scoreList')},
        { path: '/practice/:course_id/score-detail', name: '练习评分详情',hidden:true, component: _import('courseCenter/practice/scoreDetail')},
      ]
    },

]
export default router;
