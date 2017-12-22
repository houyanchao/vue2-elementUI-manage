<template>
  <div class="wx-teacher-list">
    <div class="search-container">
      <label class="margin_l_30 margin_r_10">讲师</label><el-input v-model="searchData.name" placeholder="讲师姓名/讲师ID" style="margin-right: 20px;" class="width_220"></el-input>
      <label class="margin_r_10">擅长行业</label>
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
      &nbsp;&nbsp;&nbsp;
      <label class="margin_r_10">擅长领域</label>
      <el-select v-model="searchData.field_1" clearable placeholder="全部" class="width_120" @change="fieldChange()">
        <el-option
          v-for="item in initData.field_1"
          :key="item.tag_id"
          :label="item.name"
          :value="item.tag_id">
        </el-option>
      </el-select>
      <el-select v-model="searchData.field_2" clearable placeholder="全部" class="width_120">
        <el-option
          v-for="item in initData.field_2"
          :key="item.tag_id"
          :label="item.name"
          :value="item.tag_id">
        </el-option>
      </el-select>
    </div>
    <div class="search-container">
      <label style="margin-right: 10px;">低价范围</label><el-input v-model="searchData.price_floor" class="width_100"></el-input> --
      <el-input v-model="searchData.price_ceiling" style="margin-right: 20px;" class="width_100"></el-input>
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
      <el-button type="primary" @click="createTeacher"><i class="el-icon-plus el-icon--right"></i>添加讲师</el-button>
      <create-teacher :visible="createTeacherVisible" :id="teacher_id" @updateSuccess="updateTeacherSuccess" @addSuccess="updateTeacherSuccess" @close="closeCreateTeacher"></create-teacher>
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      :row-class-name="tableRowClassName"
      empty-text="暂无数据">
      <el-table-column
        fixed
        prop="teacher_id"
        label="讲师ID"
        width="80"
        align="center">
      </el-table-column>
      <el-table-column
        prop="name"
        label="讲师名称"
        width="100">
      </el-table-column>
      <el-table-column
        prop="city"
        width="120"
        label="常驻城市">
      </el-table-column>
      <el-table-column
        prop="description"
        width="300"
        label="讲师描述">
      </el-table-column>
      <el-table-column
        label="擅长行业"
        width="200">
        <template slot-scope="scope">
          <span v-for="tag,index in scope.row.tags_1">
            {{tag.name}}
            <span v-if="scope.row.tags_1.length-1 > index">/</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="擅长领域"
        width="200">
        <template slot-scope="scope">
          <span v-for="tag,index in scope.row.tags_2">
              {{tag.name}}
              <span v-if="scope.row.tags_2.length-1 > index">/</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="evaluate_num"
        label="评价人数">
      </el-table-column>
      <el-table-column
        prop="evaluate_average"
        label="评价均分">
      </el-table-column>
      <el-table-column
        prop="teamwork_count"
        label="合作次数">
      </el-table-column>
      <el-table-column
        prop="teamwork_course"
        label="合作课程">
      </el-table-column>
      <el-table-column
        label="机构价（元）"
        width="120">
        <template slot-scope="scope">
          {{scope.row.price/100}}
        </template>
      </el-table-column>
      <el-table-column
        label="终端价范围（元）"
          width="140">
        <template slot-scope="scope" v-if="scope.row.price_ceiling&&scope.row.price_floor">
          {{scope.row.price_floor/100}}-{{scope.row.price_ceiling/100}}
        </template>
      </el-table-column>
      <el-table-column
        label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status=='1'">已启用</span>
          <span v-if="scope.row.status=='2'">已停用</span>
          <span v-if="scope.row.status=='3'">已禁用<br/><a href="javascript:void(0)" style="color:#fa5555" @click="showDisableReason(scope.row.message)">禁用原因</a></span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="300">
        <template slot-scope="scope">
          <a href="javascript:void(0)" style="color:#66b1ff" @click="editTeacher(scope.row)" v-if="scope.row.status != '3'"><el-button size="mini">编辑</el-button></a>&nbsp;
          <a href="javascript:void(0)" style="color:#66b1ff" @click="teacherDetail(scope.row)"><el-button size="mini" type="info">详情</el-button>&nbsp;</a>
          <a href="javascript:void(0)" style="color:#66b1ff" @click="changeStatus(scope.row)" v-if="scope.row.status != '3'">
            <template v-if="scope.row.status == '2'"><el-button size="mini" type="success">启用</el-button></template>
            <template v-if="scope.row.status == '1'"><el-button size="mini" type="danger">停用</el-button></template>
          </a>&nbsp;
          <a href="javascript:void(0)" style="color:#66b1ff" @click="addCourse(scope.row)" v-if="scope.row.status == '1'"><el-button size="mini" type="primary">添加课程</el-button></a>
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
  <teacher-detail :teacher_id="teacehr_detail_id" :visible="teacehr_detail_visible" @close="closeDetail"></teacher-detail>
  </div>
</template>

<script>

  import CreateTeacher from '@/components/courseCenter/CreateTeacher'
  import TeacherDetail from '@/components/courseCenter/TeacherDetail'
  import {tagList} from '@/service/default'
  import {teacherList, changeStatus} from '@/service/courseCenter/teacher'

  export default {
    name: 'wx-teacher-list',
    data() {
      return {
        //添加、编辑讲师
        createTeacherVisible: false,
        teacher_id: '',

        teacehr_detail_id: '',//常看详情的讲师id
        teacehr_detail_visible: false,//常看详情的遮罩层显隐

        searchData: {
          name: '',
          industry: '',
          industry_1: '',//行业
          industry_2: '',
          industry_3: '',
          field_s: "",
          field_1: "",//领域
          field_2: "",
          price_floor: '',
          price_ceiling: '',
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
          field_1: [],//领域一级标签
          field_2: [],//二级标签
          industry_1: [],//行业一级标签
          industry_2: [],//二级标签
          industry_3: [],//三级标签
        }
      }
    },
    components: { CreateTeacher, TeacherDetail},
    mounted(){
      var _this = this
      this.search()
      this.getTag(1)//行业标签
      this.getTag(4)//领域标签
    },
    methods: {
      tableRowClassName(row, rowIndex){
        if (row.row.status == '2') {
           return 'warning-row';
         }
         return '';
      },
      createTeacher(){
        this.createTeacherVisible = true
      },
      closeCreateTeacher(){
        this.createTeacherVisible = false
        this.teacher_id = ""
      },
      addTeacherSuccess(){
        this.closeCreateTeacher()
        this.search()
      },
      updateTeacherSuccess(){
        this.closeCreateTeacher()
        this.search()
      },
      search(type){
        var that = this
        if(type == 1){
          that.searchData.page = 1
        }
        // //领域
        if(this.searchData.field_2 != ""){
          this.searchData.field_s = this.searchData.field_2
        }else{
          this.searchData.field_s = this.searchData.field_1
        }

        //行业
        if(this.searchData.industry_3 != ""){
          this.searchData.industry = this.searchData.industry_3
        }else if(this.searchData.industry_2 != ""){
          this.searchData.industry = this.searchData.industry_2
        }else{
          this.searchData.industry = this.searchData.industry_1
        }

        teacherList(this.searchData, function(res){
          if(res.code == "200"){
            that.tableData = res.data.data
            that.total = parseInt(res.data.total)
          }
        },function(){
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
              _this.initData.field_1 = res.data.tags
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
      fieldChange(){
        const id = this.searchData.field_1
        this.initData.field_2 = []
        this.searchData.field_2 = ''
        for(let i=0; i<this.initData.field_1.length;i++){
          if(this.initData.field_1[i].tag_id == id){
            if(this.initData.field_1[i].children && this.initData.field_1[i].children.length>0){
              this.initData.field_2 = this.initData.field_1[i].children
            }
          }
        }
      },
      handleCurrentChange(currentPage){
        this.searchData.page = currentPage
        this.search()
      },
      editTeacher(row){
        var _this = this
        this.createTeacherVisible = true
        this.teacher_id = row.teacher_id
      },
      changeStatus(row){
        const _this = this
        if(row.status == '1'){
          this.$confirm('是否停用该讲师?', '提示', {
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
        const _this = this
        changeStatus({
          teacher_id: row.teacher_id,
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
      },
      addCourse(row){
        let teacher_id = encodeURIComponent(row.teacher_id)
        let name = encodeURIComponent(row.name)
        this.$router.push({path: '/courseSource/create', query: {teacher_id:teacher_id , name: name}});
      },
      teacherDetail(row){
        this.teacehr_detail_id = row.teacher_id
        this.teacehr_detail_visible = true
      },
      closeDetail(){
        this.teacehr_detail_id = ""
        this.teacehr_detail_visible = false
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  .wx-teacher-list{
    .search-container{
      padding-bottom: 10px;
    }
    .warning-row{
      background-color: #fee;
    }
  }
</style>
