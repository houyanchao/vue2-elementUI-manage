<template lang="html">
  <el-dialog title="会务账号" :center="true" :visible="isShowMeeting" :width="'30%'"  @close="close">
    <el-form v-if="cousre && cousre.meetingInfo">
      <el-form-item label="会务账号" label-width="120px">
        <el-input v-model="cousre.meetingInfo.username" placeholder="请输入会务账号"></el-input>
      </el-form-item>
      <el-form-item label="会务密码" label-width="120px" required>
        <el-input v-model="cousre.meetingInfo.password"  placeholder="请输入会务密码"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="close">取 消</el-button>
      <el-button type="primary" @click="saveMeeting">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import openCourseApi from 'service/courseCenter/openCourse/list.js'
export default {
  props: {
    isShowMeeting: {
      type: Boolean,
      default: false,
    },
    cousre: {
      type: Object,
      default: () => {
        return {}
      }
    },
  },
  data () {
    return {}
  },
  computed: {},
  methods: {
    close() {
      this.$emit('close')
    },
    saveMeeting() {
      if (!this.cousre.meetingInfo.username) {
        this.$message('会务账号不得为空')
        return
      }

      if (!this.cousre.meetingInfo.password) {
        this.$message('会务账号密码不得为空')
        return
      }

      openCourseApi.saveMeeting(
        {
          course_id: this.cousre.course_id,
          username: this.cousre.meetingInfo.username,
          password: this.cousre.meetingInfo.password
        },
        (res) => {
          this.close()
        },
        (res) => {
          this.$message(res.message)
        }
      )
    },
  }
}
</script>
