import axios from 'axios'
import qs from 'qs'

axios.defaults.timeout = 2000;
axios.defaults.baseURL = process.env.BASE_API

axios.interceptors.response.use(function(response) {
  if (response.data.code == 200) {
    return response.data
  }
  else {
    return Promise.reject(response)
  }
}, function(error) {
  return Promise.reject(error)
})

function handleParams(options) {
  let params = options.params || {}
  options.needAuth = options.needAuth || true
  if (options.needAuth === true) {
    let platform = __tool.getLocalStorage('platform') || ''
    if(platform == 'agency_admin'){
      params = Object.assign({
        agency_admin_token:  __tool.getAgencyAdminToken(),
        agency_admin_id:  __tool.getAgencyAdminId(),
        platform: 'agency_admin'
      }, params)
    }else{
      params = Object.assign({
        agency_token: __tool.getAgencyToken(),
        manage_id: __tool.getmanageId(),
        platform: 'agency'
      }, params)
    }
  }
  return params
}

export default {
  get(options) {

    return axios.get(options.url, {
      params: handleParams(options)
    })
    .then((res) => {
      if (typeof options.success === 'function') {
        options.success(res)
      }
    })
    .catch((err) => {

      // location.href = location.origin + '/login?last_url=' + encodeURI(location.href)

      if (err.status === 200) {
        if (typeof options.error === 'function') {
          options.error(err.data)
        }
      }
      else {
        if (typeof options.fail === 'function') {
          options.fail(err)
        }
      }
    })
  },

  post(options) {

    return axios.post(options.url, qs.stringify(handleParams(options)))
    .then((res) => {
      if (typeof options.success === 'function') {
        options.success(res)
      }
    })
    .catch((err) => {
      if (err.status === 200) {
        if (typeof options.error === 'function') {
          options.error(err.data)
        }
      }
      else {
        if (typeof options.fail === 'function') {
          options.fail(err)
        }
      }
    })
  },

  export(options){

    window.location.href = process.env.BASE_API+options.url+"?"+qs.stringify(handleParams(options))
    
  }
}
