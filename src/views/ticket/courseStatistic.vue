<!-- 参课统计 -->
<template>
  <div class="wx-course-statistic">
    <a href="javascript:void(0)" class="back" @click="back"><<返回客户列表页</a>
    <el-table
      :data="list"
      border
      style="width: 100%"
      sum-text="合计"
      empty-text="暂无数据">
      <el-table-column
        prop="ticket_id"
        label="课程类型"
        width="140">
      </el-table-column>
      <el-table-column
        prop="ticket_total"
        label="课程名称"
        width="200">
      </el-table-column>
      <el-table-column
        prop="ticket_used"
        label="课程状态"
        width="100">
      </el-table-column>
      <el-table-column
        label="开课时间"
        width="300">
        <template slot-scope="scope">
          {{scope.row.ticket_total-scope.row.ticket_used}}
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="参课人数">
        <template slot-scope="scope">
          <a href="javascript:void(0)" class="join-num" @click="createTicket">6</a>
        </template>
      </el-table-column>
    </el-table>
    <!-- 参课人员列表 -->
    <attending-student :visible="createTicketVisible" :ticket_id="ticket_id"  @close="closeCreateTicket" @success="addTicketSuccess" @update-success="updateTicketSuccess"></attending-student>
  </div>
</template>

<script>

  import AttendingStudent from '@/components/ticket/AttendingStudent'
  import {ticketList} from '@/service/ticket'

  export default {
    name: 'wx-ticket-list',
    data(){
      return {
        ticket_id: '',
        searchData: {
        },
        list: [],
        total: 0,
        use_total: 0,
        total_use_total: 0,
        createTicketVisible: false,
        activationVisible: false
      }
    },
    components: {AttendingStudent},
    mounted(){
      // if(this.$route.query.organization_id != undefined){
      //   this.searchData.organization_id = decodeURIComponent(this.$route.query.organization_id)
      //   this.get()
      // }
    },
    methods: {
      getSummaries(param){
         const sums = [];
         sums[0] = '合计'
         sums[1] = this.total
         sums[2] = this.use_total
         sums[3] = this.total_use_total
         return sums;
      },
      get(){
        var _this = this
        ticketList(this.searchData, function(res){
            if(res.code == '200'){
              _this.list = res.data.list
              _this.total = res.data.total
              _this.use_total = res.data.use_total
              _this.total_use_total =   _this.total - _this.use_total
            }
        })
      },
      createTicket(){
        this.ticket_id = ""
        this.createTicketVisible = true
      },
      addTicketSuccess(ticket){
        this.closeCreateTicket()
        this.get()
      },
      updateTicketSuccess(ticket){
        this.closeCreateTicket()
        this.get()
      },
      closeCreateTicket(){
        this.createTicketVisible = false
      },
      ticketUpdate(row){
        this.createTicketVisible = true
        this.ticket_id = row.ticket_id
      },
      activateTicketSuccess(){
        this.closeActivationTicket()
        this.get()
      },
      ticketActivation(row){
        this.activationVisible = true
        this.ticket_id = row.ticket_id
      },
      closeActivationTicket(){
        this.activationVisible = false
      },
      back(){
        this.$router.back(-1)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .wx-course-statistic{
    .join-num{
      color: #409EFF;
    }
    .back{
      display: inline-block;
      margin-bottom: 20px;
      color: #409EFF;
    }
  }
</style>
