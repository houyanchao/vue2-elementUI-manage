<template lang="html">
  <div class="select-teacher">
    <el-tag v-if="showSelectedTeacher.length" :disable-transitions="false"
      closable v-for="teacher,index in showSelectedTeacher":key="index"
      @close="delShowSelectedTeacher(teacher)" style="margin-right: 10px">
      {{teacher.name}}
    </el-tag>
    <el-tag v-if="showTemporaryTeacher.length" :disable-transitions="false"
      closable v-for="teacher,index in showTemporaryTeacher" :key="index"
      @close="delShowSelectedTeacher(teacher)" style="margin-right: 10px">
      {{teacher.name}}
    </el-tag>
    <el-button type="primary" size="small" @click="showTeacherSelectDialog">选择讲师</el-button>

    <el-dialog title="讲师库列表" :visible.sync="isShowTeacherSelectDialog"
      :close-on-click-modal="false" :show-close="false" :center="true">
      <el-form :inline="true" label-width="100px" align="center">
        <el-form-item>
          <el-input v-model="searchName" placeholder="讲师姓名查询"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="searchTeacherList">查询</el-button>
        </el-form-item>
        <el-form-item v-if="isShowAddBtn">
          <el-button type="primary" size="small" @click="isCreateTeacherVisible = true">添加讲师</el-button>
          <!-- <el-button type="primary" size="small" @click="isShowTemporary = true">添加讲师</el-button> -->
        </el-form-item>
      </el-form>
      <el-table align="center" height="300" border ref="teacherList" @select-all="selectAll"
        :empty-text="'暂无数据'" :data="teacherList" @select="selectTeacher">
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
          <span>讲师库选中的讲师：</span>
          <el-tag v-for="item,index in selectedTeacher" :key="index"
            closable :disable-transitions="false" style="margin-right: 10px"
            @close="delSelectedTeacher(item)">
            {{item.name}}
          </el-tag>
        </template>
        <template v-if="selectedTemporaryTeacher.length">
          <span>临时新增的讲师：</span>
          <el-tag v-for="item,index in selectedTemporaryTeacher" :key="index"
            closable :disable-transitions="false" style="margin-right: 10px"
            @close="delSelectedTeacher(item)">
            {{item.name}}
          </el-tag>
        </template>
      </div>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button type="primary" @click="isShowTeacherSelectDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmTeacherTable">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="添加临时讲师" :visible="isShowTemporary" width="30%" center :show-close="false">
      <el-input v-model.trim="temporaryName" auto-complete="off" placeholder="请输入讲师名称"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="isShowTemporary = false">取消</el-button>
        <el-button type="primary" @click="isShowCueDialog = true">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="提示" :visible="isShowCueDialog" width="30%" center @close="closeAddTemporaryTeacher">
      <div style="text-align: center">当前讲师"{{temporaryName}}"不在课程库中,继续添加临时讲师？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addTemporaryTeacher">继续添加临时讲师</el-button>
        <el-button type="primary" @click="goAddTeacher">去课程库增加讲师</el-button>
      </span>
    </el-dialog>
    <create-teacher :visible="isCreateTeacherVisible"
      @addSuccess="addTeacherSuccess" @close="closeCreateTeacher">
    </create-teacher>
  </div>
</template>

<script>
import openCourse from 'service/courseCenter/openCourse/create'
import createTeacher from 'components/courseCenter/CreateTeacher'
const teacherStatus = ['启用', '停用', '禁用']  // 1  启用 2停用 3禁用
export default {
  props: {
    isShowAddBtn: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      teacherStatus: teacherStatus,
      showSelectedTeacher: [],  // 不同指针的selectedTeacher (最终带到下一步)
      showTemporaryTeacher: [], // 不同指针的selectedTemporaryTeacher (最终带到下一步)
      teacherList: [],  // 承载后台接口返回的老师列表数据
      searchName: '', // 搜索老师的名字
      temporaryName: '', // 增加临时老师名字
      selectedTeacher: [],  // 选中的讲师
      selectedTemporaryTeacher: [], // 选中的临时讲师
      isShowTemporary: false,  // 显示临时讲师弹窗
      isCreateTeacherVisible: false,  // 调起添加讲师弹窗
      isShowTeacherSelectDialog: false,
      isShowCueDialog: false,
    }
  },
  computed: {},
  watch: {
    showSelectedTeacher: function(newVal) {
      this.$emit('click', newVal, this.showTemporaryTeacher)
    },
    showTemporaryTeacher: function (newVal) {
      this.$emit('click', this.showSelectedTeacher, newVal)
    },
    isShowTeacherSelectDialog: function(newVal) {
      if (newVal) {
        this.getTeacherList()
      }
    },
    searchName: function (newVal) {
      if (!newVal) {
        this.getTeacherList()
      }
    }
  },
  mounted () {
    this.getTeacherList()
  },
  methods: {
    closeCreateTeacher() {
      this.isCreateTeacherVisible = false
    },
    addTeacherSuccess(obj) {
      this.selectedTeacher.push(obj)
      this.isCreateTeacherVisible = false
    },
    showTeacherSelectDialog() {
      this.isShowTeacherSelectDialog = true
      this.selectedTeacher = this.showSelectedTeacher.concat()
      this.selectedTemporaryTeacher = this.showTemporaryTeacher.concat()

      this.checkSelected(this.teacherList, this.selectedTeacher, true)
    },
    searchTeacherList() {
      this.getTeacherList()
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
    delSelectedTeacher(tag) {
      if (tag.isTemporary) { // 删除临时和讲师库区分isTemporary
        this.selectedTemporaryTeacher.splice(this.selectedTemporaryTeacher.indexOf(tag), 1)
      }
      else {
        let list = [tag]
        this.selectedTeacher.splice(this.selectedTeacher.indexOf(tag), 1)
        this.checkSelected(this.teacherList, list, false)
      }
    },
    delShowSelectedTeacher(tag) {
      if (tag.isTemporary) { // 删除临时和讲师库区分isTemporary
        this.showTemporaryTeacher.splice(this.showTemporaryTeacher.indexOf(tag), 1)
      }
      else {
        this.showSelectedTeacher.splice(this.showSelectedTeacher.indexOf(tag), 1)
      }
    },
    confirmTeacherTable() {
      this.isShowTeacherSelectDialog = false
      this.showSelectedTeacher = this.selectedTeacher.concat()
      this.showTemporaryTeacher = this.selectedTemporaryTeacher.concat()
    },
    addTemporaryTeacher() {
      this.isShowTemporary = false
      this.selectedTemporaryTeacher.push({
        name: this.temporaryName,
        teacher_id: this.temporaryName,
        isTemporary: true
      })
      this.temporaryName = ''
      this.isShowCueDialog = false
    },
    goAddTeacher() {
      this.isShowTemporary = false
      this.isShowCueDialog = false
    },
    closeAddTemporaryTeacher() {
      this.isShowCueDialog = false
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
    }
  },
  components: {
    createTeacher
  }
}
</script>
