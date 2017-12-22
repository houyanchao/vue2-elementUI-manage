<template>
  <div class="wx-index">
    <el-alert v-if="changePwdVisible" title="为了你的账号安全，建议你修改掉初始密码" type="warning" close-text="暂不修改" class="init-pwd-alert" @close="closeChangePwd"><a class="init-pwd" @click="changeInitPwd">&nbsp;&nbsp;去修改</a></el-alert>
  </div>
</template>

<script>
export default {
  name: 'wx-index',
  data(){
    return {
      changePwdVisible: false,
    }
  },
  mounted(){
    let is_change_pass = window.localStorage.getItem('is_change_pass')
    if(is_change_pass == 'N'){
      this.changePwdVisible = true
    }
  },
  methods: {
    changeInitPwd(){
      this.$router.push({path: '/password/update'});
    },
    closeChangePwd(){
      this.changePwdVisible = false
      localStorage.removeItem('is_change_pass');
    }
  }
}
</script>

<style lang="scss" scoped>
  .wx-index{
    .init-pwd-alert{
      .el-icon-warning{
        font-size: 12px!important;
      }
      .init-pwd{
        font-size: 12px;
        color: #3385ff;
      }
    }

  }

</style>
