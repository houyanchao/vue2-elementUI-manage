<template>
  <div class="wx-update-password">
    <el-form :model="pwdForm" :rules="pwdRules" ref="pwdForm">
      <el-form-item label="当前密码" label-width="100px" prop="pwd1" required>
        <el-input v-model="pwdForm.pwd1" auto-complete="off" class="width_300" placeholder="请输入原密码" type="password"></el-input>
      </el-form-item>
      <el-form-item label="新密码" label-width="100px" required>
        <el-form-item prop="pwd2">
          <el-input v-model="pwdForm.pwd2" auto-complete="off" class="width_300" placeholder="请输入新密码" type="password"></el-input>
        </el-form-item>
        <el-form-item prop="pwd2Inp" class="pwd-inp">
          <el-input v-model="pwdForm.pwd2Inp" style="visibility: hidden;"></el-input>
        </el-form-item>
      </el-form-item>
      <el-form-item label="确认密码" label-width="100px" required>
        <el-form-item prop="pwd3">
          <el-input v-model="pwdForm.pwd3" auto-complete="off" class="width_300" placeholder="请输入新密码" type="password"></el-input>
        </el-form-item>
        <el-form-item prop="pwd3Inp" class="pwd-inp">
          <el-input v-model="pwdForm.pwd3Inp" style="visibility: hidden;"></el-input>
        </el-form-item>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="submitForm('pwdForm')">提交</el-button>
  </div>
</template>

<script>

import {updateAdminPwd, updatePwd} from '@/service/default'

export default {
  name: 'wx-update-password',
  data() {
    var validatePwd1 = (rule, value, callback)=>{
      if (!value) {
        return callback(new Error('请输入原密码'));
      }else{
        return callback();
      }
    };
    var validatePwd2 = (rule, value, callback)=>{
      if (!value) {
        this.pwdForm.pwd2Inp = "111"
        this.pwdForm.pwd3Inp = "111"
        return callback(new Error('请输入新密码'));
      }else if(this.pwdForm.pwd3 != "" && value!=this.pwdForm.pwd3){
        this.pwdForm.pwd3Inp = ""
        this.pwdForm.pwd2Inp = ""
        return callback();
      }else{
        this.pwdForm.pwd2Inp = value
        this.pwdForm.pwd3Inp = value
        return callback();
      }
    };
    var validatePwd3 = (rule, value, callback)=>{
      if (!value) {
        this.pwdForm.pwd3Inp = "111"
        this.pwdForm.pwd2Inp = "111"
        return callback(new Error('请输入新密码'));
      }else if(this.pwdForm.pwd2 != "" && value!=this.pwdForm.pwd2){
        this.pwdForm.pwd3Inp = ""
        this.pwdForm.pwd2Inp = ""
        return callback();
      }else{
        this.pwdForm.pwd2Inp = value
        this.pwdForm.pwd3Inp = value
        return callback();
      }
    };
    return {
      pwdForm: {
        changePasswordDialog: false,
        pwd1: '',
        pwd2: '',
        pwd2Inp: 'h',
        pwd3: '',
        pwd3Inp: 'h'
      },
      pwdRules: {
        pwd1: [
          { validator: validatePwd1, trigger: 'blur' }
        ],
        pwd2: [
          { validator: validatePwd2, trigger: 'blur' }
        ],
        pwd2Inp: [
          { required: true, message: '两次密码输入不一致', trigger: 'change' }
        ],
        pwd3: [
          { validator: validatePwd3, trigger: 'blur' }
        ],
        pwd3Inp: [
          { required: true, message: '两次密码输入不一致', trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
  },
  methods: {
    submitForm(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.pwdForm.pwd1 == this.pwdForm.pwd2){
            this.$message({
              message: '新密码不能和旧密码相同',
              type: 'warning'
            });
          }else{
            let platform = localStorage.getItem("platform")
            if(platform == "agency_admin"){
              updateAdminPwd({
                old_password: this.pwdForm.pwd1,
                new_password:  this.pwdForm.pwd2
              }, (res)=>{
                if(res.code == '200'){
                  this.$message({
                    message: '修改密码成功',
                    type: 'success'
                  });
                  localStorage.removeItem("is_change_pass")
                  localStorage.removeItem("agency_admin_token")
                  this.$router.push({path: '/login-admin'})
                }
              }, (err)=>{
                this.$message.error(err.message);
              })
            }else{
              updatePwd({
                old_password: this.pwdForm.pwd1,
                new_password:  this.pwdForm.pwd2
              }, (res)=>{
                if(res.code == '200'){
                  this.$message({
                    message: '修改密码成功',
                    type: 'success'
                  });
                  localStorage.removeItem("is_change_pass")
                  localStorage.removeItem("agency_token")
                  this.$router.push({path: '/login'})
                }
              }, (err)=>{
                this.$message.error(err.message);
              })
            }
          }
        }
      });
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .wx-update-password{
    .pwd-inp{
      .el-form-item__content{
        height: 1px;
      }
    }
    button{
      margin-left: 98px;
    }
  }

</style>
