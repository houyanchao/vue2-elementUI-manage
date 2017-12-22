<template lang="html">
  <el-dialog title="课程资料" :center="true" :visible="isShowCourseDatum" :width="'40%'"  @close="close">
    <el-form label-width="100px" v-if="cousre && cousre.courseDatum">
      <el-form-item label="PPT：">
        <wx-upload :files="cousre.courseDatum.ppt" @success="successPpt" @remove="removePpt" :listType="'text'" :limit="20"></wx-upload>
      </el-form-item>
      <el-form-item label="课程图片：">
        <wx-upload :files="cousre.courseDatum.image" @success="successImage" @remove="removeImage" :limit="100"></wx-upload>
      </el-form-item>
      <el-form-item label="其他文件：">
        <wx-upload :isFile="true" :files="cousre.courseDatum.attachment" @success="successOthers" @remove="removeOthers" :listType="'text'" :limit="20"></wx-upload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="saveCourseDatum">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import wxUpload from 'components/imgUpload/ImgUpload'
import openCourseApi from 'service/courseCenter/openCourse/list.js'
export default {
  components: {
    wxUpload
  },
  props: {
    isShowCourseDatum: {
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
  mounted () {},
  methods: {
    close() {
      this.$emit('close')
    },
    successPpt(fileList, file, response) {
      this.cousre.courseDatum.ppt = []
      fileList.forEach(item => {
        this.cousre.courseDatum.ppt.push({
          url: item.url,
          uid: item.uid,
          name: item.name,
          size: item.size,
          type: item.type,
        })
      })
    },
    removePpt(fileList, file) {
      this.cousre.courseDatum.ppt = []
      fileList.forEach(item => {
        this.cousre.courseDatum.ppt.push({
          url: item.url,
          uid: item.uid,
          name: item.name,
          size: item.size,
          type: item.type,
        })
      })
    },
    successImage(fileList, file, response) {
      this.cousre.courseDatum.image = []
      fileList.forEach(item => {
        this.cousre.courseDatum.image.push({
          url: item.url,
          uid: item.uid,
          name: item.name,
          size: item.size,
          type: item.type,
        })
      })
    },
    removeImage(fileList, file) {
      this.cousre.courseDatum.image = []
      fileList.forEach(item => {
        this.cousre.courseDatum.image.push({
          url: item.url,
          uid: item.uid,
          name: item.name,
          size: item.size,
          type: item.type,
        })
      })
    },
    successOthers(fileList, file, response) {
      this.cousre.courseDatum.attachment = []
      fileList.forEach(item => {
        this.cousre.courseDatum.attachment.push({
          url: item.url,
          uid: item.uid,
          name: item.name,
          size: item.size,
          type: item.type,
        })
      })
    },
    removeOthers(fileList, file) {
      this.cousre.courseDatum.attachment = []
      fileList.forEach(item => {
        this.cousre.courseDatum.attachment.push({
          url: item.url,
          uid: item.uid,
          name: item.name,
          size: item.size,
          type: item.type,
        })
      })
    },

    saveCourseDatum() {
      if (!this.cousre.courseDatum.image.length) {
        this.$message('课程图片必须上传')
        return
      }

      openCourseApi.saveCourseDatum(
        {
          course_id: this.cousre.course_id,
          ppt: JSON.stringify(this.cousre.courseDatum.ppt),
          image: JSON.stringify(this.cousre.courseDatum.image),
          attachment: JSON.stringify(this.cousre.courseDatum.attachment)
        },
        (res) => {
          this.close()
        },
        (res) => {
          this.$message(res.message)
          this.close()
        }
      )
    },
  }
}
</script>
