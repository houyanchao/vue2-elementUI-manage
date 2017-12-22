const apiUrls = {
  'list': 'v1/agency/practice/list',              // 练习列表
  'create': 'v1/agency/practice/create',          // 创建练习题信息
  'update': 'v1/agency/practice/update',          // 修改编辑练习题信息
  'detail': 'v1/agency/practice/get',             // 获取习题详情
  'answerList': 'v1/agency/practice/answer_list', // 获取课程练习评分列表
  'answerDetail': 'v1/agency/practice/answer',    // 获取练习详情（评分）
  'saveScore': 'v1/agency/practice/score',        // 保存练习评分
}

export default {
  /*
   * agency_admin_token	字符串	非必填	机构超管Token
   * course_id	字符串	必填			课程id
   * page	整型	非必填	1		页码
   * pre_page	整型	非必填	10		每页显示条数
   */
  list: (params, success, error) => {
    __request.get({
      url: apiUrls.list,
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
  },
  /*
   * agency_admin_token	字符串	非必填	机构超管Token
   * course_id	字符串	必填			课程id
   *  title	字符串	必填			练习大标题
   *  description	字符串	必填			标题描述[背景资料等]
   *  questions	数组	必填			练习数组
   */
  create: (params, success, error) => {
    __request.post({
      url: apiUrls.create,
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
  },
  /*
   * agency_admin_token	字符串	非必填	机构超管Token
   * practice_id	字符串	必填			练习题id
   *  title	字符串	必填			练习大标题
   *  description	字符串	必填			标题描述[背景资料等]
   *  questions	数组	必填			练习数组
   */
  update: (params, success, error) => {
    __request.post({
      url: apiUrls.update,
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
  },
  /*
   * agency_admin_token	字符串	非必填	机构超管Token
   * practice_id	字符串	必填			练习题id
   */
  detail: (params, success, error) => {
    __request.get({
      url: apiUrls.detail,
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
  },
  /*
   * agency_admin_token	字符串	非必填			机构超管Token
   * course_id	字符串	必填			课程id
   * page	整型	非必填	1		页码
   * pre_page	整型	非必填	10		每页显示条数
   * score_status	整型	非必填			评分状态
   */
  answerList: (params, success, error) => {
    __request.get({
      url: apiUrls.answerList,
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
  },
  /*
   * agency_admin_token	字符串	非必填	机构超管Token
   * response_id	字符串	必填 答案id
   */
  answerDetail: (params, success, error) => {
    __request.get({
      url: apiUrls.answerDetail,
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
  },
  /*
   * agency_admin_token	字符串	非必填	机构超管Token
   * response_id	字符串	必填 答案id
   * score 字符串	必填 评分
   */
  saveScore: (params, success, error) => {
    __request.post({
      url: apiUrls.saveScore,
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
  },
}
