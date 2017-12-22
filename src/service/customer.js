const apiUrls = {
  getUserList: 'v1/agency/ticket/list',
  getEnterpriseList: 'v1/agency/ticket/list',
}

export function getUserList(params, success, error) {
  return __request.get({
    url: apiUrls.getUserList,
    params: params,
    success: (res) => {
      if (typeof success === 'function') {
        success(res)
      }
    },
    error: (res) => {
      if (typeof error === 'function') {
        res = testData()
        error(res)
      }
    }
  })
}

export function getEnterpriseList(params, success, error) {
  return __request.get({
    url: apiUrls.getEnterpriseList,
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

const test = [
  {
    organization_id: '123',
    organization_name: '我是用户名称',
    organization_logo: '/img/2017-12-15_14:53:24:230.png',
    tags: '我是用户标签',
    city: '合肥',
    phone: '18666666666',
    work_num: '18',
    status: '1',
    status_name: '已启用'
  },
  {
    organization_id: '12',
    organization_name: '我是用户名称',
    organization_logo: '/img/2017-12-15_14:53:24:230.png',
    tags: '我是用户标签',
    city: '合肥',
    phone: '18666666666',
    work_num: '18',
    status: '0',
    status_name: '已禁用'
  }
]

function testData() {
  let list = []
  for(let i = 0; i < 6; i++) {
    list = list.concat(test)
  }
  return list
}
