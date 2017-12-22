/**
 * @fileoverview default
 * @author: houyanchao
 * @version: 2017-11-22
 */

import request from '@/utils/request'

const apiUrls = {
  tagList: '/v1/common/tag_list',//标签
  regionList: '/v1/common/region_list',//省市区
  updateAdminPwd: '/v1/agency/auth/update_admin_password',//省市区
  updatePwd: '/v1/agency/auth/update_password',//省市区
  getAgency: '/v1/agency/ticket/get_agency'//获取子机构列表
}

//type：1、行业标签；2、岗位标签；3、职位标签；4、课程分类/擅长领域; 5、企业固定标签
// parent_id 父标签的tag_id（如果没有该参数，返回所有父子标签）
export function tagList(params, success, error) {
  return request.get({
    url: apiUrls.tagList,
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
}

//省市区
// region_id 省或市id 默认空返回省列表
export function regionList(params, success, error) {
  return request.get({
    url: apiUrls.regionList,
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
}

//修改普通管理员密码密码
export function updatePwd(params, success, error) {
  return request.post({
    url: apiUrls.updatePwd,
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
}

//修改超级管理员密码
export function updateAdminPwd(params, success, error) {
  return request.post({
    url: apiUrls.updateAdminPwd,
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
}

//获取子机构列表
export function getAgency(params, success, error) {
  return request.post({
    url: apiUrls.getAgency,
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
}
