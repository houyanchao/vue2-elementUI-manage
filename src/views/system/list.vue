<template>
  <div class="wx-ticket-customer">
    <div class="search-container">
      <el-button type="success" icon="el-icon-circle-plus-outline" @click="createTicket">添加学习卡</el-button>
      <el-button type="info" @click="exportExcel">导出excel</el-button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <el-input placeholder="客户名称/管理员账号" v-model="searchData.keyword" class="width_300">
        <template slot="prepend">关键词</template>
      </el-input>
      <el-select v-model="searchData.status" placeholder="状态" clearable>
       <el-option label="已启用" value="1"></el-option>
       <el-option label="已停用" value="0"></el-option>
     </el-select>
     <el-button type="primary" @click="searchBtn">查询</el-button>
    </div>
    <el-table
      :data="list"
      stripe
      border
      style="width: 100%"
      empty-text="暂无数据">
      <el-table-column
        fixed
        type="index"
        label="序号"
        width="80"
        align="center">
      </el-table-column>
      <!-- <el-table-column
        prop="organization_id"
        label="企业ID"
        width="120">
      </el-table-column> -->
      <el-table-column
        label="企业logo"
        width="120">
        <template slot-scope="scope">
          <wx-image :src="scope.row.logo" :width="80" :height="80"></wx-image>
        </template>
      </el-table-column>
      <el-table-column
        prop="organization_name"
        label="企业名称"
        width="120">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="主管理员账号(电话)">
      </el-table-column>
      <el-table-column
        prop="ticket_total"
        label="可用门票数">
      </el-table-column>
      <el-table-column
        prop="expire_ticket_total"
        label="即将过期门票数">
      </el-table-column>
      <el-table-column
        label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status == '1'">已启用</span>
          <span v-if="scope.row.status == '2'">已停用</span>
        </template>
      </el-table-column>

      <el-table-column
        fixed="right"
        label="操作"
        width="200">
        <template slot-scope="scope">
          <el-button size="mini" @click="ticketList(scope.row)">学习卡明细</el-button>
          <!-- <a href="javascript:void(0)" style="color:#66b1ff" @click="editTeacher(scope.row)">编辑</a>&nbsp;&nbsp;
          <a href="javascript:void(0)" style="color:#66b1ff" @click="teacherDetail(scope.row)">查看</a>&nbsp;&nbsp;
          <a href="javascript:void(0)" style="color:#66b1ff" @click="changeStatus(scope.row)">
            <template v-if="scope.row.status == '2'">启用</template>
            <template v-if="scope.row.status == '1'">停用</template>
          </a>&nbsp;&nbsp;
          <a href="javascript:void(0)" style="color:#66b1ff" @click="showDisableReason(scope.row.message)" v-if="scope.row.status == '3'">禁用原因</a>&nbsp;&nbsp; -->
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
    <!-- 新增学习卡 -->
    <create-ticket :visible="createTicketVisible" @close="closeCreateTicket" @success="addTicketSuccess"></create-ticket>
  </div>
</template>

<script>

  import wxImage from 'components/common/Image.vue'
  import CreateTicket from '@/components/ticket/CreateTicket'
  import {customerList, exportFile} from '@/service/ticket'

  export default {
    name: 'wx-ticket-customer',
    data(){
      return {
        searchData: {
          keyword: '',
          status: '',
          export: 0,
          page: 1,
          pre_page: 10
        },
        list: [],
        total: 0,
        createTicketVisible: false
      }
    },
    components: {CreateTicket, wxImage},
    mounted(){
      this.get()
    },
    methods: {
      searchBtn(){
        this.searchData.page = 1
        this.get()
      },
      handleCurrentChange(currentPage){
        this.searchData.page = currentPage
        this.get()
      },
      get(){
        var _this = this
        this.searchData.export = 0
        customerList(this.searchData, function(res){
            if(res.code == '200'){
              _this.list = res.data.data
              _this.total = Number(res.data.total)
            }
        })
      },
      createTicket(){
        this.createTicketVisible = true
      },
      addTicketSuccess(ticket){
        this.closeCreateTicket()
        this.get()
      },
      closeCreateTicket(){
        this.createTicketVisible = false
      },
      ticketList(row){
        let organization_id = encodeURIComponent(row.organization_id)
        let organization_name = encodeURIComponent(row.organization_name)
        this.$router.push({path: '/ticket/list', query: { organization_id: organization_id, organization_name: organization_name}});
      },
      exportExcel(){
        this.searchData.export = 1
        __tool.exportFile("/v1/agency/ticket/customer_list", this.searchData)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .wx-ticket-customer{
    .search-container{
      padding: 0 0 20px;
    }
  }
</style>
