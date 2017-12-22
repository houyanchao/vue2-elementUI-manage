<template lang="html">
  <div class="select-teacher">
    <el-dialog title="讲师库列表" :visible="isShow" :center="true"
      :close-on-click-modal="false" @close="$emit('close')">
      <el-form :inline="true" label-width="100px" align="center">
        <el-form-item>
          <el-input v-model="searchName" placeholder="讲师姓名查询"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="searchTeacherList">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="isShowAddBtn" type="primary" size="small"
          @click="isShowCreateTeacher = true">添加讲师</el-button>
        </el-form-item>
      </el-form>
      <el-table align="center" max-height="300" border ref="teacherList" :empty-text="'暂无数据'"
       :data="teacherList" @select-all="selectAll" @select="selectTeacher">
        <el-table-column align="center" type="selection" width="60"></el-table-column>
        <el-table-column align="center" prop="teacher_id" label="讲师ID"></el-table-column>
        <el-table-column align="center" prop="name" label="讲师姓名"></el-table-column>
        <el-table-column align="center" label="擅长行业">
          <template slot-scope="scope">
            <span v-for="label,index in scope.row.tags_1">
              {{label.name}}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="当前状态">
          <template slot-scope="scope">
            {{teacherStatus[parseInt(scope.row.status) - 1]}}
          </template>
        </el-table-column>
      </el-table>

      <div class="selected-teacher">
        <template v-if="selectedTeacher.length">
          <span>选中讲师列表：</span>
          <el-tag v-for="item,index in selectedTeacher" :key="index"
            closable :disable-transitions="false" style="margin-right: 10px"
            @close="delSelectedTeacher(item)">
            {{item.name}}
          </el-tag>
        </template>
      </div>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button type="primary" @click="$emit('close')">取 消</el-button>
        <el-button type="primary" @click="confirmTeacherTable">确 定</el-button>
      </div>
    </el-dialog>

    <create-teacher :visible="isShowCreateTeacher"
      @addSuccess="addTeacherSuccess" @close="closeCreateTeacher">
    </create-teacher>
  </div>
</template>

<script>
import openCourse from 'service/courseCenter/openCourse/create'
import createTeacher from 'components/courseCenter/CreateTeacher'

export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    isShowAddBtn: {  // 是否显示增加讲师按钮
      type: Boolean,
      default: true
    },
    list: {  // 选中的讲师  默认空
      type: Array,
      default() {
        return []
      }
    }
  },
  data () {
    return {
      teacherStatus: ['启用', '停用', '禁用'],  // 1  启用 2停用 3禁用,
      searchName: '', // 搜索老师的名字
      teacherList: [],  // 承载后台接口返回的老师列表数据
      selectedTeacher: [],  // 选中的讲师

      isShowCreateTeacher: false,
    }
  },
  components: {
    createTeacher
  },
  watch: {
    isShow: function(newVal) {
      if (newVal) {
        this.searchName = ''
        this.teacherList = []
        this.selectedTeacher = this.list.concat()
        this.getTeacherList()
      }
    }
  },
  methods: {
    closeCreateTeacher() {
      this.isShowCreateTeacher = false
    },
    addTeacherSuccess(obj) {
      this.selectedTeacher.push(obj)
      this.isShowCreateTeacher = false
    },
    showTeacherSelectDialog() {
      this.isShowTeacherSelectDialog = true
      this.selectedTeacher = this.showSelectedTeacher.concat()

      this.checkSelected(this.teacherList, this.selectedTeacher, true)
    },
    selectTeacher(selection, row) {
      let falg = false
      let index = ''
      let teachers = this.selectedTeacher
      for (let i = 0; i < teachers.length; i++) {
        if (teachers[i].teacher_id == row.teacher_id) {
          falg = true
          index = i
        }
      }

      if (falg) {
        teachers.splice(index, 1)
      }
      else {
        this.selectedTeacher.push(row)
      }
    },
    selectAll(arrs) {
      this.selectedTeacher = []
      if (arrs.length) {
        arrs.forEach(item => {
          this.selectedTeacher.push(item)
        })
      }
      else {
        this.selectedTeacher = []
      }
    },
    delSelectedTeacher(tag) {
      let list = [tag]
      this.selectedTeacher.splice(this.selectedTeacher.indexOf(tag), 1)
      this.checkSelected(this.teacherList, list, false)
    },
    confirmTeacherTable() {
      this.$emit('confirm', this.selectedTeacher)
    },
    checkSelected(newArr, selectedArr, isSelected) { // 取出选中数组在新数组中的索引 用于table的选中
      let newCheckedArr = []
      for(let i = 0; i < selectedArr.length; i++) {
        for(let h = 0; h < newArr.length; h++) {
          if (selectedArr[i].teacher_id == newArr[h].teacher_id) {
            newCheckedArr.push(newArr[h])
          }
        }
      }
      this.changeSelected(newCheckedArr, isSelected)
    },
    changeSelected(arr, isSelected) {
      setTimeout(() => {
        arr.forEach(row => {
          this.$refs.teacherList.toggleRowSelection(row, isSelected)
        })
      }, 10)
    },
    searchTeacherList() {
      this.getTeacherList()
    },
    getTeacherList() {
      openCourse.getTeacherList(
        {
          status: '1',
          name: this.searchName,
          pre_page: '1000'
        },
        (res) => {
          this.teacherList = res.data
          this.checkSelected(this.teacherList, this.selectedTeacher, true)
        },
        (res) => {
          this.$message(res.message)
        }
      )
    },
  }
}
</script>
