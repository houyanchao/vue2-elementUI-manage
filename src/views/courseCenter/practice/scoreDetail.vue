<template lang="html">
  <div class="wx-score-detail">
    <div class="description">
      <h3>{{title}}<span>(共计{{total}}小题)</span></h3>
      <p v-if="description">背景资料：{{description}}</p>
    </div>
    <el-collapse v-if="questions.length" accordion class="detail"
      v-model="activeNames">
      <el-collapse-item v-for="question,index in questions" :key="index" :name="index">
        <template slot="title">
          第{{question.num}}题(满分10分)
          <span :class="[(question.score_status == '0') ? 'red' : 'blue', 'status']">{{question.score_status == '0' ? '待评分' : '已评分'}}</span>
        </template>
        <div class="info">
          <h4>问：{{question.description}}</h4>
          <div class="user">
            <init-img class="avatar" :src="user.avatar" :width="50" :height="50" :radius="25"></init-img>
            <dl>
              <dt class="nickname">{{user.name}}</dt>
              <dd class="organization">{{user.organization}}</dd>
              <dd>{{question.created_at}}</dd>
            </dl>
            <el-button v-if="question.score_status == '0'" @click="playScore(question)"
              plain size="small" type="primary" class="play-score">
              立即评分
            </el-button>
          </div>
          <div class="practise">
            答：{{question.content}}
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
    <el-dialog title="评分" :visible="isShow" width="30%" @close="close">
      <div class="block">
        <span class="demonstration">请对本练习题目的回答进行评分</span>
        <el-slider v-model="score" :max="10" @change="changeScore"></el-slider>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShow = false">取 消</el-button>
        <el-button type="primary" @click="saveScore">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import practiceApi from 'service/courseCenter/openCourse/practices.js'
import initImg from 'components/common/Image.vue'
export default {
  data () {
    return {
      responseId: '',
      score: 0,  // 当前打分
      total: '',  // 总共题目数
      title: '',  // 当前练习模块标题
      description: '', // 课程背景资料
      activeNames: [0],  // 当前激活的项目
      user: {},  // 用户信息
      clickQuestion: {},  // 当前被打分的对象
      questions: [], // 放置题目信息的  当前题目为数组第一项
      isShow: false,
    }
  },
  components: {
    initImg
  },
  computed: {},
  mounted () {
    this.responseId = this.$route.query.responseId || ''
    this.main()
  },
  methods: {
    main() {
      this.getScoreDetail()
    },
    close() {
      this.isShow = false
      this.score = 0
    },
    playScore(obj) {
      this.isShow = true
      this.clickQuestion = obj
    },
    saveScore() {
      practiceApi.saveScore(
        {
          response_id: this.clickQuestion.response_id,
          score: this.score
        },
        (res) => {
          this.close()
          this.clickQuestion = {}
          this.getScoreDetail()
        },
        (res) => {
          this.$message.error(res.message)
        }
      )
    },
    changeScore(val) {
      this.score = val
    },
    getScoreDetail() {
      practiceApi.answerDetail(
        {
          response_id: this.responseId
        },
        (res) => {
          this.questions = []
          this.total = res.data.total
          this.title = res.data.title
          this.description = res.data.description
          this.user = {
            avatar: res.data.avatar || '/img/50c717b19984c85434e9a1133757693f.png',
            name: res.data.nickname,
            organization: res.data.organization_name
          }
          this.questions.push(res.data.question)
          if (res.data.question_list.length) {
            this.questions = this.questions.concat(res.data.question_list)
          }
        },
        (res) => {
          console.log(res, '练习评分详情接口异常');
          this.$message.error(res.message)
        }
      )
    }
  },
}
</script>

<style lang="scss" scoped>
.description, .detail {
  width: 50%;
}
.description {
  h3 {
    margin-top: 0;
    span {
      color: #999;
      font-size: 16px;
      margin-left: 5px;
    }
  }
}

.detail {
  .status {
    float: right;
  }
  .red {
    color: red;
  }
  .blue {
    color: blue;
  }
  .info {
    margin: 0 10px;
    h4 {
      margin: 10px 0;
      font-size: 16px;
    }
    .user {
      width: 100%;
      margin-bottom: 10px;
      display: flex;
      display: -webkit-flex;
      .avatar {
        flex: 0 0 50px;
        margin-right: 10px;
      }
      dl {
        flex: 1;
        margin: 0;
        dd {
          margin: 0;
        }
        .nickname, .organization {
          display: inline-block;
        }
        .organization {
          color: #999;
          margin-left: 10px;
        }
      }
      // .play-score {
      //   padding: 10px;
      // }
    }
    .practise {
      font-size: 16px;
    }
  }
}
</style>
