<template>
  <div class="wx-create-ticket-dialog">
    <el-dialog title="激活门票" :visible="visible" class="dialog-container" @close="close">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="企业ID" prop="organization_id">
          <el-input v-model="ruleForm.organization_id" class="width_400" placeholder="请输入企业ID" v-if="organization_id == '' && ticket_id == ''"></el-input>
          <span class="width_400" v-if="organization_id != '' || ticket_id != ''">{{ruleForm.organization_id}}</span>
        </el-form-item>
        <el-form-item label="合同编码" prop="contract">
          <el-input v-model="ruleForm.contract" class="width_400" placeholder="请输入合同编号"></el-input>
        </el-form-item>
        <el-form-item label="门票数" prop="ticket_total">
          <el-input v-model="ruleForm.ticket_total" class="width_400" placeholder="请输入门票总数"></el-input>
        </el-form-item>
        <el-form-item label="截止日期" required prop="expire_time">
            <el-form-item class="width_400">
              <el-date-picker type="date" placeholder="选择截止时间" v-model="ruleForm.expire_time" style="width: 100%;" format="yyyy 年 MM 月 dd 日"
        value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
        </el-form-item>
        <el-form-item>
         <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
       </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>

  import {activateTicket} from '@/service/ticket'

  export default {
    name: 'wx-teacher-detail',
    data() {
      var ticket_total = (rule, value, callback)=>{
        const reg = /^[1-9]\d*$/;
        if(value != ""){
          if (!reg.test(value)) {
            callback(new Error('请输入有效的门票数'));
          } else {
              callback()
          }
        }else{
          callback(new Error('请输入门票数'));
        }
      };
      return {
        ruleForm: {
          organization_id: '',
          contract: '',
          ticket_total: '',
          expire_time: '',
          ticket_id: ''
        },
        rules: {
          organization_id: [
            { required: true, message: '请输入企业id', trigger: 'change' }
          ],
          contract: [
            { required: true, message: '请输入合同编码', trigger: 'change' }
          ],
          ticket_total: [
            { required: true, validator: ticket_total, trigger: 'change' },
          ],
          expire_time: [
            { required: true, message: '请选择截止日期', trigger: 'blur' }
          ]
        }
      };
    },
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      organization_id: {
        type: String,
        default: ''
      },
      ticket_id: {
        type: String,
        default: ''
      }
    },
    watch: {
      visible(c,o){
        if(c){
          //获取门票详情
        }else{
          this.ruleForm.contract = ""
          this.ruleForm.ticket_total = ""
          this.ruleForm.expire_time = ""
        }
      },
      organization_id(c,o){
        this.ruleForm.organization_id = c
      },
      ticket_id(c, o){
        this.ruleForm.ticket_id = c
      }
    },
    computed: {},
    mounted(){},
    methods: {
      close(){
        this.$emit("close")
      },
      submitForm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.activate()
          }
        });
      },
      activate(){
        let _this = this
        this.ruleForm.organization_id = this.organization_id
        let params = JSON.parse(JSON.stringify(this.ruleForm))
        activateTicket(params, (res)=>{
          if(res.code == '200'){
            _this.$message.success("激活成功");
            _this.$emit("success")
          }else{
            _this.$message.error(res.message);
          }
        }, function(res){
          _this.$emit("success")
          _this.$message.error(res.message);
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" >
  .wx-create-ticket-dialog{
    .dialog-container{

    }
  }
</style>
