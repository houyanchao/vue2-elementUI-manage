//权限
import router from '@/router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

router.beforeEach((to, from, next) => {
  NProgress.start()
  __tool.setPageTitle(to.name || '微学机构端')
  let whitePage=['/404']//不需要登录白名单
  let toPath = to.path

  if(whitePage.indexOf(toPath)!=-1){
    next()
    NProgress.done()
  }else{
    
    let location = window.location
    let platform = __tool.getLocalStorage('platform') || ''
    let token = ''
    let id = ''
    if(platform == 'agency'){
      token = __tool.getLocalStorage('agency_token') || ''
      id = __tool.getLocalStorage('manage_id') || ''
    }else if(platform == 'agency_admin'){
      token = __tool.getLocalStorage('agency_admin_token') || ''
      id = __tool.getLocalStorage('agency_admin_id') || ''
    }

    let isLoginPage = toPath == '/login' || toPath == '/login-admin'
    let lastUrl = to.query.last_url

    if (token == '' || id == '') {
      if(!isLoginPage){
          if(platform == 'agency_admin'){
            location.href = location.origin + '/login-admin?last_url=' + encodeURI(location.href)
          }else{
            location.href = location.origin + '/login?last_url=' + encodeURI(location.href)
          }
      }else{
        next()
        NProgress.done()
      }
    }
    else {
      let url = ""
      if(platform == 'agency_admin'){
        url = 'v1/agency/auth/refresh_admin_token'
      }else{
        url = 'v1/agency/auth/refresh_token'
      }
      __request.get({
        url: url,
        params: {},
        success: (res) => {
          if(isLoginPage){
            if (lastUrl) {
              window.location.href = decodeURI(lastUrl)
            }
            else {
              location.href = location.origin + '/index'
            }
          }else{
            next()
            NProgress.done()
          }
        },
        error: (res) => {
          if(!isLoginPage){
            if(platform == 'agency_admin'){
              location.href = location.origin + '/login-admin?last_url=' + encodeURI(location.href)
            }else{
              location.href = location.origin + '/login?last_url=' + encodeURI(location.href)
            }
          }else{
            next()
            NProgress.done()
          }
        }
      })
    }
  }
})
