import request from '@/utils/request'

const apiUrls = {
  createTeacher:'/v1/agency/teacher/create',
  updateTeacher: '/v1/agency/teacher/update',
  teacherList: '/v1/agency/teacher/list',
  getTeacher: '/v1/agency/teacher/get',
  changeStatus: '/v1/agency/teacher/change_status',
  courseRelated: '/v1/agency/teacher/course_related',
  teacherLogs: '/v1/agency/teacher/logs'
}

export function createTeacher(params, success, error) {
  return request.post({
    url: apiUrls.createTeacher,
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

export function updateTeacher(params, success, error) {
  return request.post({
    url: apiUrls.updateTeacher,
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

//讲师列表
export function teacherList(params, success, error) {
  return request.get({
    url: apiUrls.teacherList,
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

//讲师详情
export function getTeacher(params, success, error) {
  return request.get({
    url: apiUrls.getTeacher,
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

// 课程相关

export function courseRelated(params, success, error) {
  return request.get({
    url: apiUrls.courseRelated,
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

//修改记录
export function teacherLogs(params, success, error) {
  return request.get({
    url: apiUrls.teacherLogs,
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
