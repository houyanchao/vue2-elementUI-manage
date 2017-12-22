<template>
  <div class="wx-course-detail">
    <el-dialog title="课程详情" :visible="visible" class="wx-course-detail-dialog" @close="closeDetail">
      <el-tabs type="border-card" v-model="activeName">
        <el-tab-pane label="基本资料" class="data-tab" name="first">
          <el-form>
            <el-form-item label="课程讲师:">
              <template v-for="teacher in detail.teacher">{{teacher.name}}&nbsp;</template>
            </el-form-item>
            <el-form-item label="课程名称:">
              {{detail.title}}
            </el-form-item>
            <el-form-item label="课程分类:">
              {{detail.category_1_name}}
              {{detail.category_2_name}}
            </el-form-item>
            <el-form-item label="行业标签:">
              <template v-for="item in detail.tags_1">
                {{item.name}}&nbsp;&nbsp;
              </template>
            </el-form-item>
            <el-form-item label="岗位标签:">
              <template v-for="item in detail.tags_2">
                {{item.name}}&nbsp;&nbsp;
              </template>
            </el-form-item>
            <el-form-item label="职务标签:">
              <template v-for="item in detail.tags_3">
                {{item.name}}&nbsp;&nbsp;
              </template>
            </el-form-item>

            <el-form-item label="课程主图:">
              <wx-image :src="detail.image" :width="148" :height="148"></wx-image>
            </el-form-item>
            <el-form-item label="课程缩略图:">
              <wx-image :src="detail.thumb" :width="148" :height="148"></wx-image>
            </el-form-item>
            <template v-for="desc in detail.description">
              <el-form-item :label="desc.key">
                {{desc.value}}
              </el-form-item>
            </template>
            <el-form-item label="课程简介:">
              <template v-for="intro in detail.intro">
                <br/>
                <p v-if="intro.type == 'p'">{{intro.value}}</p>
                <wx-image v-if="intro.type == 'img'" :src="intro.value" :width="148" :height="148"></wx-image>
              </template>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="课程相关" name="second">
          开课中
          <el-table
          :data="inClass"
          border
          style="width: 100%"
          empty-text="暂无数据">
            <el-table-column
              label="课程类型"
              width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.public_type == '1'">公开课</span>
                <span v-if="scope.row.public_type == '2'">内训课</span>
              </template>
            </el-table-column>
            <el-table-column
              label="课程主图"
              width="100">
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
              prop="teacher_expand"
              label="讲师"
              width="100">
            </el-table-column>
            <el-table-column
              prop="time_start"
              label="开课时间"
              width="100">
              <template slot-scope="scope">
                <span>{{scope.row.time_start}}&nbsp;--&nbsp;{{scope.row.time_end}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="课程状态"
              width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.status == '0'">待审核</span>
                <span v-if="scope.row.status == '1'">审核未通过</span>
                <span v-if="scope.row.status == '2'">审核通过且未开始报名</span>
                <span v-if="scope.row.status == '3'">报名中</span>
                <span v-if="scope.row.status == '4'">开课中</span>
                <span v-if="scope.row.status == '5'">已结束</span>
                <span v-if="scope.row.status == '6'">已取消</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="evaluation_number"
              label="评价学员(人)"
              width="100">
            </el-table-column>
            <el-table-column
              prop="teacher_score"
              label="学员评价均分">
            </el-table-column>
          </el-table>
          待开课
          <el-table
          :data="pendingClass"
          border
          style="width: 100%"
          empty-text="暂无数据">
            <el-table-column
              label="课程类型"
              width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.public_type == '1'">公开课</span>
                <span v-if="scope.row.public_type == '2'">内训课</span>
              </template>
            </el-table-column>
            <el-table-column
              label="课程主图"
              width="100">
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
              prop="teacher_expand"
              label="讲师"
              width="100">
            </el-table-column>
            <el-table-column
              prop="time_start"
              label="开课时间"
              width="100">
              <template slot-scope="scope">
                <span>{{scope.row.time_start}}&nbsp;--&nbsp;{{scope.row.time_end}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="课程状态"
              width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.status == '0'">待审核</span>
                <span v-if="scope.row.status == '1'">审核未通过</span>
                <span v-if="scope.row.status == '2'">审核通过且未开始报名</span>
                <span v-if="scope.row.status == '3'">报名中</span>
                <span v-if="scope.row.status == '4'">开课中</span>
                <span v-if="scope.row.status == '5'">已结束</span>
                <span v-if="scope.row.status == '6'">已取消</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="evaluation_number"
              label="评价学员(人)"
              width="100">
            </el-table-column>
            <el-table-column
              prop="teacher_score"
              label="学员评价均分">
            </el-table-column>
          </el-table>
          已结束
          <el-table
          :data="endedClass"
          border
          style="width: 100%"
          empty-text="暂无数据">
          <el-table-column
            label="课程类型"
            width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.public_type == '1'">公开课</span>
              <span v-if="scope.row.public_type == '2'">内训课</span>
            </template>
          </el-table-column>
          <el-table-column
            label="课程主图"
            width="100">
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
            prop="teacher_expand"
            label="讲师"
            width="100">
          </el-table-column>
          <el-table-column
            prop="time_start"
            label="开课时间"
            width="100">
            <template slot-scope="scope">
              <span>{{scope.row.time_start}}&nbsp;--&nbsp;{{scope.row.time_end}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="课程状态"
            width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.status == '0'">待审核</span>
              <span v-if="scope.row.status == '1'">审核未通过</span>
              <span v-if="scope.row.status == '2'">审核通过且未开始报名</span>
              <span v-if="scope.row.status == '3'">报名中</span>
              <span v-if="scope.row.status == '4'">开课中</span>
              <span v-if="scope.row.status == '5'">已结束</span>
              <span v-if="scope.row.status == '6'">已取消</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="evaluation_number"
            label="评价学员(人)"
            width="100">
          </el-table-column>
          <el-table-column
            prop="teacher_score"
            label="学员评价均分">
          </el-table-column>
        </el-table>
        </el-tab-pane>
         <el-tab-pane label="修改记录">
           <template v-for="log in logs">
             <div>{{log.created_at}}&nbsp;&nbsp;{{log.manage_name}}&nbsp;&nbsp;{{log.type_name}}</div>
           </template>
           <el-pagination
             background
             @current-change="handleCurrentChange"
             layout="total, prev, pager, next"
             :page-size="20"
             :total="Number(log_page.total)">
           </el-pagination>
         </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>
<script>

  import wxImage from 'components/common/Image.vue'
  import {getCourseSource, arrangementOfCourse, getCourseLogs} from '@/service/courseCenter/courseSource'

  export default {
    name: 'wx-teacher-detail',
    props: {
      id: {
        type: String,
        default: ''
      },
      visible: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      visible(c,o){
        if(c){
          this.getTeacher()
        }
      }
    },
    data() {
      return {
        detail: {},
        inClass: [],
        pendingClass: [],
        endedClass: [],
        open_course_relate: [],
        logs: [],
        log_page: {
          page: 1,
          total: 0
        },
        activeName: 'first'
      }
    },
    computed: {
    },
    components: {wxImage},
    mounted(){},
    methods: {
      getTeacher(){
        var _this = this
        getCourseSource({course_source_id: this.id}, function(res){
          if(res.code == '200'){
            _this.detail = res.data
            _this.detail.intro = JSON.parse(_this.detail.intro)
          }
          _this.arrangementOfCourse()
          _this.getCourseLogs()
        }, function(){
          _this.arrangementOfCourse()
          _this.getCourseLogs()
        })
      },
      arrangementOfCourse(){
        var _this = this
        arrangementOfCourse({course_source_id: this.id}, function(res){
          if(res.code == '200'){
            _this.inClass = res.data.in_class
            _this.pendingClass = res.data.pending_class
            _this.endedClass = res.data.ended_class
          }
        }, function(){
        })
      },
      handleCurrentChange(page_num){
        this.log_page.page = page_num
        this.getCourseLogs()
      },
      getCourseLogs(){
        let _this = this
        getCourseLogs({
          course_source_id: _this.id,
          page: _this.log_page.page
        }, function(res){
          if(res.code == '200'){
            _this.logs = res.data.data
            _this.log_page.total = res.data.total
          }
        })
      },
      closeDetail(){
        this.detail = {}
        this.activeName = "first"
        this.inClass = []
        this.pendingClass = []
        this.endedClass = []
        this.logs = []
        this.log_page={
          page: 1,
          total: 0
        }
        this.$emit("close")
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" >
  .wx-course-detail-dialog{
    .wx-teacher-detail{
      .el-dialog{
        margin-top: 0!important;
      }
    }
  }
</style>
