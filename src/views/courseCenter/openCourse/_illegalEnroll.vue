<template lang="html">
  <el-dialog class="illegal-enroll-dialog" title="后台报名"
    :visible="isShowIllegalEnroll" @close="close" :width="'40%'">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="学员姓名" prop="name" class="width_400">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="学员手机号" prop="telephone" class="width_400">
        <el-input v-model="ruleForm.telephone" @blur="getCompany"></el-input>
      </el-form-item>
      <el-form-item label="报名费用" required>
        <el-col :span="6">
          <el-form-item>
            <el-radio-group v-model="ruleForm.isPrice">
              <el-radio :label="false">免费</el-radio>
              <el-radio :label="true">需费用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="5" v-if="ruleForm.isPrice">
          <el-form-item prop="price">
            <el-input v-model="ruleForm.price"
              class="width_200" placeholder="请输入费用,免费可不填">
            </el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="个人报名" required>
        <el-col :span="8">
          <el-form-item prop="isPersonal">
            <el-radio-group v-model="ruleForm.isPersonal">
              <el-radio :label="true">个人报名</el-radio>
              <el-radio :label="false" :disabled="ruleForm.isPersonal ? true : false">企业报名</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="!ruleForm.isPersonal">
          <el-form-item prop="enterpriseName">
            <el-select  v-model="ruleForm.enterpriseName" placeholder="请选择企业名称">
              <el-option v-for="company,index in ruleForm.companys" :key="index"
              :label="company.organization_name" :value="company.organization_id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item label="报名人员" prop="workName" class="width_400">
        <el-input v-model="ruleForm.workName" placeholder="请输入此次报名的业务人员姓名"></el-input>
      </el-form-item>

      <el-form-item label="备注信息" prop="desc" class="width_400">
        <el-input type="textarea" :rows="5" v-model="ruleForm.desc"
          placeholder="请输入此次报名人员的备注信息，便于以后跟踪查证">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import courseApi from 'service/courseCenter/openCourse/list.js'
export default {
  props: {
    isShowIllegalEnroll: {
      type: Boolean,
      default: false,
    },
    cousre: {
      type: Object,
      default: () => {
        return {}
      }
    },
  },
  data () {
    return {
      ruleForm: {
        name: '',
        telephone: '',
        price: '',      // 费用
        isPrice: false,  // 是否需要钱
        enterpriseName: '',  // 企业名称
        isPersonal: false, // 是否个人
        workName: '',  // 业务人员姓名
        desc: '',
        companys: []
     },
     rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        telephone: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
        ],
        isPrice: [
          { type: 'boolean', required: true, message: '请选择是否需要费用', trigger: 'change'},
        ],
        price: [
          { required: true, message: '费用不能为空', trigger: 'blur' },
        ],
        isPersonal: [
          { type: 'boolean', required: true, message: '请选择报名方式', trigger: 'change'}
        ],
        enterpriseName: [
          { required: true, message: '企业不能为空', trigger: 'select' }
        ],
        workName: [
          { required: true, message: '请输入业务人员姓名', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '请填写备注信息', trigger: 'blur' },
          { min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  methods: {
    getCompany() {
      if (this.ruleForm.telephone) {
        courseApi.getOrganizations(
          {
            student_phone:  this.ruleForm.telephone
          },
          (res) => {
            this.ruleForm.isPersonal = !res.data ? true : false
            this.ruleForm.companys = res.data || []
          },
          (res) => {
            this.ruleForm.isPersonal = true
            this.$message(res.data.message)
          }
        )
      }
    },
    close() {
      this.$emit('close')
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let price = this.ruleForm.isPrice ? this.ruleForm.price : 0
          let type = this.ruleForm.isPersonal ? 'P' : 'O'
          let organization_id = (type == 'O') ? this.ruleForm.enterpriseName : ''
          courseApi.backstageEnroll(
            {
              course_id: this.cousre.course_id,
              student_name: this.ruleForm.name,
              student_phone: this.ruleForm.telephone,
              price: price,  //	字符串	必填			报名费用[免费为0]
              type: type,  //	字符串	必填			报名属性[P=个人、O=企业]
              organization_id: organization_id,
              operation_user: this.ruleForm.workName, // 	字符串	必填			操作报名的业务人员
              remark: this.ruleForm.desc
            },
            (res) => {
              this.ruleForm.enterpriseName = ''
              this.resetForm('ruleForm')
            },
            (res) => {
              this.ruleForm.enterpriseName = ''
              this.$message.error(res.message)
            }
          )
        }
        else {
          return false
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.close()
    }
  }
}
</script>
