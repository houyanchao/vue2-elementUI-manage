<template lang="html">
  <div class="wx-practice-list">
    <el-button type="primary" icon="el-icon-plus" @click.native="addPractice">添加练习</el-button>
    <el-table :data="practices" border :empty-text="'暂无数据'" :width="'50%'">
      <el-table-column fixed prop="title" label="练习模块"></el-table-column>
      <el-table-column prop="question" label="题目"></el-table-column>
      <el-table-column prop="answer" label="回答总数"></el-table-column>
      <el-table-column prop="wait_score" label="待评分回答"></el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <!-- <el-button size="small" @click="goGradeDetail(scope.$index, scope.row)">评分</el-button> -->
          <el-button size="small" @click="goEdit(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination" v-if="total > 0">
      <el-pagination layout="prev, pager, next" :total="total" @current-change="pageChange"></el-pagination>
    </div>
  </div>
</template>

<script>
import practiceApi from 'service/courseCenter/openCourse/practices.js'
export default {
  data () {
    return {
      openCourseId: '',
      page: 1,
      total: 0,

      practices: [],  // 习题列表数据
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
    goEdit(index, row) {
      this.$router.push(`/practice/${this.openCourseId}/edit?practiceId=${row.practice_id}`)
    },
    // goGradeDetail(index, row) {
    //   console.log(index, row, '去评分详情');
    // },
    addPractice() {
      this.$router.push(`/practice/${this.openCourseId}/create?total=${this.total}`)
    },
    pageChange(size) {
      this.page = size
      this.getList()
    },
    getList() {
      practiceApi.list(
        {
          course_id: this.openCourseId,
          page: this.page,
          pre_page: '10'
        },
        (res) => {
          this.practices = res.data.data
          this.total = parseInt(res.data.total) || 0
        },
        (res) => {
          console.log(res, '练习列表接口异常');
          this.$message(res.message)
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

<style lang="css">
</style>
