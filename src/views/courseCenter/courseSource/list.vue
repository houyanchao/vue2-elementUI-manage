<template>
  <div class="wx-course-list">
    <div class="search-container">
      <div>
        <label class="margin_r_10">课程名称</label><el-input v-model="searchData.name" placeholder="课程名称/课程库ID" style="margin-right: 20px;" class="width_220"></el-input>
        <label class="margin_l_20 margin_r_10">讲师</label><el-input v-model="searchData.teacher_name" placeholder="讲师姓名" style="margin-right: 20px;" class="width_220"></el-input>
        <label class="margin_r_10">课程分类</label>
        <el-select v-model="searchData.parent_category_id" clearable placeholder="全部" class="width_120" @change="categoryChange()">
          <el-option
            v-for="item in initData.parent_category_id"
            :key="item.tag_id"
            :label="item.name"
            :value="item.tag_id">
          </el-option>
        </el-select>
        <el-select v-model="searchData.child_category_id" clearable placeholder="全部" class="width_120">
          <el-option
            v-for="item in initData.child_category_id"
            :key="item.tag_id"
            :label="item.name"
            :value="item.tag_id">
          </el-option>
        </el-select>
        <label class="margin_r_10 margin_l_30">岗位</label>
        <el-select v-model="searchData.tags_2_1" clearable placeholder="全部" class="width_120" @change="tags2Change()">
          <el-option
            v-for="item in initData.tags_2_1"
            :key="item.tag_id"
            :label="item.name"
            :value="item.tag_id">
          </el-option>
        </el-select>
        <el-select v-model="searchData.tags_2_2" clearable placeholder="全部" class="width_120">
          <el-option
            v-for="item in initData.tags_2_2"
            :key="item.tag_id"
            :label="item.name"
            :value="item.tag_id">
          </el-option>
        </el-select>
      </div>
      <div style="margin-top: 10px;">
        <label class="margin_r_10 margin_l_30">行业</label>
        <el-select v-model="searchData.industry_1" clearable placeholder="全部" class="width_120" @change="industryChange(1)">
          <el-option
            v-for="item in initData.industry_1"
            :key="item.tag_id"
            :label="item.name"
            :value="item.tag_id">
          </el-option>
        </el-select>
        <el-select v-model="searchData.industry_2" clearable placeholder="全部" class="width_120" @change="industryChange(2)">
          <el-option
            v-for="item in initData.industry_2"
            :key="item.tag_id"
            :label="item.name"
            :value="item.tag_id">
          </el-option>
        </el-select>
        <el-select v-model="searchData.industry_3" clearable placeholder="全部" class="width_120">
          <el-option
            v-for="item in initData.industry_3"
            :key="item.tag_id"
            :label="item.name"
            :value="item.tag_id">
          </el-option>
        </el-select>

        <label style="margin-right: 10px;" class="margin_l_30">状态</label>
        <el-select v-model="searchData.status" clearable placeholder="全部" class="width_220">
          <el-option
          v-for="item in initData.status"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <el-button type="primary" @click="search(1)">查询</el-button>&nbsp;&nbsp;
        <el-button type="primary" @click="createCourse"><i class="el-icon-plus el-icon--right"></i>添加课程</el-button>
      </div>
    </div>
    <el-table
      :data="tableData"
      stripe
      border
      style="width: 100%"
      empty-text="暂无数据">
      <el-table-column
        fixed
        prop="course_source_id"
        label="课程库ID"
        width="80"
        align="center">
      </el-table-column>
      <el-table-column
        fixed
        label="课程主图"
        width="80"
        align="center">
        <template slot-scope="scope">
          <wx-image :src="scope.row.image" :width="80" :height="80"></wx-image>
        </template>
      </el-table-column>
      <el-table-column
        prop="title"
        label="课程名称"
        width="120">
      </el-table-column>
      <el-table-column
        label="讲师">
        <template slot-scope="scope">
          <span v-for="teacehr in scope.row.course_source_teacher">{{teacehr.name}}&nbsp;&nbsp;</span>
        </template>
      </el-table-column>
      <el-table-column
        label="课程分类">
        <template slot-scope="scope">
          {{scope.row.category_1_name}}&nbsp;
          {{scope.row.category_2_name}}
        </template>
      </el-table-column>
      <el-table-column
        label="擅长行业">
        <template slot-scope="scope">
          <span v-for="tag in scope.row.tags_1">{{tag.name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="关联岗位">
        <template slot-scope="scope">
          <span v-for="tag in scope.row.tags_2">{{tag.name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="适应人群">
        <template slot-scope="scope">
          <span v-for="tag in scope.row.tags_3">{{tag.name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="count"
        label="开课次数">
      </el-table-column>
      <el-table-column
        label="学员评价均分">
        <template slot-scope="scope">
          {{scope.row.teacher_score}}
          <span v-if="scope.row.teacher_score == '' || scope.row.teacher_score == null">-</span>
        </template>
      </el-table-column>
      <el-table-column
        label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status=='1'">已启用</span>
          <span v-if="scope.row.status=='2'">已停用</span>
          <span v-if="scope.row.status=='3'">已禁用</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="200">
        <template slot-scope="scope">
          <a href="javascript:void(0)" style="color:#66b1ff" @click="editCourse(scope.row)" v-if="scope.row.status != '3'">编辑</a>&nbsp;&nbsp;
          <a href="javascript:void(0)" style="color:#66b1ff" @click="watchTeacher(scope.row)">查看</a>&nbsp;&nbsp;
          <a href="javascript:void(0)" style="color:#66b1ff" @click="changeStatus(scope.row)" v-if="scope.row.status != '3'">
            <template v-if="scope.row.status == '2'">启用</template>
            <template v-if="scope.row.status == '1'">停用</template>
          </a>&nbsp;&nbsp;
          <a href="javascript:void(0)" style="color:#66b1ff" @click="showDisableReason(scope.row.remark)" v-if="scope.row.status == '3'">禁用原因</a>&nbsp;&nbsp;
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="searchData.page"
      :page-size="searchData.pre_page"
      layout="total, prev, pager, next"
      :total="total">
    </el-pagination>
    <course-detail :id="course_detail_id" :visible="course_detail_visible" @close="closeDetail"></course-detail >
  </div>
</template>
<script>

  import wxImage from 'components/common/Image.vue'
  import CreateTeacher from '@/components/courseCenter/CreateTeacher'
  import CourseDetail from '@/components/courseCenter/CourseDetail'
  import {tagList} from '@/service/default'
  import {courseList, changeStatus} from '@/service/courseCenter/courseSource'

  export default {
    name: 'wx-course-list',
    data() {
      return {
        course_detail_id: '1',
        course_detail_visible: false,

        searchData: {
          name: '',
          teacher_name: '',

          tags_1: '',//行业
          industry_1: '',
          industry_2: '',
          industry_3: '',

          parent_category_id: "",//课程分类
          child_category_id: "",

          tags_2: '',//岗位
          tags_2_1: '',
          tags_2_2: '',

          status: '',
          page: 1,
          pre_page: 10
        },
        total : 0,
        tableData: [],
        initData: {
          status: [
            {
              label: '已启用',
              value: '1'
            },
            {
              label: '已停用',
              value: '2'
            },
            {
              label: '已禁用',
              value: '3'
            }
          ],
          parent_category_id: [],//一级分类
          child_category_id: [],//二级分类
          industry_1: [],//行业一级标签
          industry_2: [],//二级标签
          industry_3: [],//三级标签
          tags_2_1: [],
          tags_2_2: []
        }
      }
    },
    components: {CreateTeacher, CourseDetail, wxImage},
    mounted(){
      var _this = this
      this.search()
      this.getTag(1)//行业标签
      this.getTag(4)//领域标签
      this.getTag(2)//岗位标签
    },
    methods: {
      search(type){
        var that = this
        if(type == 1){
          this.searchData.page = 1
        }
        //行业
        if(this.searchData.industry_3 != ""){
          this.searchData.tags_1 = this.searchData.industry_3
        }else if(this.searchData.industry_2 != ""){
          this.searchData.tags_1 = this.searchData.industry_2
        }else{
          this.searchData.tags_1 = this.searchData.industry_1
        }
        //岗位
        if(this.searchData.tags_2_2 != ""){
          this.searchData.tags_2 = this.searchData.tags_2_2
        }else{
          this.searchData.tags_2 = this.searchData.tags_2_1
        }

        courseList(this.searchData, function(res){
          if(res.code == "200"){
            that.tableData = res.data.data
            that.total = parseInt(res.data.total)
          }
        },function(res){
          if(res.data) {
            that.$message(res.data);
          }
          else {
            that.$message(res.message);
          }
        })
      },
      getTag(type){
        var _this = this
        tagList({
          type: type
        },function(res){
          if(res.code == '200'){
            if(type == 1){
              _this.initData.industry_1 = res.data.tags
            }else if(type == 4){
              _this.initData.parent_category_id = res.data.tags
            }else if(type == 2){
              _this.initData.tags_2_1 = res.data.tags
            }
          }
        },function(){
        })
      },
      industryChange(index){
        if(index == 1){
          const id = this.searchData.industry_1
          this.initData.industry_2 = []
          this.searchData.industry_2 = ''
          for(let i=0; i<this.initData.industry_1.length;i++){
            if(this.initData.industry_1[i].tag_id == id){
              if(this.initData.industry_1[i].children && this.initData.industry_1[i].children.length>0){
                this.initData.industry_2 = this.initData.industry_1[i].children
              }
            }
          }
        }else if(index == 2){
          const id = this.searchData.industry_2
          for(let i=0; i<this.initData.industry_2.length;i++){
            if(this.initData.industry_2[i].tag_id == id){
              if(this.initData.industry_2[i].children && this.initData.industry_2[i].children.length>0){
                this.initData.industry_3 = this.initData.industry_2[i].children
              }
            }
          }
        }
        this.initData.industry_3 = []
        this.searchData.industry_3 = ''
      },
      categoryChange(){
        const id = this.searchData.parent_category_id
        this.initData.child_category_id = []
        this.searchData.child_category_id = ''
        for(let i=0; i<this.initData.parent_category_id.length;i++){
          if(this.initData.parent_category_id[i].tag_id == id){
            if(this.initData.parent_category_id[i].children && this.initData.parent_category_id[i].children.length>0){
              this.initData.child_category_id = this.initData.parent_category_id[i].children
            }
          }
        }
      },
      tags2Change(){
        const id = this.searchData.tags_2_1
        this.initData.tags_2_2 = []
        this.searchData.tags_2_2 = ''
        for(let i=0; i<this.initData.tags_2_1.length;i++){
          if(this.initData.tags_2_1[i].tag_id == id){
            if(this.initData.tags_2_1[i].children && this.initData.tags_2_1[i].children.length>0){
              this.initData.tags_2_2 = this.initData.tags_2_1[i].children
            }
          }
        }
      },
      handleCurrentChange(currentPage){
        this.searchData.page = currentPage
        this.search()
      },
      editCourse(row){
        this.$router.push({path: '/courseSource/edit', query: { course_id: row.course_source_id }});
      },
      createCourse(){
        this.$router.push({path: '/courseSource/create'});
      },
      watchTeacher(row){
        this.course_detail_visible = true
        this.course_detail_id = row.course_source_id
      },
      closeDetail(){
        this.course_detail_visible = false
      },
      changeStatus(row){
        const _this = this
        if(row.status == '1'){
          this.$confirm('是否停用该课程?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            _this.changeStatus2(row)
          }).catch(() => {
          });
        }else{
          _this.changeStatus2(row)
        }
      },
      changeStatus2(row){
        var _this = this
        changeStatus({
          course_source_id: row.course_source_id,
          status: row.status=='1'?'2':'1'
        }, function(res){
          if(res.code == "200"){
            row.status = row.status=='1'?'2':'1'
            _this.$message({
              showClose: true,
              message: '状态修改成功',
              type: 'success'
            });
          }
        },function(){
          if(res.data) {
            _this.$message(res.data);
          }
          else {
            _this.$message(res.message);
          }
        })
      },
      showDisableReason(msg){
        this.$alert(msg,'禁用原因',{
          confirmButtonText: '确定'
        });
      }
    }
  }
</script>
<style lang="scss" scoped>
  .wx-course-list{
    .search-container{
      padding-bottom: 10px;
    }
  }
</style>
