<template lang="html">
  <div class="wx-send-message">
    <el-dialog title="参课信息" :center="true" :visible="isShowCourseInfo" @close="close" :width="'40%'">
      <p style="text-align: center;">{{content}}</p>
      <div slot="footer" class="dialog-footer">
        <!-- @success="close" 复制成功的回调 -->
        <el-button v-clipboard="content" @success="copySuccess">复 制</el-button>
        <el-button type="primary" @click="send">发 送</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import requestList from 'service/courseCenter/openCourse/list.js'
export default {
  data () {
    return {}
  },
  props: {
    isShowCourseInfo: {
      type: Boolean,
      default: false
    },
    rowInfo: {  // 当前信息
      type: Object
    },
    content: {
      type: String,
      default: ''
    }
  },
  computed: {},
  mounted () {},
  methods: {
    close() {
      this.$emit('close', this.rowInfo)
    },
    send() {
      requestList.sendAttendCourseInfo(
        {
          order_info_id: this.rowInfo.order_info_id,
        },
        (res) => {
          this.$message({
            type: 'success',
            message: res.message
          })
          this.rowInfo.sms_status_name = '已发送'
          this.close()
        },
        (res) => {
          this.$message.error(res.message)
        }
      )
    },
    copySuccess(){
      this.$notify({
          title: '成功',
          message: '复制成功',
          type: 'success'
        });
    }
  }
}
</script>

<style lang="css">
</style>
