<template>
  <el-menu class="wx-navbar" mode="horizontal" style="background-color: #eef1f6;">
    <levelbar></levelbar>
    <div class="message-container" @click="messages">
      <el-badge :value="3" class="item" >
        <a class="el-icon-message" href="javascript:void(0)"></a>
      </el-badge>
    </div>
    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <div>{{username}}</div>
        <i class="el-icon-caret-bottom"></i>
      </div>
      <el-dropdown-menu class="user-dropdown" slot="dropdown">
        <el-dropdown-item divided><span @click="updatePwd" style="display:block;">修改密码</span></el-dropdown-item>
        <el-dropdown-item divided><span @click="logout" style="display:block;">退出</span></el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-menu>
</template>

<script>
import Levelbar from './Levelbar'

export default {
  data(){
    return {
      username: ''
    }
  },
  components: {
    Levelbar
  },
  computed: {},
  mounted(){
    this.username = __tool.getLocalStorage("username")
  },
  methods: {
    logout() {
      let platform = __tool.getLocalStorage('platform') || ''
      let url = ''
      if(platform == 'agency_admin'){
        url = '/login-admin'
      }else{
        url = '/login'
        localStorage.removeItem('');
      }
      localStorage.removeItem('agency_admin_token');
      localStorage.removeItem('agency_admin_id');
      localStorage.removeItem('agency_token');
      localStorage.removeItem('manage_id');
      localStorage.removeItem('platform');
      localStorage.removeItem('username');

      this.$router.push({path: url});
    },
    updatePwd(){
      this.$router.push({path: '/password/update'})
    },
    messages(){
      this.$router.push({path: '/message/list'})
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .wx-navbar {
        height: 50px;
        line-height: 50px;
        border-radius: 0px !important;
        .el-dropdown-menu{
          padding: 0;
        }
        .hamburger-container {
            line-height: 58px;
            height: 50px;
            float: left;
            padding: 0 10px;
        }
        .errLog-container {
            display: inline-block;
            position: absolute;
            right: 150px;
        }
        .screenfull {
            position: absolute;
            right: 90px;
            top: 16px;
            color: red;
        }
        .message-container{
          position: absolute;
          height: 30px;
          width: 30px;
          right: 22px;
          top: 5px;
          display: inline-block;
          .el-badge{
            width: 30px;
            height: 30px;
          }
          .el-icon-message{
            position: absolute;
            font-size: 24px;
            padding: 0;
            border: none;
          }
        }
        .avatar-container {
            height: 50px;
            display: inline-block;
            position: absolute;
            right: 90px;
            .avatar-wrapper {
                cursor: pointer;
                margin-top: 5px;
                position: relative;
                .user-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                }
                .el-icon-caret-bottom {
                    position: absolute;
                    right: -20px;
                    top: 20px;
                    font-size: 12px;
                }
            }
        }
    }
    .user-dropdown{
      padding: 0;

      // right: 45px!important;

      .el-dropdown-menu__item{
        margin-top: 0;
      }
    }
</style>
