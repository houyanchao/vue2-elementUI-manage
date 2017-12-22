<template lang="html">
  <el-dialog title="排队人员" :center="true" :visible="isShowWait" @close="close">
    <el-table :data="datas" :stripe="true" :empty-text="'暂无数据'" border :max-height="500">
      <el-table-column fixed prop="student_id" label="学员ID" width="100px"></el-table-column>
      <el-table-column fixed prop="student_name" label="学员名称"></el-table-column>
      <el-table-column  prop="organization_name" label="报名企业"></el-table-column>
      <el-table-column  prop="student_phone" label="学员电话"></el-table-column>
      <el-table-column  prop="enroll_time" label="排队情况"></el-table-column>

      <el-table-column label="操作" fixed="right" width="200px">
        <template slot-scope="scope">
          <el-button v-if="scope.row.can_cancel == 'Y'" size="small" @click="cancel(scope.$index, scope.row)">取消排队</el-button>
          <el-button size="small" @click="enroll(scope.$index, scope.row)">直接报名</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import requestList from 'service/courseCenter/openCourse/list.js'
export default {
  props: {
    datas: {
      type: Array,
      default() {
        return []
      }
    },
    isShowWait: {
      type: Boolean,
      default: false,
    }
  },
  data () {
    return {}
  },
  computed: {},
  mounted () {},
  methods: {
    enroll(index, row) {
      this.$confirm('确定取消排队，直接报名吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        requestList.cancelWaitEnroll(
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
    cancel(index, row) {
      this.$confirm('取消将不可恢复，确定要取消排队？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        requestList.cancelWait(
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
    close() {
      this.$emit('close')
    }
  },
  components: {}
}
</script>

<style lang="scss" scoped>
</style>
