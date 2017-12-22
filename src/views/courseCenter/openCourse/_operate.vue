<template lang="html">
  <div class="operate">
    <div v-for="btn,index in firstButtons" :key="index">
      <!-- <router-link class="operate-btn" v-if="btn.type == 1" :to="btn.url">{{btn.name}}</router-link> -->
      <el-button @click="action(btn.action)" size="small"  style="margin-bottom: 5px;">
        {{btn.name}}</el-button>
    </div>

    <el-popover v-if="secondButtons.length" trigger="hover" placement="top">
      <div size="small" v-for="btn,index in secondButtons" :key="index">
        <!-- <router-link class="operate-btn" v-if="btn.type == 1" :to="btn.url">{{btn.name}}</router-link> -->
        <el-button size="small" @click="action(btn.action)"  style="margin-bottom: 5px;">
          {{btn.name}}</el-button>
      </div>
      <div slot="reference" class="name-wrapper">
        <el-button size="small">更多操作</el-button>
      </div>
    </el-popover>
  </div>
</template>

<script>
import courseApi from 'service/courseCenter/openCourse/list.js'
export default {
  name: 'operate',
  components: {},  // 饿了吗这个子组件最好别再套子组件dialog 有问题
  props: {
    rowInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    rowIndex: {
      type: [Number, String]
    }
  },
  data () {
    return {
      // status:后台课程状态说明：[1:审核未通过 2:未开始报名 3:报名中 4:开课中 5:已结束 6:已取消]
      buttons: [
        {
          type: '2',  // 用type区分当前操作类型   1：跳转路由 2：执行方法 3.....
          name: '取消课程',
          showCourseStatus: ['-1', '2', '3'],  // 当前展示的课程状态数组
          action: 'cancelCourse'
        },
        {
          type: '2',
          name: '编辑课程',
          showCourseStatus: ['-1', '2', '3'],
          action: 'goEdit'
        },
        {
          type: '2',
          name: '重开课程',
          showCourseStatus: [], // '5'
          action: 'reopen'
        },
        {
          type: '2',
          name: '后台报名',
          showCourseStatus: ['2', '3'],
          action: 'illegalEnroll'
        },
        {
          type: '2',
          name: '批量报名',
          showCourseStatus: [], // '2', '3'  本期不做 报名成功需刷新公开课列表接口
          action: 'batchEnroll'
        },
        {
          type: '2',
          name: '会务账号',
          showCourseStatus: ['2', '3', '4', '5', '6'],
          action: 'alertMeeting'
        },
        {
          type: '2',
          name: '班主任微信',  // 班主任二维码
          showCourseStatus: ['2', '3', '4'],
          action: 'alertCode'
        },
        {
          type: '2',
          name: '课程资料',
          showCourseStatus: ['3', '4', '5'],
          action: 'alertCourseDatum'
        },
        {
          type: '2',
          name: '设置练习',
          showCourseStatus: ['2', '3', '4'],
          action: 'setPractice'
        },
        {
          type: '2',
          name: '练习评分',
          showCourseStatus: ['4', '5'],
          action: 'practiceScore'
        },
        {
          type: '2',
          name: '会务评分',
          showCourseStatus: [], // '5'
          action: 'alertMeetingGrade'
        },
        {
          type: '2',
          name: '课程考勤',
          showCourseStatus: ['4', '5'],
          action: 'goAttendance'
        },
        {
          type: '2',       // 用type区分当前操作类型   1：跳转路由 2：执行方法 3...
          name: '预览课程',
          showCourseStatus: [], // 本期不做 '2', '3', '4', '5', '6'
          action: ''
        },
        {
          type: '2',
          name: '删除课程',
          showCourseStatus: [], // 本期不做
          action: 'deleteCourse'
        },
      ]
    }
  },
  computed: {
    operateList() {
      let buttons = []
      this.buttons.forEach(btn => {
        btn.showCourseStatus.forEach(item => {
          if (item == this.rowInfo.status) {
            buttons.push(btn)
          }
        })
      })

      return buttons
    },
    firstButtons() {
      let list = []
      if (this.operateList.length > 3) {
        list = this.operateList.slice(0, 2)
      }
      else {
        list = this.operateList
      }
      return list
    },
    secondButtons() {
      let list = []
      if (this.operateList.length > 3) {
        list = this.operateList.slice(2)
      }
      return list
    }
  },
  mounted () {},
  methods: {
    action(actionName) {
      if (typeof this[actionName] === 'function') {
        this[actionName]()
      }
      else {
        console.log(actionName, '未指明方法')
      }
    },
    goEdit() {
      this.$router.push(`edit?courseId=${this.rowInfo.course_id}&isReopen=0`)
    },
    reopen() {
      this.$router.push(`edit?courseId=${this.rowInfo.course_id}&isReopen=1`)
    },
    setPractice() {
      this.$router.push(`/practice/${this.rowInfo.course_id}/list`)
    },
    practiceScore() {
      this.$router.push(`/practice/${this.rowInfo.course_id}/score-list`)
    },
    goAttendance() {
      this.$router.push(`/attendance/${this.rowInfo.course_id}/list`)
    },
    cancelCourse() {
      this.$confirm('是否取消课程', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        courseApi.cancelCourse(
          {
            course_id: this.rowInfo.course_id
          },
          (res) => {
            this.$emit('cancelCourse', this.rowIndex)
          },
          (res) => {
            this.$message(res.message)
          }
        )
      }).catch(() => {})
    },
    alertMeeting() {
      courseApi.getMeeting(
        {
          course_id: this.rowInfo.course_id
        },
        (res) => {
          this.rowInfo.meetingInfo = {
            "username": res.data.username,
            "password": res.data.password,
          }
          this.$emit('showMeetingDialog', this.rowInfo)
        },
        (res) => {
          this.rowInfo.meetingInfo = {}
          this.$emit('showMeetingDialog', this.rowInfo)
          console.log('获取会务信息出错, 故会务信息为空')
        }
      )
    },
    alertCode() {
      courseApi.getClassMaster(
        {
          course_id: this.rowInfo.course_id
        },
        (res) => {
          // 防止后端后期增加同名字段  故不写成class_master_wx
          this.rowInfo.classMasterWX = res.data.class_master
          this.$emit('showClassMasterInfoDialog', this.rowInfo)
        },
        (res) => {
          this.rowInfo.classMasterWX = ''
          this.$emit('showClassMasterInfoDialog', this.rowInfo)
          console.log('获取班主任二维码出错, 所以班主任二维码为空')
        }
      )
    },
    alertCourseDatum() {
      // 课程资料
      courseApi.getCourseDatum(
        {course_id: this.rowInfo.course_id},
        (res) => {
          this.rowInfo.courseDatum = {
            ppt: res.data.ppt || [],
            image: res.data.image || [],
            attachment: res.data.attachment || []
          }
          this.$emit('showCourseDatumDialog', this.rowInfo)
        },
        (res) => {
          this.rowInfo.courseDatum = {
            ppt: [],
            image: [],
            attachment: []
          }
          this.$emit('showCourseDatumDialog', this.rowInfo)
        }
      )
    },
    deleteCourse() {
      // 删除课程
    },
    alertMeetingGrade() {
      // 会务评分
    },
    illegalEnroll() {
      this.$emit('showIllegalEnrollDialog', this.rowInfo)
      // 后台报名
    },
    batchEnroll() {
      // 批量报名暂时不做
    },
  }
}
</script>

<style lang="scss" scoped>
.operate-btn {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  padding: 8px 15px;
  color: #5a5e66;
  font-size: 12px;
  background: #fff;
  border: 1px solid #d8dce5;
}
</style>
