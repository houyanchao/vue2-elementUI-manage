<template lang="html">
  <div class="wx-practice-score-list">
    <div class="tab-list">
      <el-radio-group v-if="statusArr.length" v-model="status" @change="tabChange">
        <el-radio-button v-for="(item,index) in statusArr"
          :label="`${item.status}`" :key="index">
          {{item.name}}
          <span v-if="parseInt(item.count) > 0">({{item.count}})</span>
        </el-radio-button>
      </el-radio-group>
      <!-- <el-form inline style="marginTop: 10px">
        <el-form-item label="学员名称:">
          <el-input v-model="name" placeholder="请输入学员名称"></el-input>
        </el-form-item>
        <el-form-item label="练习题目:">
          <el-select filterable v-model="title" placeholder="请输入题目" clearable>
            <el-option label="题目一" :value="11"></el-option>
            <el-option label="题目二" :value="22"></el-option>
          </el-select>
        </el-form-item>
      </el-form> -->
    </div>
    <el-table :data="scores" border :empty-text="'暂无数据'">
      <el-table-column fixed type="index" width="50" label="序号"></el-table-column>
      <el-table-column fixed prop="title" label="练习模块"></el-table-column>
      <el-table-column prop="description" label="题目"></el-table-column>
      <el-table-column prop="nickname" label="练习者"></el-table-column>
      <el-table-column prop="created_at" label="回答时间"></el-table-column>
      <el-table-column prop="score_time" label="评分时间"></el-table-column>
      <el-table-column prop="score" label="评分"></el-table-column>
      <el-table-column label="评分状态">
        <template slot-scope="scope">
          {{scope.row.score_status == '0' ? '待评分' : '已评分'}}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button v-if="scope.row.score_status == '1'" size="small" @click="goScore(scope.$index, scope.row)">查看</el-button>
          <el-button v-else size="small" @click="goScore(scope.$index, scope.row)">评分</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination" v-if="total > 0">
      <el-pagination layout="prev, pager, next" :total="total" @current-change="pageChange"></el-pagination>
    </div>
  </div>
</template>

<script>
// score_status=1 已评分 score_status=0 待评分
import practiceApi from 'service/courseCenter/openCourse/practices.js'

export default {
  data () {
    return {
      openCourseId: '',
      status: ' ', // 课程状态
      name: '', // 学员名称
      title: '', // 练习题目
      page: 1,
      total: 0,
      scores: [],  // 练习评分列表数据
      statusArr: []
    }
  },
  components: {},
  computed: {},
  mounted () {
    this.main()
  },
  methods: {
    main() {
      this.getQuery()
      this.getList()
    },
    goScore(index, row) {
      this.$router.push(`/practice/${this.openCourseId}/score-detail?responseId=${row.response_id}`)
    },
    tabChange(label) { // 组件默认返回当前绑定的label值
      this.status = label
      this.getList()
    },
    pageChange(size) {
      this.page = size
      this.getList()
    },
    getList() {
      practiceApi.answerList(
        {
          course_id: this.openCourseId,
          score_status: this.status,
          name: this.name, // 学员名称
          title: this.title, // 练习题目
          page: this.page,
          pre_page: '10'
        },
        (res) => {
          this.scores = res.data.data
          this.total = parseInt(res.data.total) || 0
          this.statusArr = [
            {
              name: '全部',
              status: ' ',
              count: res.data.all_num || 0
            },
            {
              name: '待评分',
              status: '0',
              count: res.data.wait_num || 0
            },
            {
              name: '已评分',
              status: '1',
              count: res.data.score_num || 0
            }
          ]
        },
        (res) => {
          console.log(res, '练习评分列表接口异常');
          this.$message(res.data.message)
        }
      )
    },
    getQuery() {
      this.openCourseId = this.$route.params.course_id || ''
      if (!this.openCourseId) {
        this.$message('缺少课程id')
        setTimeout(() => {
          this.$router.go(-1)
        }, 1500)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.wx-practice-score-list {
  .tab-list {
    margin-bottom: 10px;
  }
  // .title {
  //   margin: 0;
  //   display: -webkit-box;
  //   -webkit-line-clamp: 3;
  //   -webkit-box-orient: vertical;
  //   text-overflow: ellipsis;
  //   word-break: break-all;
  //   overflow: hidden;
  // }
}
</style>
