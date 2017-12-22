<template>
  <div class="login-container">
    <el-form autoComplete="on" ref="loginForm" :model="loginForm"
      :rules="loginRules" label-position="left" label-width="0px" class="login-form">
      <h3 class="title">微学机构端（超级管理员）</h3>
      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <icon-svg icon-class="yonghuming" />
        </span>
        <el-input name="username" type="text" v-model="loginForm.username"
          :maxlength="11" :autofocus="true" placeholder="请输入账号">
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <icon-svg icon-class="mima"></icon-svg>
        </span>
        <el-input name="password" type="password" v-model="loginForm.password"
          placeholder="请输入密码">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width:100%;"
          @click.native.prevent="handleLogin" @keyup.enter="handleLogin">登录
        </el-button>
      </el-form-item>
      <div class='tips'>
        <!-- <el-checkbox v-model="isRemember">记住我</el-checkbox> -->
        <span class="remember" @click="remember">忘记密码?</span>
      </div>
    </el-form>

    <el-dialog title="忘记密码" :visible.sync="isShowDialog">
      {{dialogContent}}
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'login',
  data() {
    return {
      lastUrl: '',
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '账号不能为空' }],
        password: [{ required: true, trigger: 'blur', message: '密码不能为空' }]
      },
      // isRemember: false,
      isShowDialog: false,
      dialogContent: ''
    }
  },
  mounted () {
    this.getQuery()
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          __request.post({
            url: 'v1/agency/auth/admin_login',
            params: {
              username: this.loginForm.username,
              password: this.loginForm.password,
            },
            success: (res) => {
              this.handleData(res.data)
            },
            error: (res) => {
              if(res.data) {
                this.$message(res.data);
              }
              else {
                this.$message(res.message);
              }
            }
          })
        }
      })
    },

    handleData(data) {
      __tool.setLocalStorage('agency_admin_token', data.agency_admin_token)
      __tool.setLocalStorage('agency_admin_id', data.agency_admin_id)
      __tool.setLocalStorage('platform', data.platform)
      __tool.setLocalStorage('is_change_pass', data.is_change_pass)
      __tool.setLocalStorage('username', this.loginForm.username)
      if (this.lastUrl) {
        window.location.href = decodeURI(this.lastUrl)
      }
      else {
        this.$router.push('index')
      }
    },

    remember() {
      this.isShowDialog = true
      this.dialogContent = '请电话联系客服人员123456789'
    },
    getQuery() {
      this.lastUrl = this.$route.query.last_url || ''
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  @import "src/styles/mixin.scss";
  $bg:#2d3a4b;
  $dark_gray:#889aa4;
  $light_gray:#eee;

  .login-container {
    @include relative;
    height: 100vh;
    background-color: $bg;
    input:-webkit-autofill {
      -webkit-box-shadow: 0 0 0px 1000px #293444 inset !important;
      -webkit-text-fill-color: #fff !important;
    }
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
    }
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;
    }
    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;
    }
    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
      &_login {
        font-size: 20px;
      }
    }
    .title {
      font-size: 26px;
      font-weight: 400;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .login-form {
      position: absolute;
      left: 0;
      right: 0;
      width: 400px;
      padding: 35px 35px 15px 35px;
      margin: 120px auto;
    }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
    }
    .thirdparty-button{
      position: absolute;
      right: 35px;
      bottom: 28px;
    }
    .remember {
      color: #5a5e66;
      float: right;
    }
  }
</style>
