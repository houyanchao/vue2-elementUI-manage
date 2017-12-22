const apiUrls = {
  'openCourseList': 'v1/agency/open_course/list',
  'waitList': 'v1/agency/open_course/wait_list',
  'enrollList': 'v1/agency/open_course/enroll_list',
  'illegalEnrollList': 'v1/agency/open_course/backstage_enroll_list',
  'recommend': 'v1/agency/open_course/change_recommend',
  'attend': 'v1/agency/open_course/change_attend',
  'edit': 'v1/agency/open_course/update',
  'cancelCourse': 'v1/agency/open_course/cancel_course',  // 取消公开课
  'cancelEnroll': 'v1/agency/open_course/cancel_enroll',  // 取消报名
  'cancelWait': 'v1/agency/open_course/cancel_wait',  // 取消排队
  'cancelWaitEnroll': 'v1/agency/open_course/force_enroll',  // 取消排队直接报名
  'courseDetail': 'v1/agency/open_course/get',  // 获取公开课详情
  'backstageEnroll': 'v1/agency/open_course/backstage_enroll',  // 后台机动报名
  'saveClassMaster': 'v1/agency/open_course/save_class_master',  // 新增班主任微信号
  'getClassMaster': 'v1/agency/open_course/get_class_master',  // 获取班主任微信号
  'saveCourseDatum': 'v1/agency/open_course/save_datum',  // 保存课程资料
  'getCourseDatum': 'v1/agency/open_course/get_datum',   // 获取课程资料
  'getMeeting': 'v1/agency/open_course/get_meeting',  // 查看会务账号信息
  'saveMeeting': 'v1/agency/open_course/update_meeting', // 修改会务信息
  'organizations': 'v1/agency/open_course/get_organizations',  // 通过手机号获取企业列表
  'getAttendCourseInfo': 'v1/agency/open_course/attend_course_info', // 查看学员参课信息[参课二维码]
  'sendAttendCourseInfo': 'v1/agency/open_course/send_attend_course', // 给学员发送参课提醒[参课二维码]
}

export default {
  getCourseList: (params, success, error) => {
    __request.get({
      url: apiUrls.openCourseList,
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
  edit: (params, success, error) => {
    __request.post({
      url: apiUrls.edit,
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
  courseDetail: (courseId, success, error) => {
    __request.post({
      url: apiUrls.courseDetail,
      params: {course_id: courseId},
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
  backstageEnroll:(params, success, error)=> {
    __request.post({
      url: apiUrls.backstageEnroll,
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
  saveClassMaster: (params, success, error) => {
    __request.get({
      url: apiUrls.saveClassMaster,
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
  getClassMaster: (params, success, error) => {
    __request.get({
      url: apiUrls.getClassMaster,
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
  saveCourseDatum: (params, success, error) => {
    __request.post({
      url: apiUrls.saveCourseDatum,
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
  getCourseDatum: (params, success, error) => {
    __request.get({
      url: apiUrls.getCourseDatum,
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
  saveMeeting: (params, success, error) => {
    __request.get({
      url: apiUrls.saveMeeting,
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
  getMeeting: (params, success, error) => {
    __request.get({
      url: apiUrls.getMeeting,
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
  // 等待报名人数弹框  参数 course_id
  waitList: (params, success, error) => {
    __request.get({
      url: apiUrls.waitList,
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
  // 报名人数列表  参数 course_id
  enrollList:(params, success, error) => {
    __request.get({
      url: apiUrls.enrollList,
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
  illegalEnrollList:(params, success, error) => {
    __request.get({
      url: apiUrls.illegalEnrollList,
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
  recommend: (params, success, error) => {
    __request.get({
      url: apiUrls.recommend,
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
  cancelCourse: (params, success, error) => {
    __request.get({
      url: apiUrls.cancelCourse,
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
  cancelEnroll:(params, success, error) => {
    __request.get({
      url: apiUrls.cancelEnroll,
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
  cancelWait:(params, success, error) => {
    __request.get({
      url: apiUrls.cancelWait,
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
  cancelWaitEnroll: (params, success, error) => {
    __request.get({
      url: apiUrls.cancelWaitEnroll,
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
  attend: (params, success, error) => {
    __request.get({
      url: apiUrls.attend,
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
  getOrganizations: (params, success, error) => {
    __request.get({
      url: apiUrls.organizations,
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
  getAttendCourseInfo: (params, success, error) => {
    __request.get({
      url: apiUrls.getAttendCourseInfo,
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
  sendAttendCourseInfo: (params, success, error) => {
    __request.get({
      url: apiUrls.sendAttendCourseInfo,
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
}
