const apiUrls = {
  'teacherList': 'v1/agency/teacher/list',              // 讲师库列表
  'courseList': 'v1/agency/course_source/list',         // 课程库列表
  'createOpenCourse': 'v1/agency/open_course/create',   // 创建公开课
  'saveOpenCourse': 'v1/agency/open_course/create_schedule',  // 保存为计划开课
  'getOpenCourseDetail': 'v1/agency/open_course/get',   // 获取公开课详情
  'getCourseInfo': 'v1/agency/course_source/get',       // 获取课程庫详情
  'updateOpenCourse': 'v1/agency/open_course/update',   // 編輯公開課
  'getCourseCategory': 'v1/course/getCategory',         // 获取课程分类
}

export default {
  getTeacherList: (params, success, error) => {
    __request.get({
      url: apiUrls.teacherList,
      params: params,
      needAuth: true,
      success: (res) => {
        if (typeof success === 'function') {
          success(res.data)
        }
      },
      error: (res) => {
        if (typeof error === 'function') {
          error(res)
        }
      }
    })
  },
  /*
  *  name 非必填 课程名称
  *  teacher_name 非必填 讲师姓名
  *  parent_category_id 非必填 一级分类
  *  child_category_id 非必填  二级分类
  *  tags_1 非必填 行业
  *  tags_2 非必填 岗位
  *  status 非必填 状态
  */
  getCourseList: (params, success, error) => {
    __request.get({
      url: apiUrls.courseList,
      params: params,
      needAuth: true,
      success: (res) => {
        if (typeof success === 'function') {
          success(res.data)
        }
      },
      error: (res) => {
        if (typeof error === 'function') {
          error(res)
        }
      }
    })
  },
  getCourseInfo: (params, success, error) => {
    __request.post({
      url: apiUrls.getCourseInfo,
      params: params,
      needAuth: true,
      success: (res) => {
        if (typeof success === 'function') {
          success(res)
        }
      },
      error: (res) => {
        if (typeof error === 'function') {
          error(res)
        }
      }
    })
  },
  getOpenCourseDetail: (params, success, error) => {
    __request.get({
      url: apiUrls.getOpenCourseDetail,
      params: params,
      needAuth: true,
      success: (res) => {
        if (typeof success === 'function') {
          success(res)
        }
      },
      error: (res) => {
        if (typeof error === 'function') {
          error(res)
        }
      }
    })
  },
  createCourse: (params, success, error) => {
    __request.post({
      url: apiUrls.createOpenCourse,
      params: params,
      needAuth: true,
      success: (res) => {
        if (typeof success === 'function') {
          success(res.data)
        }
      },
      error: (res) => {
        if (typeof error === 'function') {
          error(res)
        }
      }
    })
  },
  saveOpenCourse:(params, success, error) => {
    __request.post({
      url: apiUrls.saveOpenCourse,
      params: params,
      needAuth: true,
      success: (res) => {
        if (typeof success === 'function') {
          success(res.data)
        }
      },
      error: (res) => {
        if (typeof error === 'function') {
          error(res)
        }
      }
    })
  },
  updateOpenCourse: (params, success, error) => {
    __request.post({
      url: apiUrls.updateOpenCourse,
      params: params,
      needAuth: true,
      success: (res) => {
        if (typeof success === 'function') {
          success(res.data)
        }
      },
      error: (res) => {
        if (typeof error === 'function') {
          error(res)
        }
      }
    })
  },
}
