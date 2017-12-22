<template lang="html">
  <div class="wx-customer-enterprise-list">
    <el-form ref="form" :model="searchForm" :inline="true" label-width="80px">
      <el-form-item>
        <el-button size="medium" :loading="isDownload" @click="downloadExcle">导出Excle</el-button>
      </el-form-item>
      <el-form-item label="关键词:">
        <el-input v-model="searchForm.keyword" placeholder="用户名称/用户ID"></el-input>
      </el-form-item>
      <el-form-item label="状态:">
        <el-select v-model="searchForm.status" placeholder="选择用户状态">
          <el-option :label="'启用'" :value="'1'"></el-option>
          <el-option :label="'禁用'" :value="'0'"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">查 询</el-button>
      </el-form-item>
    </el-form>
    <el-table class="open-course-list" v-loading="isLoading" :data="lists"
      border :empty-text="'暂无数据'" :stripe="true">
      <el-table-column fixed type="index" label="序号" align="center" width="60"></el-table-column>
      <el-table-column fixed prop="organization_id" label="用户ID" align="center" width="80px"></el-table-column>
      <el-table-column fixed label="用户头像" width="100px" align="center">
        <template slot-scope="scope">
          <init-image v-if="scope.row.organization_logo" :src="scope.row.organization_logo"
          :width="80" :height="80"></init-image>
        </template>
      </el-table-column>
      <el-table-column fixed prop="organization_name" align="center" label="用户名称"></el-table-column>
      <el-table-column prop="city" label="城市" align="center"></el-table-column>
      <el-table-column prop="phone" label="用户账号" align="center"></el-table-column>
      <el-table-column prop="status_name" label="状态" align="center"></el-table-column>
      <!-- <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <div class="pagination" v-if="total > 0">
      <el-pagination layout="prev, pager, next" :total="total" @current-change="pageChage"></el-pagination>
    </div>
  </div>
</template>

<script>
import {getUserList} from 'service/customer.js'
import initImage from 'components/common/Image.vue'

export default {
  name: 'wx-customer-enterprise-list',
  components: {
    initImage
  },
  data () {
    return {
      lists: [], // 用户列表数据
      page: '1',
      total: 0,
      searchForm: {
        keyword: '',
        status: '0', // 0:禁用 1:启用
      },
      isLoading: false,
      isDownload: false,
    }
  },
  computed: {},
  mounted () {
    this.getList()
  },
  methods: {
    onSearch() {

    },
    downloadExcle() {
      this.isDownload = true
      // 下载成功后改成为false
      setTimeout(() => {
        this.isDownload = false
      }, 2000)
    },
    pageChage(size) {
      this.isLoading = true
      this.page = size
      this.getList()
    },
    getList() {
      getUserList(
        {
          keyword: this.searchForm.keyword,
          status: this.searchForm.status,
        },
        (res) => {
          console.log(res, 'chenggong');
          this.total = res.data.total
        },
        (res) => {
          this.lists = res
          console.log(res, '后面需要改service');
        }
      )
    }
  },
}
</script>

<style lang="scss">
</style>
