<template lang="html">
  <div class="wx-practice-create">
    <practise v-if="isShow" :practices="practices" :description="backgroundInfo" @save="savePractice"></practise>
  </div>
</template>

<script>
import practiceApi from 'service/courseCenter/openCourse/practices.js'
import practise from './_practise.vue'
const practiseTitle = "练习"
export default {
  data () {
    return {
      isShow: false,
      practiceId: '', // 练习id
      practiceTotal: '',  // 当前课程习题总数
      practiceTitle: '',  // 只有编辑时才有title
      openCourseId: '',
      practices: [],  // 习题数组
      backgroundInfo: '', // 背景信息
    }
  },
  components: {
    practise
  },
  computed: {},
  mounted () {
    this.main()
  },
  methods: {
    main() {
      this.getQuery()
      if (this.practiceId) { // 编辑 数据回填
        this.getPracticeInfo()
      }
      else {  // 新增
        this.isShow = true
      }
    },
    savePractice(list, desc) {
      this.backgroundInfo = desc
      this.practices = list
      this.submitPractice()
    },
    getPracticeInfo(){
      practiceApi.detail(
        {
          practice_id: this.practiceId
        },
        (res) => {
          this.practiceTitle = res.data.title
          this.backgroundInfo = res.data.description
          this.practices = res.data.questions
          this.isShow = true
        },
        (res) => {
          this.isShow = true
          this.$message(res.message)
        }
      )
    },
    submitPractice() {
      let flag = true
      this.practices.forEach(item => {
        if (!item.description) {
          this.$message('题目内容不能为空')
          flag =  false
        }
      })

      if (flag) {
        if (this.practiceId) {
          this.updatePractice()
        }
        else {
          this.createPractice()
        }
      }
    },
    updatePractice() {
      practiceApi.update(
        {
          practice_id: this.practiceId,
          title: this.practiceTitle,
          description: this.backgroundInfo,
          questions: this.practices,
          // course_id: this.openCourseId
        },
        (res) => {
          this.$message('编辑习题成功')
          this.$router.push(`/practice/${this.openCourseId}/list`)
        },
        (res) => {
          this.$message(res.message)
        }
      )
    },
    createPractice() {
      practiceApi.create(
        {
          course_id: this.openCourseId,
          title: practiseTitle + this.rentunXuhao(parseInt(this.practiceTotal)),
          description: this.backgroundInfo,
          questions: this.practices
        },
        (res) => {
          this.$message('创建习题成功')
          this.$router.push(`/practice/${this.openCourseId}/list`)
        },
        (res) => {
          this.$message(res.message)
        }
      )
    },
    rentunXuhao(num) { // 最大100题
      let xuhao = ''
      let nums = num.toString().split('')
      let titleIndex = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '百']
      if (nums.length == 1) {
        xuhao = titleIndex[num]
      }
      else if (nums.length == 2) {
        if (nums[1] == '9') {
          xuhao = (nums[0] == '9') ? (titleIndex[0] + titleIndex[titleIndex.length - 1]) : titleIndex[nums[0]] + titleIndex[titleIndex.length - 2]
        }
        else {
          xuhao = ((nums[0] == '1') ? '' : titleIndex[parseInt(nums[0]) - 1] ) + titleIndex[titleIndex.length - 2] + titleIndex[nums[1]]
        }
      }
      return xuhao
    },
    getQuery() {
      this.openCourseId = this.$route.params.course_id || ''
      this.practiceId = this.$route.query.practiceId || ''
      this.practiceTotal = this.$route.query.total || '0'
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
