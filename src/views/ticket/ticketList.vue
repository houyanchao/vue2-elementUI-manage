<template>
  <div class="wx-ticket-list">
    <a href="javascript:void(0)" class="back" @click="back"><<返回客户列表页</a>
    <div class="search-container">
      <el-button type="success" icon="el-icon-circle-plus-outline" @click="createTicket">添加学习卡</el-button>
    </div>
    <el-table
      :data="list"
      stripe
      border
      style="width: 100%"
      :summary-method="getSummaries"
      show-summary
      sum-text="合计"
      empty-text="暂无数据">
      <el-table-column :label="title">
        <el-table-column
          prop="ticket_id"
          label="ID"
          width="120">
        </el-table-column>
        <el-table-column
          prop="ticket_total"
          label="门票总数"
          width="120">
        </el-table-column>
        <el-table-column
          prop="ticket_used"
          label="消费总数"
          width="120">
        </el-table-column>
        <el-table-column
          label="剩余总数"
          width="120">
          <template slot-scope="scope">
            {{scope.row.ticket_total-scope.row.ticket_used}}
          </template>
        </el-table-column>
        <el-table-column
          prop="contract"
          label="合同编号"
          width="120">
        </el-table-column>
        <el-table-column
          prop="expire_time"
          label="到期时间"
          width="120">
        </el-table-column>
        <el-table-column
          prop="source"
          label="来源"
          width="120">
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          width="120">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="ticketUpdate(scope.row)">修改</el-button>
            <el-button size="mini" type="success" @click="ticketActivation(scope.row)" v-if="scope.row.is_expire == '1'">激活</el-button>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <!-- 新增学习卡 -->
    <create-ticket :visible="createTicketVisible" :organization_id="searchData.organization_id" :ticket_id="ticket_id"  @close="closeCreateTicket" @success="addTicketSuccess" @update-success="updateTicketSuccess"></create-ticket>
    <activate-ticket :visible="activationVisible" :organization_id="searchData.organization_id" :ticket_id="ticket_id" @close="closeActivationTicket" @success="activateTicketSuccess"></activate-ticket>
  </div>
</template>

<script>

  import CreateTicket from '@/components/ticket/CreateTicket'
  import ActivateTicket from '@/components/ticket/ActivateTicket'
  import {ticketList} from '@/service/ticket'

  export default {
    name: 'wx-ticket-list',
    data(){
      return {
        title: '',
        ticket_id: '',
        searchData: {
          organization_id: '',
        },
        list: [],
        total: 0,
        use_total: 0,
        total_use_total: 0,
        createTicketVisible: false,
        activationVisible: false
      }
    },
    components: {CreateTicket, ActivateTicket},
    mounted(){
      if(this.$route.query.organization_id != undefined){
        this.searchData.organization_id = decodeURIComponent(this.$route.query.organization_id)
        this.get()
      }
      if(this.$route.query.organization_name != undefined){
        this.title = "客户名称: "+decodeURIComponent(this.$route.query.organization_name)
      }
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
  .wx-ticket-list{
    .search-container{
      padding: 0 0 20px;
    }
    .back{
      display: inline-block;
      margin-bottom: 20px;
      color: #409EFF;
    }
  }
</style>
