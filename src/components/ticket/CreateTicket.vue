<template>
  <div class="wx-create-ticket-dialog">
    <el-dialog :title="title" :visible="visible" class="dialog-container" @close="close">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="分公司名" required v-if="isAdmin">
          <el-select v-model="agencyId" clearable placeholder="请选择所属分公司" class="width_400">
            <el-option
              v-for="item in agencys"
              :key="item.agency_id"
              :label="item.agency_name"
              :value="item.agency_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业ID" prop="organization_id">
          <el-input v-model="ruleForm.organization_id" class="width_400" placeholder="请输入企业ID" v-if="organization_id == '' && ticket_id == ''"></el-input>
          <span class="width_400" v-if="organization_id != '' || ticket_id != ''">{{ruleForm.organization_id}}</span>
        </el-form-item>
        <el-form-item label="合同编码" prop="contract">
          <el-input v-model="ruleForm.contract" class="width_400" placeholder="请输入合同编号"></el-input>
        </el-form-item>
        <el-form-item label="合同金额" prop="price_total">
          <el-input v-model="ruleForm.price_total" class="width_400" placeholder="请输入合同金额（单位：元）"></el-input>
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

  import wxImage from 'components/common/Image.vue'
  import {createTicket, getTicket, updateTicket} from '@/service/ticket'
  import {getAgency} from '@/service/default'

  export default {
    name: 'wx-teacher-detail',
    data() {
      var price_total = (rule, value, callback)=>{
        const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
        if(value != ""){
          if (!reg.test(value)) {
            callback(new Error('请输入有效的合同金额'));
          } else {
              callback()
          }
        }else{
          callback(new Error('请输入合同金额'));
        }
      };
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
        title: '添加学习卡',
        isAdmin: false,
        agencyId: '',//分公司id
        agencys: [],//分公司数组
        ruleForm: {
          organization_id: '',
          contract: '',
          price_total: '',
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
          price_total: [
            { required: true, validator: price_total, trigger: 'change' },
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
          if(this.ticket_id != ""){
            this.getTicket()
          }
        }else{
          if(this.organization_id == ""){
            this.ruleForm.organization_id = ""
          }
          this.ruleForm.contract = ""
          this.ruleForm.price_total = ""
          this.ruleForm.ticket_total = ""
          this.ruleForm.expire_time = ""
          this.agencyId = ""
        }
      },
      organization_id(c,o){
        this.ruleForm.organization_id = c
      },
      ticket_id(c, o){
        this.ruleForm.ticket_id = c
        if(c != ""){
          this.title = "修改学习卡"
        }else{
          this.title = "添加学习卡"
        }
      }
    },
    computed: {},
    components: {wxImage},
    mounted(){
      this.isAdmin = __tool.isAdmin()
      if(this.isAdmin){
        this.getAgency()
      }
    },
    methods: {
      close(){
        this.$emit("close")
      },
      submitForm(formName){
        if(this.isAdmin){
          if(this.agencyId == ""){
            this.$message({
               message: '请选择学习卡所属分公司',
               type: 'warning'
             });
             return
          }
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.create()
          }
        });
      },
      create(){
        let _this = this
        let params = JSON.parse(JSON.stringify(this.ruleForm))
        params.price_total = params.price_total*100
        if(this.isAdmin){
          params.agency_id = this.agencyId
        }
        if(this.ruleForm.ticket_id != ""){
          updateTicket(params, (res)=>{
            if(res.code == '200'){
              _this.$message.success("修改成功");
              _this.$emit("update-success", {ticket_id: this.ruleForm.ticket_id})
            }else{
              _this.$message.error(res.message);
            }
          }, function(res){
            _this.$message.error(res.message);
          })
        }else{
          createTicket(params, function(res){
            if(res.code == '200'){
              _this.$message.success("添加成功");
              _this.$emit("success", {ticket_id: res.data.ticket_id})
            }else{
              _this.$message.error(res.message);
            }
          }, function(res){
            _this.$message.error(res.message);
          })
        }
      },
      getTicket(){
        getTicket({
          ticket_id: this.ticket_id
        }, (res)=>{
          if(res.code == '200' && res.data != null && res.data.length != 0){
            this.ruleForm.organization_id = res.data[0].organization_id
            this.ruleForm.contract = res.data[0].contract
            this.ruleForm.price_total = res.data[0].price_total/100
            this.ruleForm.ticket_total = res.data[0].ticket_total
            this.ruleForm.expire_time = res.data[0].expire_time
            this.agencyId = res.data[0].agency_id
          }
        })
      },
      getAgency(){
        getAgency({}, (res)=>{
          if(res.code == '200'){
            this.agencys = res.data
          }
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
