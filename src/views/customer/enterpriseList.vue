<template lang="html">
  <div class="wx-customer-enterprise-list">
    <el-form ref="form" :model="searchForm" :inline="true" label-width="80px">
      <el-form-item>
        <el-button size="medium" :loading="isDownload" @click="downloadExcle">导出Excle</el-button>
      </el-form-item>
      <el-form-item label="关键词:">
        <el-input v-model="searchForm.keyword" placeholder="企业名称/企业ID"></el-input>
      </el-form-item>
      <el-form-item label="状态:">
        <el-select v-model="searchForm.status" placeholder="选择企业状态">
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
      <el-table-column fixed prop="organization_id" label="企业ID" align="center" width="80px"></el-table-column>
      <el-table-column fixed label="企业logo" width="100px" align="center">
        <template slot-scope="scope">
          <init-image v-if="scope.row.organization_logo" :src="scope.row.organization_logo"
          :width="80" :height="80"></init-image>
        </template>
      </el-table-column>
      <el-table-column fixed prop="organization_name" align="center" label="企业名称"></el-table-column>
      <el-table-column label="行业" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.tags}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="city" label="城市" align="center"></el-table-column>
      <el-table-column prop="phone" label="主管理员账号(手机)" align="center"></el-table-column>
      <el-table-column prop="work_num" label="员工(人)" align="center"></el-table-column>
      <el-table-column prop="status_name" label="状态" align="center"></el-table-column>
      <!-- <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column> -->
    </el-table>
  </div>
</template>

<script>
import initImage from 'components/common/Image.vue'
import {getEnterpriseList} from 'service/customer.js'
const test = [
  {
    organization_id: '123',
    organization_name: '我是企业名称',
    organization_logo: '/img/2017-12-15_14:53:24:230.png',
    tags: '我是行业标签',
    city: '合肥',
    phone: '18666666666',
    work_num: '18',
    status: '1',
    status_name: '已启用'
  },
  {
    organization_id: '12',
    organization_name: '我是企业名称',
    organization_logo: '/img/2017-12-15_14:53:24:230.png',
    tags: '我是行业标签',
    city: '合肥',
    phone: '18666666666',
    work_num: '18',
    status: '0',
    status_name: '已禁用'
  },

]
export default {
  name: 'wx-customer-enterprise-list',
  components: {
    initImage
  },
  data () {
    return {
      lists: test, // 企业列表数据
      page: 1,
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
  mounted () {},
  methods: {
    onSearch() {

    },
    downloadExcle() {
      this.isDownload = true
      // 下载成功后改成为false
      setTimeout(() => {
        this.isDownload = false
      }, 2000)
    }
  },
}
</script>

<style lang="css">
</style>
