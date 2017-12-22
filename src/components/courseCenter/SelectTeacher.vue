<!-- 选择讲师 -->
<template>
  <div class="wx-select-teacher">
    <el-tag
      style="margin-right:5px;"
      v-for="tag in backTeachers"
      :key="tag.teacher_id"
      closable
      @close="handleTagClose2(tag)">
      {{tag.name}}
    </el-tag>
    <el-button type="success" icon="el-icon-plus" @click="selectTeacher">请选择课程讲师</el-button>
      <el-dialog title="选择讲师" :visible="dialogShow" class="wx-select-teacher-dialog" :close-on-click-modal="closeOnClickModal" @close="cancel">
        <el-form style="padding-bottom: 15px;">
          <el-form-item>
            <el-input v-model="name" class="width_300" placeholder="讲师姓名"></el-input>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
        <el-table
          ref="multipleTable"
          :data="searchList"
          tooltip-effect="dark"
          style="width: 100%"
          border
          @select-all="selectAll"
          @select="select"
          empty-text="暂无数据">
          <el-table-column
            type="selection"
            width="50">
          </el-table-column>
          <el-table-column
            label="ID"
            prop="teacher_id"
            width="60">
          </el-table-column>
          <el-table-column
            prop="name"
            label="姓名"
            width="120">
          </el-table-column>
          <el-table-column
            prop="tag_1"
            label="擅长行业"
            width="200">
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            show-overflow-tooltip>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          @current-change="handleCurrentChange"
          layout="total, prev, pager, next"
          :total="Number(total)">
        </el-pagination>
        <div class="tags-container">
          <el-tag
            v-for="tag in selectedTeachers"
            :key="tag.teacher_id"
            closable
            @close="handleTagClose(tag)">
            {{tag.name}}
          </el-tag>
        </div>
        <div slot="footer" class="dialog-footer">
         <el-button type="primary" @click="confirm">确定</el-button>
         <el-button @click="cancel">取 消</el-button>
       </div>
      </el-dialog>
  </div>

</template>

<script>

import {teacherList} from '@/service/courseCenter/teacher'

export default {
  name: 'wx-select-teacher',
  data(){
    return {
      dialogShow: false,
      closeOnClickModal: false,
      name: '',
      searchList: [],
      pre_page: 6,
      page: 1,
      total: 0,
      selectedTeachers: [],
      backTeachers: []
    }
  },
  props: {
    data: {//[{teacher_id:1,name:'后牙齿拿好'}]
      type: Array,
      default: function(){
        return []
      }
    }
  },
  computed: {
  },
  watch: {
    dialogShow(c,o){
      if(c && this.searchList.length == 0){
        this.onSubmit()
      }
    },
    data(){
      this.selectedTeachers = this.data.concat([])
      this.backTeachers = this.data.concat([])
      if(this.searchList.length>0){
        this.handelSelect()
      }
    }
  },
  mounted(){},
  methods: {
    selectTeacher(){
      this.dialogShow = true
    },
    selectAll(selection){
      if(selection.length == 0){
        for(let i=0; i<this.searchList.length; i++){
          for(let j=0; j<this.selectedTeachers.length; j++){
            if(this.searchList[i].teacher_id == this.selectedTeachers[j].teacher_id){
              this.selectedTeachers.splice(j,1)
            }
          }
        }
      }else{
        for(let i=0; i<this.searchList.length; i++){
          let has = false
          for(let j=0; j<this.selectedTeachers.length; j++){
            if(this.searchList[i].teacher_id == this.selectedTeachers[j].teacher_id){
              has = true
            }
          }
          if(!has){
            this.selectedTeachers.push(this.searchList[i])
          }
        }
      }
    },
    select(selection,row){
      let has = false
      for(var i=0; i<this.selectedTeachers.length; i++){
        if(row.teacher_id == this.selectedTeachers[i].teacher_id){
          this.selectedTeachers.splice(i,1)
          has = true
        }
      }
      if(!has){
        this.selectedTeachers.push(row)
      }
    },
    handleCurrentChange(page_num){
      this.page = page_num
      this.onSubmit()
    },
    onSubmit(){
      var _this = this
      teacherList({
        name: this.name,
        pre_page: _this.pre_page,
        page: _this.page,
        status: '1'
      },function(res){
        if(res.code == '200'){
          _this.searchList = res.data.data
          _this.total = res.data.total
          setTimeout(function(){
            if(_this.selectedTeachers.length>0){
              _this.handelSelect()
            }
          },10)
        }
      })
    },
    handelSelect(){
      for(let i=0; i<this.searchList.length; i++){
        let has = false
        for(let j=0; j<this.selectedTeachers.length; j++){
          if(this.searchList[i].teacher_id == this.selectedTeachers[j].teacher_id){
            this.$refs.multipleTable.toggleRowSelection(this.searchList[i], true)
            has = true
          }
        }
        if(!has){
          this.$refs.multipleTable.toggleRowSelection(this.searchList[i], false)
        }
      }
    },
    handleTagClose(tag){
      for(let i=0; i<this.searchList.length; i++){
        if(this.searchList[i].teacher_id == tag.teacher_id){
          this.$refs.multipleTable.toggleRowSelection(this.searchList[i], false)
        }
      }
      this.selectedTeachers.splice(this.selectedTeachers.indexOf(tag),1)
    },
    handleTagClose2(tag){
      for(let i=0; i<this.searchList.length; i++){
        if(this.searchList[i].teacher_id == tag.teacher_id){
          this.$refs.multipleTable.toggleRowSelection(this.searchList[i], false)
        }
      }
      this.selectedTeachers.splice(this.selectedTeachers.indexOf(tag),1)
      this.backTeachers.splice(this.backTeachers.indexOf(tag),1)
      this.$emit("confirm", this.backTeachers)
    },
    confirm(){
      this.backTeachers = this.selectedTeachers.concat([])
      this.$emit("confirm", this.backTeachers)
      this.dialogShow = false
    },
    cancel(){
      this.selectedTeachers = this.backTeachers.concat([])
      this.handelSelect()
      this.$emit("cancel", this.backTeachers)
      this.dialogShow = false
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .wx-select-teacher-dialog{
    .el-dialog{
      margin-top: 10vh!important;
    }
    .el-dialog__body{
      padding-top: 10px;
      padding-bottom: 10px;
      height: 65vh;
      overflow-y: scroll;
    }
    .el-pagination{
      padding: 8px 0 10px;
    }
    .tags-container{
      .el-tag{
        margin-right: 8px;
      }
    }
  }
</style>
