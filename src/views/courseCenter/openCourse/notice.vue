<template lang="html">
  <el-dialog class="wx-open-course-notice" :title="title"
    :visible="isShowNotice" width="40%" @close="$emit('close')">
    <h4 v-if="content">{{content}}</h4>
    公开课须知：<br />
      1.公开课必须经过平台审核后才可完成发布<br />
      2.完成审核后的公开课你可以通过下列行为更好的保障学员的学习结果<br />
      第一步：设置班主任微信号，能够支持做好学员的微信拉群、课程推进以及后续的营销<br />
      第二步：设置好课程练习，用于检验学员的课堂学习成果<br />
      第三步：课程开课，会务账号可用于登录前台页面“链接地址”，管理课程中的各环节<br />
      第四步：课程考勤，可用于查看学员上课的考勤情况以及调整学员的考勤<br />
      第五步：学员完成练习后，作为机构管理人员应该安排好人员做好练习的评分工作<br />
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {}
  },
  props: {
    isShowNotice: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '提交成功'
    },
    content: {
      type: String,
      default: ''
    }
  },
  computed: {},
  mounted () {},
  methods: {},
  components: {}
}
</script>

<style lang="css">
</style>
