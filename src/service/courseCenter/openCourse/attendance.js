import request from '@/utils/request'

const apiUrls = {
  attendanceList: '/v1/agency/course_attendance/list',
  getAttendance: '/v1/agency/course_attendance/get',
  setAttendance: '/v1/agency/course_attendance/set'
}

//考勤列表
export function attendanceList(params, success, error) {
  return request.get({
    url: apiUrls.attendanceList,
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

//获取课程签到签退时间
export function getAttendance(params, success, error) {
  return request.get({
    url: apiUrls.getAttendance,
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

//设置课程签到签退时间
export function setAttendance(params, success, error) {
  return request.post({
    url: apiUrls.setAttendance,
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
