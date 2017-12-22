<template lang="html">
  <div class="wx-attendance-list">
    <a href="javascript:void(0)" class="back" @click="back"><<返回公开课列表页</a>
    <div class="setting-container">
      <div class="time">课程时间: {{course_date.time_start}} ~ {{course_date.time_end}}</div>
      <div class="btn">
        <el-button type="success" @click="setSignTime">签到签退设置</el-button>
        <el-button type="warning" @click="openAttendanceCode">学员考勤码</el-button>
      </div>
    </div>
    <div class="data-list">
      <ul>
        <li>报名人数<a href="javascript:void(0)" style="color: #409EFF;">{{each_state_data.enroll_num}}</a>人</li>
        <li>正常出勤<a href="javascript:void(0)"style="color: #009688;">{{each_state_data.quanqin_num}}</a>人</li>
        <li>迟到<a href="javascript:void(0)" style="color: #FA5555;" @click="showList(1)">{{each_state_data.chidao_num}}</a>人</li>
        <li>早退<a href="javascript:void(0)" style="color: #FA5555;" @click="showList(2)">{{each_state_data.zaotui_num}}</a>人</li>
        <li>旷课<a href="javascript:void(0)" style="color: #FA5555;" @click="showList(3)">{{each_state_data.kuangke_num}}</a>人</li>
        <li>缺卡<a href="javascript:void(0)" style="color: #FA5555;" @click="showList(4)">{{each_state_data.queka_num}}</a>人</li>
      </ul>
    </div>
    <el-table
      :data="list"
      stripe
      border
      style="width: 100%"
      sum-text="合计"
      empty-text="暂无数据">
        <el-table-column
          prop="sign_date"
          label="日期"
          width="140">
        </el-table-column>
        <el-table-column
          prop="student_name"
          label="学员名称"
          width="140">
        </el-table-column>
        <el-table-column
          prop="student_phone"
          label="学员手机号"
          width="140">
        </el-table-column>
        <el-table-column
          prop="time_start"
          label="上课时间"
          width="160">
        </el-table-column>
        <el-table-column
          prop="time_end"
          label="下课时间"
          width="160">
        </el-table-column>
        <el-table-column
          label="签到时间"
          width="200">
          <template slot-scope="scope">
            <span v-if="scope.row.sign_start_status == '0'" style="color:#fa5555">未打卡</span>
            <span v-if="scope.row.sign_start_status == '1'">{{scope.row.sign_start}}</span>
            <span v-if="scope.row.sign_start_status == '2'">{{scope.row.sign_start}}<span style="color:#fa5555">(迟到)</span></span>
          </template>
        </el-table-column>
        <el-table-column
          label="签退时间">
          <template slot-scope="scope">
            <span v-if="scope.row.sign_end_status == '0'" style="color:#fa5555">未打卡</span>
            <span v-if="scope.row.sign_end_status == '1'">{{scope.row.sign_end}}</span>
            <span v-if="scope.row.sign_end_status == '2'">{{scope.row.sign_end}}<span style="color:#fa5555">(早退)</span></span>
          </template>
        </el-table-column>
    </el-table>

    <!-- 设置签到签退时间 -->
    <el-dialog title="签到签退设置" :visible.sync="setSignVisible">
      <div class="time-container">
        <div v-for="time in attendanceTime">
          <h3>{{time.date}}</h3>
          <div class="">
            签到时间
            <el-time-select
              v-model="time.checkin"
              :editable="editable"
              :clearable="clearable"
              :picker-options="{
                start: '00:00',
                step: '00:10',
                end: '23:00'
              }"
              style="width: 120px"
              placeholder="选择时间">
              </el-time-select>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              签退时间
              <el-time-select
                v-model="time.checkout"
                :editable="editable"
                :clearable="clearable"
                :picker-options="{
                  start: '00:00',
                  step: '00:10',
                  end: '23:00'
                }"
                style="width: 120px"
                placeholder="选择时间">
                </el-time-select>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setSignVisible = false">取 消</el-button>
        <el-button type="primary" @click="setSignTimeC">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 迟到/早退/旷课/缺卡 人员展示-->
    <el-dialog :title="customerTitle" :visible.sync="customerShow">
      <div class="customer-container">
        <ul>
          <li v-for="c in customer">
            <div>
              {{c.student_name}}
              <span style="float: right;">
                <template v-if="type == 1">迟到</template>
                <template v-if="type == 2">早退</template>
                <template v-if="type == 3">旷课</template>
                <template v-if="type == 4">缺卡</template>
                {{c.number}}次</span>
            </div>
            <div v-for="sign in c.sign_time" class="list">
              {{sign.sign_date}}
              &nbsp;&nbsp;
              <template v-if="type == 1">签到时间</template>
              <template v-if="type == 2">签退时间</template>
              <template v-if="type == 3">旷课</template>
              <template v-if="type == 4">未签到</template>
              <template v-if="type == 1">{{sign.sign_start}}&nbsp;&nbsp;迟到{{sign.chidao_minute}}分钟</template>
              <template v-if="type == 2">{{sign.sign_end}}&nbsp;&nbsp;早退{{sign.zaotui_minute}}分钟</template>
            </div>
          </li>
        </ul>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="customerShow = false">取 消</el-button>
      </div>
    </el-dialog>
    <qr-code :visible="qrcode_visible" :value="qrcode_value" @close="closeAttendanceCode"></qr-code>
  </div>
</template>

<script>

import {attendanceList, getAttendance, setAttendance} from '@/service/courseCenter/openCourse/attendance'
import QrCode from '@/components/common/QrCode'

export default {
  name: 'wx-attendance-list',
  data () {
    return {
      editable: false,
      clearable: false,
      qrcode_visible: false,
      qrcode_value: '',
      openCourseId: '',
      course_date: {
        time_start: '',
        time_end: ''
      },
      each_state_data:{},
      list: [],
      setSignVisible: false,
      attendanceTime: [],
      customer: [],
      customerShow: false,
      customerTitle: '',
      type: 0
    }
  },
  components: {QrCode},
  computed: {},
  mounted () {
    this.getQuery()
  },
  methods: {
    getQuery(){
      let _this = this
      this.openCourseId = this.$route.params.course_id || ''
      if (!this.openCourseId) {
        this.$message({
           message: '获取公开课考勤失败',
           type: 'warning',
           onClose(){
             _this.$router.go(-1)
           }
         })
      }else{
        this.getAttendanceList()
        this.getAttendance()
      }
    },
    getAttendanceList(){
      attendanceList({
        course_id: this.openCourseId
      }, (res)=>{
        if(res.code == '200'){
          this.list = res.data.course_Attendance_list == null?[]:res.data.course_Attendance_list
          this.course_date = res.data.course_date
          this.each_state_data = res.data.each_state_data
          this.each_state_data.enroll_num = res.data.enroll_num
          this.each_state_data.zhenchang_num = this.each_state_data.enroll_num - this.each_state_data.chidao_num - this.each_state_data.zaotui_num - this.each_state_data.kuangke_num - this.each_state_data.queka_num
          this.course_date.time_start = this.formatDate(this.course_date.time_start)
          this.course_date.time_end = this.formatDate(this.course_date.time_end)

          for(let i=0; i<this.list.length; i++){
            this.list[i].time_start = this.formatTime(this.list[i].time_start)
            this.list[i].time_end = this.formatTime(this.list[i].time_end)
            this.list[i].sign_start = this.formatTime(this.list[i].sign_start)
            this.list[i].sign_end = this.formatTime(this.list[i].sign_end)
          }
        }
      })
    },
    getAttendance(){
      getAttendance({
        course_id: this.openCourseId
      }, (res)=>{
        if(res.code == '200'){
          this.attendanceTime = res.data
          for(let i=0; i<this.attendanceTime.length; i++){
            this.attendanceTime[i].checkin = this.formatTime(this.attendanceTime[i].checkin)
            this.attendanceTime[i].checkout = this.formatTime(this.attendanceTime[i].checkout)
            this.attendanceTime[i].date = this.attendanceTime[i].sign_date
          }
        }
      })
    },
    setSignTimeC(){
      for(let i=0; i<this.attendanceTime.length; i++){
        if(this.attendanceTime[i].checkin == null || this.attendanceTime[i].checkin == ''|| this.attendanceTime[i].checkout == null ||this.attendanceTime[i].checkout == ''){
          this.$message({
             message: this.attendanceTime[i].date+"的签到签退时间有误",
             type: 'warning'
           });
           return
        }
      }
      let _this = this
      setAttendance({
        course_id: this.openCourseId,
        sign_data: this.attendanceTime
      }, (res)=>{
        if(res.code == '200'){
          _this.setSignVisible = false
          this.getAttendanceList()
          this.getAttendance()
          this.$message({
             message: '设置成功',
             type: 'success'
           });
        }
      })
    },
    setSignTime(){
      this.setSignVisible = true
    },
    formatDate(t){
      return t.split(" ")[0]
    },
    formatTime(t){
      let f = t.split(" ")[1]
      let s = f.split(":")
      return s[0]+":"+s[1]

    },
    back(){
      this.$router.push({path: '/open-course/list'});
    },
    showList(type){
      this.type = type
      if(type == 1){
        this.customer = this.each_state_data.chidao_customer == null?[]:this.each_state_data.chidao_customer;
        this.customerTitle = "迟到人员("+this.customer.length+"人)"
      }else if(type == 2){
        this.customer = this.each_state_data.zaotui_customer == null?[]:this.each_state_data.zaotui_customer;
        this.customerTitle = "早退人员("+this.customer.length+"人)"
      }else if(type == 3){
        this.customer = this.each_state_data.kuangke_customer == null?[]:this.each_state_data.kuangke_customer;
        this.customerTitle = "旷课人员("+this.customer.length+"人)"
      }else if(type == 4){
        this.customer = this.each_state_data.queka_customer == null?[]:this.each_state_data.queka_customer;
        this.customerTitle = "缺卡人员("+this.customer.length+"人)"
      }

      for(let i=0; i<this.customer.length; i++){
        if(this.customer[i].sign_time != null && this.customer[i].sign_time.length > 0){
          for(let j=0; j<this.customer[i].sign_time.length; j++){
            //迟到
            if(this.customer[i].sign_time[j].sign_start.split(" ").length >1 && type == 1){
              let sign_start = Date.parse(new Date(this.customer[i].sign_time[j].sign_start))/1000
              let time_start = Date.parse(new Date(this.customer[i].sign_time[j].time_start))/1000
              this.customer[i].sign_time[j].chidao_minute = parseInt((sign_start - time_start)/60)

              this.customer[i].sign_time[j].sign_start =  this.customer[i].sign_time[j].sign_start.split(" ")[1]
            }
            //早退
            if(this.customer[i].sign_time[j].sign_end.split(" ").length >1 && type == 2){
              let sign_end = Date.parse(new Date(this.customer[i].sign_time[j].sign_end))/1000
              let time_end = Date.parse(new Date(this.customer[i].sign_time[j].time_end))/1000
              this.customer[i].sign_time[j].zaotui_minute = parseInt((time_end - sign_end)/60)

              this.customer[i].sign_time[j].sign_end =  this.customer[i].sign_time[j].sign_end.split(" ")[1]
            }
          }
        }
      }


      if(this.customer.length != 0){
        this.customerShow = true
      }
    },
    openAttendanceCode(){
      this.qrcode_value = '会务端签到地址'
      this.qrcode_visible = true
    },
    closeAttendanceCode(){
      this.qrcode_visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .wx-attendance-list{
    .setting-container{
      padding: 0 0 15px;
      display: flex;
      .time{
        flex: 2;
        line-height: 40px;
      }
      .btn{
        flex: 6;
        // text-align: right;
      }
    }
    .data-list{
      ul{
        padding-left: 0;
        overflow:hidden;
        margin-top: 0;
        li{
          list-style: none;
          float: left;
          font-weight: 600;
          margin-right: 15px;
          a{
            font-size: 25px;
          }
        }
      }
    }
    .back{
      display: inline-block;
      margin-bottom: 20px;
      color: #409EFF;
    }
    .customer-container{
      ul{
        li{
          list-style: none;
          padding: 8px 0;
          .list{
            color: #97a8be;
          }
        }
      }
    }
  }
</style>
