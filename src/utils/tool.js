/*
* 注释:： 存放各种工具类
* date:  2017-11-01
*/

export default {
  getLocalStorage: (name) => {
    return window.localStorage.getItem(name)
  },
  setLocalStorage:(name, val) => {
    window.localStorage.setItem(name, val)
  },
  getSessionStorage: (name) => {
    return window.sessionStorage.getItem(name)
  },
  setSessionStorage:(name, val) => {
    window.sessionStorage.setItem(name, val)
  },
  setPageTitle:(title) => {
    document.title = title
  },
  getAgencyToken() {//普通管理员id
    return window.localStorage.getItem('agency_token')
  },
  getmanageId() {//普通管理员token
    return window.localStorage.getItem('manage_id')
  },
  getAgencyAdminToken() {//超级管理员token
    return window.localStorage.getItem('agency_admin_token')
  },
  getAgencyAdminId() {//超级管理员id
    return window.localStorage.getItem('agency_admin_id')
  },
  // 从数组中取出随机项
  getRandomItem: function (arr) {
    if (arr.length) {
      var min = 0;
      var max = arr.length - 1;
      var index = Math.round(Math.random() * (max - min) + min);
      // console.log(index);
      return arr[index];
    }
    return null;
  },

  /**
   * 日期格式化
   * @param  {Object} date   时间对象 可以是 Date Interval String
   * @param  {String} format 如 yyyy-MM-dd hh:mm:ss
   * @return {String}
   */
  formatDatetime: function (date, format) {
    if ('string' === typeof date) {
      date = new Date(date);
    }

    if ('number' === typeof date) {
      if (date <= 9999999999) {
        date *= 1000;
      }
      date = new Date(date);
    }

    var o = {
      "M+" : date.getMonth()+1, //month
      "d+" : date.getDate(), //day
      "h+" : date.getHours(), //hour
      "m+" : date.getMinutes(), //minute
      "s+" : date.getSeconds(), //second
      "q+" : Math.floor((date.getMonth()+3)/3), //quarter
      "S" : date.getMilliseconds() //millisecond
    }

    format = format || 'yyyy-MM-dd hh:mm:ss';

    if (/(y+)/.test(format)) {
      format = format.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
      if (new RegExp("("+ k +")").test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
      }
    }
    return format;
  },

  formatDate: function (date, format) {
    return this.formatDatetime(date, format || 'yyyy-MM-dd');
  },

  formatTime: function (date, format) {
    return this.formatDatetime(date, format || 'hh:mm:ss');
  },

  formatSecond: function (time) { // 返回秒数  time:标准时间格式 或 2017-12-15 09:57:54
    return (Date.parse(time) / 1000)
  },
  initDateTime: function (dateTime) {  // dataTime  为秒数 返回标准时间
    return (new Date(dateTime * 1000))
  },
  exportFile(url, params){//导出文件
    __request.export({
      url: url,
      params: params
    })
  },
  isAdmin(){
    let platform = __tool.getLocalStorage('platform') || ''
    if(platform == 'agency'){
      return false
    }else if(platform == 'agency_admin'){
      return true
    }else{
      return false
    }
  },
  loading: function (_this, msg) {
    return _this.$loading({
      lock: true,
      text: msg?msg:'处理中',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });
  },
}
