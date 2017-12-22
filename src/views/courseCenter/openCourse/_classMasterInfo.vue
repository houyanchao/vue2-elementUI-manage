<template lang="html">
  <el-dialog title="班主任二维码" :center="true" :visible="isShowClassMasterInfo" :width="'30%'"  @close="close">
    <el-form v-if="cousre">
      <el-form-item label="课程名称" label-width="120px">
        <el-input v-model="cousre.title" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="班主任微信号" label-width="120px" required>
        <el-input v-model="cousre.classMasterWX" disable placeholder="请输入班主任微信号"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="close">取 消</el-button>
      <el-button type="primary" @click="saveClassMasterInfo">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import openCourseList from 'service/courseCenter/openCourse/list.js'
export default {
  props: {
    isShowClassMasterInfo: {
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
    saveClassMasterInfo() {
      if (!this.cousre.classMasterWX) {
        this.$message('班主任微信号不得为空')
        return
      }

      openCourseList.saveClassMaster(
        {
          class_master: this.cousre.classMasterWX,
          course_id: this.cousre.course_id
        },
        (res) => {
          this.close()
        },
        (res) => {
          this.$message(res.message)
        }
      )
    },
  },
}
</script>
