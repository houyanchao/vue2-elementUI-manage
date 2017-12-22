<template lang="html">
  <div class="wx-enroll-list">
    <el-dialog title="报名人员" :center="true" :visible="isShowEnroll" @close="close" :width="'80%'">
      <el-table :data="datas" :stripe="true" :empty-text="'暂无数据'" :max-height="500" border>
        <el-table-column fixed prop="student_id" label="学员ID" width="80"></el-table-column>
        <el-table-column fixed label="学员名称">
          <template slot-scope="scope">
            <span>{{scope.row.student_name}}</span>
            <p v-if="scope.row.is_attend == 'N'">非正式参课</p>
          </template>
        </el-table-column>
        <el-table-column  prop="organization_name" label="报名企业"></el-table-column>
        <el-table-column  prop="student_phone" label="学员电话"></el-table-column>
        <el-table-column label="查看信息发送">
          <template slot-scope="scope">{{scope.row.sms_status_name}}</template>
        </el-table-column>
        <el-table-column  prop="enroll_time" label="报名情况"></el-table-column>

        <el-table-column label="操作" fixed="right" width="320">
          <template slot-scope="scope">
            <el-button size="small" @click="sign(scope.$index, scope.row)">
              {{scope.row.is_attend == 'N' ? '取消标记' : '标记'}}
            </el-button>
            <el-button size="small" @click="getMessage(scope.$index, scope.row)">查看/发送参课提醒</el-button>
            <el-button v-if="scope.row.can_cancel == 'Y'" size="small" @click="cancel(scope.$index, scope.row)">
              取消报名
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <send-message v-if="isShowCourseInfo" :isShowCourseInfo="isShowCourseInfo"
    :rowInfo="rowInfo" :content="content" @close="closeMessage"></send-message>
  </div>
</template>

<script>
import requestList from 'service/courseCenter/openCourse/list.js'
import sendMessage from './_sendMessage.vue'
export default {
  data () {
    return {
      isShowCourseInfo: false,
      rowInfo: {},
      content: '',
    }
  },
  props: {
    datas: {
      type: Array,
      default: () => {
        return []
      }
    },
    isShowEnroll: {
      type: Boolean,
      default: false,
    },
    // 后台课程状态 [-1:所有状态 0:待审核 1:审核未通过 2:未开始报名 3:报名中 4:开课中 5:已结束 6:已取消]
    status: { // 用于区分操作按钮
      type: [Number, String],
      default: ''
    }
  },
  computed: {},
  mounted () {},
  methods: {
    sign(index, row) {
      let alertTitle = (row.is_attend == 'N') ? '确定取消标记此学员非正式参课？' : '确定标记此学员非正式参课？'
      this.$confirm(alertTitle, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.changeAttend(row)
      }).catch(() => {})
    },
    getMessage(index, row) {
      this.rowInfo = row
      requestList.getAttendCourseInfo(
        {
          order_info_id: row.order_info_id,
        },
        (res) => {
          this.content = res.data.attend_course_info
          this.isShowCourseInfo = true
        },
        (res) => {
          this.$message.error(res.message)
        }
      )
    },
    closeMessage(obj) {
      this.rowInfo = obj
      this.isShowCourseInfo = false
    },
    cancel(index, row) {
      this.$confirm('取消将不可恢复，确定要取消报名？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        requestList.cancelEnroll(
          {
            order_info_id: row.order_info_id,
          },
          (res) => {
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.datas.splice(index, 1)
          },
          (res) => {
            this.$message.error(res.message)
          }
        )
      }).catch(() => {})
    },
    changeAttend(obj) {
      let isSign = obj.is_attend == 'N' ? 'Y' : 'N'
      requestList.attend(
        {
          order_info_id: obj.order_info_id,
          is_attend: isSign
        },
        (res) => {
          obj.is_attend = isSign
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        },
        (res) => {
          this.$message.error('操作失败')
        }
      )
    },
    close() {
      this.$emit('close')
    }
  },
  components: {
    sendMessage
  }
}
</script>
