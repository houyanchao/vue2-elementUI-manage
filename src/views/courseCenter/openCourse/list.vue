<template lang="html">
  <div class="wx-open-course-list">
    <div class="tab-list">
      <el-radio-group v-if="statusArr.length" v-model="status" @change="tabChange">
        <el-radio-button v-for="(item,index) in statusArr"
          :label="`${item.status}`" :key="index">
          {{item.name}}
          <span v-if="parseInt(item.count) > 0">({{item.count}})</span>
        </el-radio-button>
      </el-radio-group>
      <el-button style="float: right" size="small"
        icon="el-icon-question" @click="isShowNotice = true">
        公开课须知
      </el-button>
    </div>

    <el-form ref="form" :model="form" :inline="true" label-width="80px">
      <el-button type="primary" icon="el-icon-plus" @click.native="goAddOpenCouse">添加公开课</el-button>
      <el-form-item label="关键词:">
        <el-input v-model="form.keyword" placeholder="课程名称/讲师名称"></el-input>
      </el-form-item>
      <el-form-item label="活动时间:">
        <el-date-picker type="datetime" placeholder="开始时间"
          v-model="form.startTime"></el-date-picker>-
        <el-date-picker type="datetime" placeholder="结束时间"
          v-model="form.endTime">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查找</el-button>
      </el-form-item>
    </el-form>

    <el-table class="open-course-list" v-loading="isLoading" :stripe="true"
      :data="tableData" border @cell-click="cellClick" :empty-text="'暂无数据'">
      <el-table-column fixed prop="course_id" label="公开课ID" width="100px" align="center"></el-table-column>
      <el-table-column label="开课时间" :width="'160px'" align="center">
        <template slot-scope="scope">
          <span class="apply-time">{{scope.row.time_start}}</span>
          <span class="apply-time">~</span>
          <span class="apply-time">{{scope.row.time_end}}</span>
        </template>
      </el-table-column>
      <el-table-column label="课程缩略图" width="100px" align="center">
        <template slot-scope="scope">
          <init-image v-if="scope.row.thumb" :src="scope.row.thumb" :width="80" :height="80"></init-image>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="课程名称" align="center"></el-table-column>
      <el-table-column label="课程状态" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.status_name}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="teachers" label="讲师" align="center"></el-table-column>
      <!-- <el-table-column prop="host_id" label="课程主办"></el-table-column> -->
      <el-table-column label="门票" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.ticket_count}}张/人</span><br />
          <span>{{parseInt(scope.row.price) / 100}}元/人</span>
        </template>
      </el-table-column>

      <el-table-column label="招生人数" align="center">
        <template slot-scope="scope">
          <span style="color: #66b1ff; cursor: pointer;">
            {{scope.row.enroll_num}}/{{scope.row.max_count}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="后台报名人数" align="center">
        <template slot-scope="scope">
          <span style="color: #66b1ff; cursor: pointer;">
            {{scope.row.other_num}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="排队人数" align="center">
        <template slot-scope="scope">
          <span style="color: #66b1ff; cursor: pointer;">
            {{scope.row.wait_num}}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="practice_num" label="练习人数" align="center"></el-table-column>
      <el-table-column prop="avg_score" label="课程均分" align="center"></el-table-column>
      <el-table-column label="推荐" align="center">
        <template slot-scope="scope">
          <el-switch @change="recommendCourse(scope.row)" v-model="scope.row.is_recommend"></el-switch>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="remark" label="备注"></el-table-column> -->
      <el-table-column label="操作" fixed="right" align="center">
        <template slot-scope="scope">
          <operate :row-info="scope.row"
            :row-index="scope.$index"
            @cancelCourse="cancelCourse"
            @showMeetingDialog="showMeetingDialog"
            @showIllegalEnrollDialog="showIllegalEnrollDialog"
            @showCourseDatumDialog="showCourseDatumDialog"
            @showClassMasterInfoDialog="showClassMasterInfoDialog">
          </operate>
        </template>
        <!-- <template slot-scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        </template> -->
      </el-table-column>
    </el-table>

    <div class="pagination" v-if="total > 0">
      <el-pagination layout="prev, pager, next" :total="total" @current-change="pageChage"></el-pagination>
    </div>

    <wait-dialog-list v-if="isShowWait" :datas="waitDatas"
      :is-show-wait="isShowWait" @close="closeWaitDialog">
    </wait-dialog-list>
    <enroll-dialog-list v-if="isShowEnroll" :datas="enrollDatas" :status="clickCourseStatus"
      :is-show-enroll="isShowEnroll" @close="closeEnrollDialog">
    </enroll-dialog-list>
    <illegal-enroll-dialog-list v-if="isShowIllegalEnrollList" :datas="illegalEnrollDatas"
      :status="clickCourseStatus" :is-show-illegal-enroll="isShowIllegalEnrollList"
      @close="closeIllegalEnrollDialog"></illegal-enroll-dialog-list>
    <illegal-enroll :cousre="rowCourseInfo"  @close="closeIllegalEnroll"
      :is-show-illegal-enroll="isShowIllegalEnroll"></illegal-enroll>
    <meeting :is-show-meeting="isShowMeeting"
      @close="closeMeetingDialog" :cousre="rowCourseInfo">
    </meeting>
    <course-datum :is-show-course-datum="isShowCourseDatum"
      @close="closeCourseDatumDialog" :cousre="rowCourseInfo">
    </course-datum>
    <class-master-info :is-show-class-master-info="isShowClassMasterInfo"
      @close="closeClassMasterInfoDialog" :cousre="rowCourseInfo">
    </class-master-info>
    <notice :isShowNotice="isShowNotice" :title="'公开课须知'" @close="closeNotice"></notice>
  </div>
</template>

<script>
import openCourseList from 'service/courseCenter/openCourse/list.js'
import initImage from 'components/common/Image.vue'
import operate from './_operate.vue'              // 所有操作相关（操作子组件）
import waitDialogList from './_waitList.vue'          // 排队报名弹窗列表
import enrollDialogList from './_enrollList.vue'      // 报名人员弹窗列表
import illegalEnrollDialogList from './_illegalEnrollList.vue'  // 后台报名人员弹窗列表

import illegalEnroll from './_illegalEnroll.vue'  // 后台报名弹窗
import meeting from './_meeting.vue'              // 会务人员弹窗
import courseDatum from './_courseDatum.vue'      //  课程资料弹窗
import classMasterInfo from './_classMasterInfo.vue' // 班主任二维码弹窗
import notice from './notice.vue'
export default {
  name: 'wx-open-course-list',
  components: {
    initImage,
    waitDialogList,
    enrollDialogList,
    illegalEnrollDialogList,
    meeting,
    operate,
    courseDatum,
    illegalEnroll,
    classMasterInfo,
    notice,
  },
  data () {
    return {
      isShowNotice: false,   // 显隐公开课须知
      isLoading: true,
      isShowIllegalEnroll: false,  // 后台报名弹窗
      isShowMeeting: false,  // 会务人员弹窗
      isShowCourseDatum: false,  // 课程资料弹窗
      isShowClassMasterInfo: false, // 班主任信息弹窗
      rowCourseInfo: {},  // 当前点击整行的课程数据
      waitDatas: [],  // 等待报名（排队报名人员列表）
      isShowWait: false,
      // 因为机动报名/正常报名通过不同状态显示操作不一 需要通过不同课程状态改变
      clickCourseStatus: '',
      enrollDatas: [], // 正常报名人员列表（非走后门的）
      isShowEnroll: false,
      illegalEnrollDatas: [], // 机动报名人员列表（走后门的）
      isShowIllegalEnrollList: false,


      status: '', //	整型	非必填			状态
      total: '',
      page: '1',
      form: {
        keyword: '',   //	字符串	非必填			课程名称/讲师姓名
        startTime: '', //	字符串	非必填			课程开始时间[时间戳格式]
        endTime: ''    //	字符串	非必填			课程结束时间[时间戳格式]
      },
      statusArr: [],
      tableData: [],   // 当前列表数据
    }
  },
  computed: {},
  mounted () {
    this.main()
  },
  methods: {
    main() {
      this.getList()
    },
    closeNotice() {
      this.isShowNotice = false
    },

// ==================  所有操作子组件 让组件做的事===========================
    cancelCourse(index) {
      this.tableData[index].status = '6'
      this.tableData[index].status_name = '已取消'
      let changeData = this.tableData[index]
      this.$set(this.tableData, index, changeData)
    },
    closeIllegalEnroll() {  // 关闭后台报名
      this.isShowIllegalEnroll = false
      this.isLoading = true
      this.getList()
    },

    showIllegalEnrollDialog(obj) {
      this.isShowIllegalEnroll = true
      this.rowCourseInfo = obj
    },

    showMeetingDialog(obj) {
      this.isShowMeeting = true
      this.rowCourseInfo = obj
    },

    closeMeetingDialog() {
      this.isShowMeeting = false
    },

    showCourseDatumDialog(obj) {
      this.isShowCourseDatum = true
      this.rowCourseInfo = obj
    },
    closeCourseDatumDialog() {
      this.isShowCourseDatum = false
    },

    showClassMasterInfoDialog(obj) {
      this.isShowClassMasterInfo = true
      this.rowCourseInfo = obj
    },
    closeClassMasterInfoDialog() {
      this.isShowClassMasterInfo = false
    },
// ==================  所有操作子组件 让组件做的事===========================

    recommendCourse(row){
      let isRecommend = row.is_recommend ? 'Y' : 'N'
      let text = (isRecommend == 'Y') ? '确定推荐此课程？' : '确定取消推荐此课程？'
      this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        openCourseList.recommend(
          {
            "course_id": row.course_id,
            "is_recommend": isRecommend
          },
          (res) => {
            this.$message('操作成功')
          },
          (res) => {
            row.is_recommend = !row.is_recommend
            this.$message('操作失败, 请求出错')
          }
        )
      }).catch(() => {
        row.is_recommend = !row.is_recommend
      })
    },

    cellClick(row, column, cell) {
      this.clickCourseStatus = row.status
      if (column.label == '招生人数') {
        this.zhaoSheng(row)
      }
      else if (column.label == '后台报名人数') {
        this.baoming(row)
      }
      else if (column.label == '排队人数') {
        this.paidui(row)
      }
      else if (column.label == '练习人数') {
        console.log('练习人数弹框，暂时没要求做')
      }
    },
    tabChange(label) { // 组件默认返回当前绑定的label值
      this.status = label
      this.form.keyword = ''
      this.form.startTime = ''
      this.form.endTime = ''
      this.isLoading = true
      this.getList()
    },
    onSubmit() {
      this.isLoading = true
      this.getList()
    },
    goAddOpenCouse() {
      this.$router.push('create')
    },
    pageChage(size) {
      this.isLoading = true
      this.page = size
      this.getList()
    },


    zhaoSheng(obj) {  // 显示的是对应的报名人数
      openCourseList.enrollList(
        {"course_id": obj.course_id},
        (res) => {
          this.enrollDatas = res.data
          this.isShowEnroll = true
        },
        (res) => {
          console.log('正常报名人数接口异常');
          this.$message(res.message)
        }
      )
    },
    closeEnrollDialog() {
      this.isShowEnroll = false
      this.isLoading = true
      this.getList()
    },
    baoming(obj) {
      openCourseList.illegalEnrollList(
        {
          "course_id": obj.course_id
        },
        (res) => {
          this.illegalEnrollDatas = res.data
          this.isShowIllegalEnrollList = true
        },
        (res) => {
          console.log('机动报名人数接口异常');
          this.$message(res.message)
        }
      )
    },
    closeIllegalEnrollDialog() {
      this.isLoading = true
      this.isShowIllegalEnrollList = false
      this.getList()
    },
    paidui(obj) {
      openCourseList.waitList(
        {"course_id": obj.course_id},
        (res) => {
          this.waitDatas = res.data
          this.isShowWait = true
        },
        (res) => {
          console.log('排队人数接口异常');
          this.$message(res.message)
        }
      )
    },
    closeWaitDialog() {
      this.isShowWait = false
      this.isLoading = true
      this.getList()
    },

    getList() {
      let startTime = !this.form.startTime ? '' : Date.parse(this.form.startTime) / 1000
      let enTime = !this.form.endTime ? '' : Date.parse(this.form.endTime) / 1000
      openCourseList.getCourseList(
        {
          "keyword": this.form.keyword,
          "start_time": startTime,
          "end_time": enTime,
          "status": this.status,
          "page": this.page,
          "pre_page": '10'
        },
        (res) => {
          this.isLoading = false
          this.statusArr = res.data.status_list
          this.tableData = res.data.data
          this.tableData.forEach(item => {
            item.is_recommend = item.is_recommend == 'N' ? false : true
            this.statusArr.forEach(_item => {
              if (_item.status == item.status) {
                item.status_name = _item.name
              }
            })
          })
          this.total = parseInt(res.data.total)

        },
        (res) => {
          this.$message(res.message)
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.tab-list {
  margin-bottom: 20px;
}
.open-course-list {
  .apply-time {
    display: block;
    text-align: center;
  }
}
</style>
