import request from '@/utils/request'

const apiUrls = {
  customerList:'/v1/agency/ticket/customer_list',
  createTicket: '/v1/agency/ticket/create',
  updateTicket: '/v1/agency/ticket/update',
  ticketList: '/v1/agency/ticket/list',
  getTicket: '/v1/agency/ticket/get',
  activateTicket: '/v1/agency/ticket/activation'
}

//客户列表
export function customerList(params, success, error) {
  return request.get({
    url: apiUrls.customerList,
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

export function exportFile(params, success, error) {
  return request.exportFile({
    url: apiUrls.customerList,
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


//添加学习卡
export function createTicket(params, success, error) {
  return request.post({
    url: apiUrls.createTicket,
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

//获取学习卡详情
export function getTicket(params, success, error) {
  return request.get({
    url: apiUrls.getTicket,
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

//修改学习卡
export function updateTicket(params, success, error) {
  return request.post({
    url: apiUrls.updateTicket,
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

//学习卡列表
export function ticketList(params, success, error) {
  return request.get({
    url: apiUrls.ticketList,
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

//激活学习卡
export function activateTicket(params, success, error) {
  return request.post({
    url: apiUrls.activateTicket,
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
