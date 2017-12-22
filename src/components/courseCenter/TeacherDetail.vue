<template>
  <div class="wx-teacher-detail">
    <el-dialog title="讲师详情查看" :visible="visible" class="wx-teacher-detail-dialog" @close="closeDetail">
      <el-tabs type="border-card" v-model="activeName">
        <el-tab-pane label="讲师资料" class="data-tab" name="first">
          <wx-image class="teacher_logo" :src="url" :width="148" :height="148"></wx-image>
          <el-form>
            <el-form-item label="讲师姓名:">
              <span v-if="detail.fullname != ''">{{detail.fullname}}</span>
              <span v-else>-</span>
            </el-form-item>
            <el-form-item label="讲师性别:">
              <template v-if="detail.gender == '1'">男</template>
              <template v-if="detail.gender == '2'">女</template>
              <template v-if="detail.gender == ''">-</template>
            </el-form-item>
            <el-form-item label="常驻地:">
              <template v-if="detail.location&&detail.location.province_name">{{detail.location.province_name}}</template>
              <template v-if="detail.location&&detail.location.city_name">{{detail.location.city_name}}</template>
              <template v-if="detail.location&&detail.location.area_name">{{detail.location.area_name}}</template>
            </el-form-item>
            <el-form-item label="擅长行业:">
              <template v-for="item in detail.tags_1">
                {{item.name}}&nbsp;&nbsp;
              </template>
            </el-form-item>
            <el-form-item label="擅长领域:">
              <template v-for="item in detail.tags_2">
                {{item.name}}&nbsp;&nbsp;
              </template>
            </el-form-item>
            <el-form-item label="讲师职称:">
              {{detail.title}}
              <template v-if="detail.title == ''">-</template>
            </el-form-item>
            <el-form-item label="讲师描述:">
              {{detail.description}}
              <template v-if="detail.description == ''">-</template>
            </el-form-item>
            <el-form-item label="讲师资料:">
              <files :list="detail.teacher_file"></files>
            </el-form-item>
            <el-form-item label="网站地址:">
              {{detail.website}}
              <template v-if="detail.website == ''">-</template>
            </el-form-item>
            <el-form-item label="出生日期:">
              <template v-if="detail.birthday == '' || detail.birthday == '0000-00-00'">-</template>
              <template v-else>{{detail.birthday}}</template>
            </el-form-item>
            <el-form-item label="身份证号:">
              {{detail.id_card}}
              <template v-if="detail.id_card == '' || detail.id_card == null">-</template>
            </el-form-item>
            <el-form-item label="银行账号:">
              <template v-for="bank in detail.banks">
                {{bank.bank_name}}
                {{bank.account_name}}
                {{bank.account_no}}
              </template>
            </el-form-item>
            <el-form-item label="手机号码:">
              {{detail.mobile}}
              <template v-if="detail.mobile == ''">-</template>
            </el-form-item>
            <el-form-item label="固定电话:">
              {{detail.telephone}}
              <template v-if="detail.telephone == '' || detail.telephone ==null">-</template>
            </el-form-item>
            <el-form-item label="微信号:">
              {{detail.wx_name}}
              <template v-if="detail.wx_name == '' || detail.wx_name == null">-</template>
            </el-form-item>
            <el-form-item label="电子邮箱:">
              {{detail.email}}
              <template v-if="detail.email == ''">-</template>
            </el-form-item>
            <el-form-item label="联系地址:">
              {{detail.address}}
              <template v-if="detail.address == ''">-</template>
            </el-form-item>
            <el-form-item label="其他备注:">
              {{detail.remark}}
              <template v-if="detail.remark == ''">-</template>
            </el-form-item>
            <template v-for="info in detail.other_info">
              <el-form-item :label="info.title+':'">
                {{info.content}}
                <template v-if="info.content == '' || info.content == null">-</template>
              </el-form-item>
            </template>
            <el-form-item label="其他备注:">
              {{detail.other_remark}}
              <template v-if="detail.other_remark == ''">-</template>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="课程相关" name="second">
            合作课程
            <el-table
            :data="cooperative_course"
            border
            style="width: 100%"
            empty-text="暂无数据">
            <el-table-column
              prop="course_source_id"
              label="课程库ID"
              width="100">
            </el-table-column>
            <el-table-column
              label="课程主图"
              width="100">
              <template slot-scope="scope">
                <wx-image :src="scope.row.image"></wx-image>
              </template>
            </el-table-column>
            <el-table-column
              prop="title"
              label="课程名称"
              width="120">
            </el-table-column>
            <el-table-column
              prop="address"
              label="课程分类"
              width="100">
            </el-table-column>
            <el-table-column
              label="关联行业"
              width="100">
              <template slot-scope="scope">
                <span v-for="tag in scope.row.tags_1">{{tag.name}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="关联岗位"
              width="100">
              <template slot-scope="scope">
                <span v-for="tag in scope.row.tags_2">{{tag.name}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="适应人群"
              width="100">
              <template slot-scope="scope">
                <span v-for="tag in scope.row.tags_3">{{tag.name}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="count"
              label="开课次数"
              width="100">
            </el-table-column>
            <el-table-column
              label="学员评价均分">
              <template slot-scope="scope">
                {{scope.row.teacher_score | jiequ}}
              </template>
            </el-table-column>
          </el-table>
          课程安排
          <el-table
            :data="open_course_relate"
            border
            style="width: 100%"
            empty-text="暂无数据">
            <el-table-column
              prop="course_id"
              label="课程库ID"
              width="100">
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
              prop="teacehr_name"
              label="讲师"
              width="100">
              <template slot-scope="scope">
                <span v-for="teacher in scope.row.teacher_name">{{teacher.name}}&nbsp;</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="time_start"
              label="开课时间"
              width="100">
            </el-table-column>
            <el-table-column
              label="课程状态"
              width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.status == '-1'">待发布</span>
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
              label="学员评价均分">
              <template slot-scope="scope">
                {{scope.row.teacher_score | jiequ}}
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="修改记录" name="third">
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
  import Files from 'components/common/Files.vue'
  import {getTeacher, courseRelated, teacherLogs} from '@/service/courseCenter/teacher'

  export default {
    name: 'wx-teacher-detail',
    props: {
      teacher_id: {
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
        cooperative_course: [],
        open_course_relate: [],
        logs: [],
        log_page: {
          page: 1,
          total: 0
        },
        url: '',
        activeName: 'first'
      }
    },
    components: {wxImage, Files},
    mounted(){},
    filters: {
      jiequ(value){
        let val = parseFloat(value)
        return val.toFixed(2)
      }
    },
    methods: {
      getTeacher(){
        var _this = this
        getTeacher({teacher_id: this.teacher_id}, function(res){
          if(res.code == '200'){
            if(res.data.location.province_name == undefined){
              res.data.location.province_name=""
            }
            if(res.data.location.city_name == undefined){
              res.data.location.city_name=""
            }

            _this.detail = res.data
            _this.detail.teacher_file = _this.detail.teacher_file == null?[]:_this.detail.teacher_file
            _this.detail.tags_1 = _this.detail.tags_1 == null?[]:_this.detail.tags_1
            _this.detail.tags_2 = _this.detail.tags_2 == null?[]:_this.detail.tags_2
            _this.detail.banks = JSON.parse(_this.detail.bank)
            _this.url = res.data.avatar
          }
          _this.teacherLogs()
          _this.courseRelated()
        }, function(){
          _this.teacherLogs()
          _this.courseRelated()
        })
      },
      courseRelated(){
        var _this = this
        courseRelated({teacher_id: this.teacher_id}, function(res){
          if(res.code == '200'){
            _this.cooperative_course = res.data.cooperative_course == null?[]:res.data.cooperative_course
            _this.open_course_relate = res.data.open_course_relate == null?[]:res.data.open_course_relate
          }
        }, function(){
        })
      },
      handleCurrentChange(page_num){
        this.log_page.page = page_num
        this.teacherLogs()
      },
      teacherLogs(){
        let _this = this
        teacherLogs({
          teacher_id: this.teacher_id,
          page: _this.log_page.page
        }, function(res){
          if(res.code == '200'){
            _this.logs = res.data.data == null?[]:res.data.data
            _this.log_page.total = res.data.total
          }
        })
      },
      closeDetail(){
        this.detail = {}
        this.url = ""

        this.cooperative_course = []
        this.open_course_relate = []

        this.logs = []
        this.log_page={
          page: 1,
          total: 0
        }

        this.activeName = "first"
        this.$emit("close")
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" >
  .wx-teacher-detail-dialog{
    .wx-teacher-detail{
      .el-dialog{
        margin-top: 0!important;
      }
    }
    .teacher_logo{
      position: absolute!important;
      right: 20px;
      top: 20px;
    }
  }
</style>
