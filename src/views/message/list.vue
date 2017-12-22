<template>
  <div class="wx-ticket-customer">
    <div class="search-container">
      <el-button type="success" icon="el-icon-view" @click="createTicket">一键已读</el-button>
    </div>
    <el-table
      :data="list"
      stripe
      border
      style="width: 100%"
      empty-text="暂无数据">
      <el-table-column
        prop="status"
        label="状态"
        width="120">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="发送时间">
      </el-table-column>
      <el-table-column
        prop="ticket_total"
        label="消息主题">
      </el-table-column>
      <el-table-column
        prop="expire_ticket_total"
        label="消息内容">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="200">
        <template slot-scope="scope">
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
  </div>
</template>

<script>
  import {getMessageList} from '@/service/message'
  export default {
    name: 'wx-ticket-customer',
    data(){
      return {
        searchData: {
          page: 1,
          pre_page: 10
        },
        list: [],
        total: 0,
      }
    },
    components: {},
    mounted(){
      this.get()
    },
    methods: {
      handleCurrentChange(currentPage){
        this.searchData.page = currentPage
        this.get()
      },
      get(){
        var _this = this
        getMessageList(this.searchData, function(res){
            if(res.code == '200'){
              _this.list = res.data.data
              _this.total = Number(res.data.total)
            }
        })
      },
      createTicket(){
        alert(2)
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
