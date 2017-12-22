import request from '@/utils/request'

const apiUrls = {
  list:'/v1/agency/ticket/list'
}

//客户列表
export function getMessageList(params, success, error) {
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
