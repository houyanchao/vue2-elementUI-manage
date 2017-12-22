import request from '@/utils/request'

const apiUrls = {
  list: '/v1/agency/course_source/list',
  create: '/v1/agency/course_source/create',
  updateCourse: '/v1/agency/course_source/update',
  changeStatus: '/v1/agency/course_source/change_status',
  getCourseSource: '/v1/agency/course_source/get',
  arrangementOfCourse: '/v1/agency/course_source/arrangement_of_course',
  getCourseLogs: '/v1/agency/course_source/logs',
}

//添加课程
export function createCourse(params, success, error) {
  return request.post({
    url: apiUrls.create,
    params: params,
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
}

//更新课程
export function updateCourse(params, success, error) {
  return request.post({
    url: apiUrls.updateCourse,
    params: params,
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
}

//课程列表
export function courseList(params, success, error) {
  return request.get({
    url: apiUrls.list,
    params: params,
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
}


//修改状态
export function changeStatus(params, success, error) {
  return request.get({
    url: apiUrls.changeStatus,
    params: params,
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
}

//获取课程详情
export function getCourseSource(params, success, error) {
  return request.get({
    url: apiUrls.getCourseSource,
    params: params,
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
}

//课程安排（开课中、待开课、已结束）
export function arrangementOfCourse(params, success, error) {
  return request.get({
    url: apiUrls.arrangementOfCourse,
    params: params,
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
}

//课程修改记录
export function getCourseLogs(params, success, error) {
  return request.get({
    url: apiUrls.getCourseLogs,
    params: params,
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
}
