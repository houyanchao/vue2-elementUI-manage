<template>
  <div class="wx-open-course-create">
    <el-tabs v-model="activeName">
      <el-tab-pane label="第一步,选择讲师及关联课程" name="first">
        <el-form class="teacher-form">
          <el-form-item label="讲师名称:">
            <select-teacher @click="getTeachers"></select-teacher>
          </el-form-item>
          <el-form-item label="课程名称:">
            <select-course :courses="courses" :teachers="teachers"
              @delete="deleteCourses" @selected="selectedCourses">
            </select-course>
          </el-form-item>
          <el-button type="primary" @click="onNextStep">下一步</el-button>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="第二步,添加课程信息" name="second">
        <step-two :teachers="teachers" :courses="courses" :courseInfo="courseInfo"></step-two>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import openCourse from 'service/courseCenter/openCourse/create'
import selectTeacher from './_selectTeacher.vue'
import selectCourse from './_selectCourse.vue'
import stepTwo from './step2.vue'

export default {
  components: {
    selectTeacher,
    selectCourse,
    stepTwo
  },
  data() {
    return {
      activeName: 'first',
      courses: [], // 最终选出的课程
      teachers: [],  // 最终所有讲师
      courseInfo: {},  // 对应课程信息
      selectedTeacher: [],  // 最终在讲师库选出的讲师
      selectedTemporaryTeacher: [],  // 最终新增的临时讲师
    }
  },
  watch: {
    activeName: function(newVal) {
      if (newVal == 'second') {
        if(this.courses.length == 0 || this.teachers.length == 0) {
          this.$confirm('请先在第一步中添加讲师，课程相关信息！', '提示', {
            confirmButtonText: '去第一步',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            this.activeName = 'first'
          }).catch(() => {
            this.$message().close()
          })
        }
      }
    }
  },
  mounted () {},
  methods: {
    getTeachers(teachers, temporaryTeachers) {
      this.selectedTeacher = teachers
      this.selectedTemporaryTeacher = temporaryTeachers
      this.teachers = this.selectedTeacher.concat(this.selectedTemporaryTeacher)
    },
    selectedCourses(arr) {
      this.courses = arr
    },
    deleteCourses() {
      this.courses = []
    },
    onNextStep() {
      let courseId = ''
      for(let i = 0; i < this.courses.length; i++) {
        courseId = this.courses[i].course_source_id || ''
      }

      openCourse.getCourseInfo(
        {
          agency_admin_token: __tool.getLocalStorage('admin_agency_token'),
          course_source_id: courseId
        },
        (res) => {
          this.courseInfo = res.data
        },
        (res) => {
          console.log('error', '获取讲师列表出错');
        }
      )
      this.activeName = 'second'
    }
  },
}
</script>
