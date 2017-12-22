<template lang="html">
<div class="select-course">
  <el-tag v-if="courses.length" :disable-transitions="false"
    closable v-for="course,index in courses":key="index"
    @close="delCourse(course)" style="margin-right: 10px">
    {{course.title}}
  </el-tag>

  <el-button type="primary" size="small" icon="el-icon-plus" @click="showCourseSelectDialog">添加/选择课程</el-button>

  <el-dialog title="课程列表" :visible.sync="isShowCourseSelectDialog"
    :close-on-click-modal="false" :center="true" @close="isShowCourseSelectDialog = false">
    <el-form :inline="true" label-width="100px" align="center">
      <el-form-item>
        <el-input v-model="coursehName" placeholder="课程名查询"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="searchCourse">查询</el-button>
      </el-form-item>
      <el-form-item v-if="isShowAddBtn">
        <el-button type="primary" size="small" @click="isShowAddCourse = true">添加临时课程</el-button>
      </el-form-item>
    </el-form>
    <el-table align="center" height="300" border ref="courseList" :data="courseList" :empty-text="'暂无数据'">
      <el-table-column align="center" property="course_source_id" label="课程ID"></el-table-column>
      <el-table-column align="center" property="title" label="课程标题"></el-table-column>
      <el-table-column align="center" property="count" label="开课次数"></el-table-column>
      <el-table-column align="center" label="课程状态">
        <template slot-scope="scope">
          {{courseStatus[scope.row.status]}}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="selected(scope.$index, scope.row)">选中</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>

  <el-dialog title="确认课程名称" :visible.sync="isShowConfirmCourseInfo"
    @close="isShowConfirmCourseInfo = false" :center="true">
    <el-input v-model="checkedCourse.title" auto-complete="off" placeholder="请输入课程名称"></el-input>
    <div slot="footer" class="dialog-footer">
      <el-button @click="isShowConfirmCourseInfo = false">取 消</el-button>
      <el-button type="primary" @click="confirmCourseInfo">确 定</el-button>
    </div>
  </el-dialog>

  <el-dialog title="添加临时课程" :visible.sync="isShowAddCourse"
    @close="isShowAddCourse = false" :center="true">
    <el-input v-model="addCourseName" auto-complete="off" placeholder="请输入课程名称"></el-input>
    <div slot="footer" class="dialog-footer">
      <el-button @click="isShowAddCourse = false">取 消</el-button>
      <el-button type="primary" @click="confirmAddCourse">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import openCourse from 'service/courseCenter/openCourse/create'

export default {
  name: 'teacher-dialog',
  props: {
    isShowAddBtn: {
      type: Boolean,
      default: true
    },
    teachers: {
      type: Array,
      default() {
        return []
      }
    },
    courses: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      courseList: [],  // 承载后台返回的课程列表
      coursehName: '',  // 搜索的课程名
      checkedCourse: {}, // 被选中的课程对象
      addCourseName: '',  // 自定义新增课程名称
      isShowCourseSelectDialog: false,
      isShowConfirmCourseInfo: false,
      isShowAddCourse: false,
      courseStatus: ['已停用', '已启用', '已禁用'] // 对应后台
    }
  },
  watch: {
    isShowCourseSelectDialog: function(newVal) {
      if (newVal) {
        this.getCourseList()
      }
    },
    coursehName: function (newVal) {
      if (!newVal) {
        this.getCourseList()
      }
    },
    // selectedCourses: function(newVal) {
    //   this.$emit('click', newVal)
    // },
  },
  // mounted() {
  //   this.selectedCourses = this.courses
  // },
  methods: {
    delCourse(course) {
      this.$emit('delete')
    },
    showCourseSelectDialog() {
      this.isShowCourseSelectDialog = true
    },
    selected(index, row) {
      this.checkedCourse = Object.assign({}, row)
      this.isShowConfirmCourseInfo = true
    },
    confirmCourseInfo() {
      this.isShowCourseSelectDialog = false
      // this.courses = [this.checkedCourse]
      this.isShowConfirmCourseInfo = false
      let list = []
      list.push(this.checkedCourse)
      this.$emit('selected', list)
    },
    confirmAddCourse() {
      let courseInfo = []
      courseInfo.push({
        title: this.addCourseName,
        course_source_id: this.addCourseName  // 区分课程库中的课程信息
      })
      // this.courses = courseInfo
      this.isShowAddCourse = false
      this.isShowCourseSelectDialog = false
      this.$emit('selected', courseInfo)
      // this.addCourseName = ''
    },
    searchCourse() {
      this.getCourseList()
    },
    getCourseList() {
      let teacherIds = []
      if (this.teachers.length) {
        this.teachers.forEach(teacher => {
          teacherIds.push(teacher.teacher_id)
        })
      }
      openCourse.getCourseList(
        {
          status: '1',
          name: this.coursehName,
          teacher_ids: teacherIds,
          pre_page: '1000'
        },
        (res) => {
          this.courseList = res.data
        },
        (res) => {
          console.log('error', '获取课程列表出错');
        }
      )
    },
  }
}
</script>
