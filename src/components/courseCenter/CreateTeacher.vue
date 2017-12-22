<template>
  <div class="wx-create-teacher">
    <el-dialog :title="title" :visible="visible" class="wx-teacher-create-dialog" :close-on-click-modal="closeOnClickModal" @close="close">

        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <div class="line-title">基本资料</div>
          <el-form-item label="讲师名称" prop="fullname">
            <el-input v-model="ruleForm.fullname" class="width_400" :maxlength="10"></el-input>
          </el-form-item>
          <el-form-item label="讲师性别" prop="gender">
            <el-radio v-model="ruleForm.gender" label="1">男</el-radio>
            <el-radio v-model="ruleForm.gender" label="2">女</el-radio>
          </el-form-item>
          <el-form-item label="讲师照片" prop="avatar">
            <img-upload @success="handleAvatar" @remove="handleAvatarDel" :limit="ruleForm.avatar_limit" :size="ruleForm.avatar_size" tip="支持不超过0.5M的jpg、png图片" :files="ruleForm.avatar_arr"></img-upload>
            <el-input v-model="ruleForm.avatar" style="display:none;"></el-input>
          </el-form-item>
          <el-form-item label="常驻地">
            <el-select filterable v-model="ruleForm.province_id" placeholder="省" clearable class="width_100" @change="regionList(2)">
              <el-option
                v-for="item in initData.location.provinces"
                :key="item.region_id"
                :label="item.region_name"
                :value="item.region_id">
              </el-option>
            </el-select>
            <el-select filterable v-model="ruleForm.city_id" placeholder="市" clearable class="width_100" @change="regionList(3)">
              <el-option
                v-for="item in initData.location.citys"
                :key="item.region_id"
                :label="item.region_name"
                :value="item.region_id">
              </el-option>
            </el-select>
            <el-select filterable v-model="ruleForm.area_id" placeholder="区" clearable class="width_100">
              <el-option
                v-for="item in initData.location.areas"
                :key="item.region_id"
                :label="item.region_name"
                :value="item.region_id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="擅长行业">
            <el-row>
              <industry-label @backTags="backTags" :initTag="ruleForm.tags_1" type="1" name="选择擅长行业"></industry-label>
            </el-row>
          </el-form-item>
          <el-form-item label="擅长领域">
            <el-row>
              <industry-label @backTags="backTags" :initTag="ruleForm.tags_2" type="4" :limit="ruleForm.tags_2_limit" name="选择擅长领域"></industry-label>
            </el-row>
          </el-form-item>
          <el-form-item label="讲师职称" prop="title">
            <el-input v-model="ruleForm.title" class="width_400" placeholder="多个请用“/”分隔 例如“集盒ceo/微学首席讲师/中国最具影响力十大讲师" :maxlength="100"></el-input>
          </el-form-item>
          <el-form-item label="讲师描述" prop="description">
            <el-input type="textarea" class="width_400" v-model="ruleForm.description" placeholder="请输入讲师相关描述" :maxlength="200"></el-input>
          </el-form-item>
          <el-form-item label="讲师资料">
            <img-upload @success="handleFiles" @remove="handleFiles" tip="支持word/pdf/ppt，不超过1M" listType="text" type="word/pdf/ppt" :isFile="isFile" :files="ruleForm.file_ids"></img-upload>
          </el-form-item>
          <el-form-item label="讲师网站">
            <el-input v-model="ruleForm.website" class="width_400"></el-input>
          </el-form-item>
          <div class="line-title">课酬信息</div>
          <el-form-item label="机构价" prop="price">
            <el-input v-model="ruleForm.price" class="width_120"></el-input>&nbsp;元
          </el-form-item>
          <el-form-item label="终端价范围">
            <el-form-item prop="price_floor" style="display:inline-block;">
              <el-input v-model="ruleForm.price_floor" class="width_120"></el-input>&nbsp;&nbsp;-
            </el-form-item>
            <el-form-item prop="price_ceiling" style="display:inline-block;">
              <el-input v-model="ruleForm.price_ceiling" class="width_120"></el-input>&nbsp;元
            </el-form-item>
          </el-form-item>
          <el-form-item label="价格说明">
            <el-input type="textarea" v-model="ruleForm.price_remark" class="width_400" placeholder="请输入讲师的价格说明，例如“2017年终端开票5万/天，不得低于4万税后”" :maxlength="200"></el-input>
          </el-form-item>
          <div class="line-title">个人信息</div>
          <el-form-item label="出生日期">
            <el-date-picker type="date" placeholder="选择日期" class="width_400" v-model="ruleForm.birthday" :picker-options="birthdayOptions" format="yyyy 年 MM 月 dd 日"
      value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item label="身份证号" prop="id_card">
            <el-input v-model="ruleForm.id_card" class="width_400"></el-input>
          </el-form-item>
          <el-form-item label="银行账号">
            <template v-for="bank,index in ruleForm.bank_cards_c">
              <div class="bank-container">
                <el-input v-model="bank.bank_name" placeholder="开户行" class="width_120"></el-input>
                <el-input v-model="bank.account_name" placeholder="开户人姓名" class="width_100"></el-input>
                <el-input v-model="bank.account_no" placeholder="银行卡号" class="width_200"></el-input>
                <i class="el-icon-remove icon-remove" v-if="ruleForm.bank_cards_c.length > 1" @click="removeBank(index)"></i>
                <i class="el-icon-circle-plus icon-add" v-if="index == ruleForm.bank_cards_c.length-1" @click="addBank"></i>
              </div>
            </template>
          </el-form-item>
          <el-form-item label="手机号码">
            <el-input v-model="ruleForm.mobile" placeholder="多个请用“、”分开" class="width_400"></el-input>
          </el-form-item>
          <el-form-item label="固定电话">
            <el-input v-model="ruleForm.telephone" placeholder="多个请用“、”分开" class="width_400"></el-input>
          </el-form-item>
          <el-form-item label="微信号">
            <el-input v-model="ruleForm.wx_name" placeholder="多个请用“、”分开" class="width_400"></el-input>
          </el-form-item>
          <el-form-item label="电子邮箱">
            <el-input v-model="ruleForm.email" placeholder="多个请用“、”分开" class="width_400"></el-input>
          </el-form-item>
          <el-form-item label="联系地址">
            <el-input type="textarea" v-model="ruleForm.address" class="width_400" :maxlength="100"></el-input>
          </el-form-item>
          <el-form-item label="其他备注">
            <el-input type="textarea" v-model="ruleForm.remark" class="width_400" :maxlength="200" placeholder="个人信息如果有其他信息需备注，请输入"></el-input>
          </el-form-item>
          <div class="line-title">补充信息</div>
          <template v-for="info in ruleForm.other_info">
            <el-form-item :label="info.title">
              <el-input v-model="info.content" class="width_400" :placeholder="info.placeholder" :maxlength="100"></el-input>
            </el-form-item>
          </template>
          <el-form-item label="其他备注">
            <el-input type="textarea" v-model="ruleForm.other_remark" class="width_400" :maxlength="200"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
            <!-- <el-button type="primary" @click="resetForm('ruleForm')">重置</el-button> -->
          </el-form-item>
        </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import IndustryLabel from '@/components/courseCenter/IndustryLabel'
  import ImgUpload from '@/components/imgUpload/ImgUpload'
  import {regionList} from '@/service/default'
  import {createTeacher, updateTeacher, getTeacher} from '@/service/courseCenter/teacher'

  export default {
    name: 'wx-teacher-create',
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      name: {
        type: String,
        default: ''
      },
      id: {
        type: String,
        default: ''
      }
    },
    watch: {
      visible(c,o){
        if(c && this.id != ""){
          this.title = "编辑讲师"
          this.getTeacher()
        }else{
          this.title = "添加讲师"
        }
      }
    },
    data() {
      var price = (rule, value, callback)=>{
        const price2 = this.ruleForm.price
        const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
        if(value != ""){
          if (!reg.test(value)) {
            callback(new Error('请输入有效的机构价'));
          } else {
              callback()
          }
        }else{
          callback()
        }
      };
      var validatePriceCeiling = (rule, value, callback) => {
        const price1 = this.ruleForm.price_floor
        const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
        // if (!value) {
        //   return callback(new Error('价格不能为空'));
        // }
        if(value != ""){
          if (!reg.test(value)) {
            callback(new Error('请输入有效的价格'));
          } else {
              callback()
          }
        }else{
          callback()
        }
      };
      var validatePriceFloor = (rule, value, callback) => {
        const price2 = this.ruleForm.price_ceiling
        const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
        // if (!value) {
        //   return callback(new Error('价格不能为空'));
        // }
        if(value != ""){
          if (!reg.test(value)) {
            callback(new Error('请输入有效的价格'));
          } else {
            callback()
          }
        }else{
          callback()
        }
      };
      var id_card = (rule, value, callback)=>{
        const id_card = this.ruleForm.id_card
        const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if(id_card != ""){
          if (!reg.test(id_card)) {
            callback(new Error('请输入有效的身份证号'));
          } else {
              callback()
          }
        }else{
          callback()
        }
      };
      return {
        isFile: true,
        dialogShow: false,
        closeOnClickModal: false,
        title: '添加讲师',
        birthdayOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        before_price: '',
        before_price_floor: '',
        before_price_ceiling: '',
        before_price_remark: '',
        ruleForm: {
          fullname: '',
          gender: '',
          avatar: '',
          avatar_limit: 1,
          avatar_size: 5,
          avatar_arr: [],

          province_id: '',
          city_id: '',
          area_id: '',
          location: {},

          tags_1: [],//选中的行业标签
          tags_2: [],//选中的领域标签
          tags_2_limit: 3,
          title:'',//讲师职称
          description: '',
          file_ids:[],//讲师资料
          website: "",
          price: '',//机构价
          price_range: [],
          price_floor: '',
          price_ceiling: '',
          price_remark: '',
          change_price: false,
          birthday:'',
          id_card: '',
          bank_cards_c:[{bank_name:'',account_name:'',account_no:''}],
          bank_cards: '',
          mobile: '',
          telephone: '',
          wx_name: '',
          email: '',
          address: '',
          remark: '',
          other_info: [{
            'title':'授课偏好',
            'content':''
          },{
            'title':'交通偏好',
            'content':''
          },{
            'title':'住宿偏好',
            'content':''
          },{
            'title':'餐饮偏好',
            'content':''
          },{
            'title':'茶水偏好',
            'content':''
          },{
            'title':'保健品偏好',
            'content':''
          },{
            'title':'场地要求',
            'content':''
          },{
            'title':'讲师助理姓名',
            'content':''
          },{
            'title':'助理联系方式',
            'content':'',
            'placeholder':'多个请用“、”分隔'
          }],
          other_remark: ''
        },
        rules: {
          fullname: [
            { required: true, message: '请输入讲师名称', trigger: 'blur' }
          ],
          avatar: [
            { required: true, message: '请上传讲师照片', trigger: 'change' }
          ],
          gender: [
            { required: true, message: '请选择讲师性别', trigger: 'change' }
          ],
          title: [
            { required: true, message: '请输入讲师职称', trigger: 'blur' }
          ],
          description: [
            { required: true, message: '请填写讲师描述', trigger: 'blur' }
          ],
          price: [
            { validator: price, trigger: 'blur' },
          ],
          price_floor: [
            { validator: validatePriceFloor, trigger: 'blur' },
          ],
          price_ceiling: [
            { validator: validatePriceCeiling, trigger: 'blur' },
          ],
          id_card: [
            { validator: id_card, trigger: 'blur' },
          ]
        },
        initData: {
          location: {
            provinces: [],
            citys: [],
            areas: []
          }
        }
      }
    },
    computed: {},
    components: {IndustryLabel ,ImgUpload},
    mounted(){
      this.ruleForm.fullname = this.name
      this.regionList(1)
    },
    methods: {
      regionList(type, id){
        let _this = this
        let region_id="1"
        if(type == 2){
           region_id = _this.ruleForm.province_id
           _this.initData.location.citys = []
           if(id == undefined){
             _this.ruleForm.city_id = ""
           }
        }else if(type == 3){
          region_id = _this.ruleForm.city_id
        }
        _this.initData.location.areas = []
        if(id == undefined){
          _this.ruleForm.area_id = ""
        }
        regionList({
          region_id: region_id
        }, function(res){
          if(res.code == '200'){
            const list = res.data.region_list;
            if(type == 1){
              _this.initData.location.provinces = list
            }else if(type == 2){
              _this.initData.location.citys = list
            }else if(type == 3){
              _this.initData.location.areas = list
            }
          }
        })
      },
      handleAvatar(files, file, res){
        this.ruleForm.avatar =  file.url
        this.ruleForm.avatar_arr = [{
          url: file.url,
          name: file.name
        }]
      },
      handleAvatarDel(files, file){
        this.ruleForm.avatar =  ""
        this.ruleForm.avatar_arr = []
      },
      handleFiles(files, file, res){
        this.ruleForm.file_ids = []
        for(let i=0; i<files.length; i++){
          this.ruleForm.file_ids.push({
            url: files[i].url,
            type: '',
            name: files[i].name,
            size:  files[i].size,
            type: files[i].type
          })
        }
      },
      addBank(){
        this.ruleForm.bank_cards_c.push({bank_name:'',account_name:'',account_no:''})
      },
      removeBank(index){
          this.ruleForm.bank_cards_c.splice(index,1)
      },
      submitForm(formName) {
        var _this = this
        this.$refs[formName].validate((valid) => {
          let params = JSON.parse(JSON.stringify(this.ruleForm))

          //省市区拼接
          if(params.province_id != ""){
            for(var i=0; i<this.initData.location.provinces.length; i++){
              if(this.initData.location.provinces[i].region_id == params.province_id){
                params.location.province_id = params.province_id
                params.location.province_name = this.initData.location.provinces[i].region_name
                break
              }
            }
          }
          if(params.city_id != ""){
            for(var i=0; i<this.initData.location.citys.length; i++){
              if(this.initData.location.citys[i].region_id == params.city_id){
                params.location.city_id = params.city_id
                params.location.city_name = this.initData.location.citys[i].region_name
                break
              }
            }
          }
          if(params.area_id != ""){
            for(var i=0; i<this.initData.location.areas.length; i++){
              if(this.initData.location.areas[i].region_id == params.area_id){
                params.location.area_id = params.area_id
                params.location.area_name = this.initData.location.areas[i].region_name
                break
              }
            }
          }

          //银行卡号
          params.bank_cards = JSON.stringify(params.bank_cards_c)

          if (valid) {
            //价格转换
            if(params.price != ""){
              params.price = params.price*100
            }
            //终端价格范围
            if(params.price_floor != ""){
              params.price_floor = parseInt(params.price_floor)
            }
            if(params.price_ceiling != ""){
              params.price_ceiling = parseInt(params.price_ceiling)
            }

            if(params.price_floor == "" && params.price_ceiling == ""){
              params.price_range.push(params.price_floor*100)
              params.price_range.push(params.price_ceiling*100)
            }else if(params.price_floor == "" && params.price_ceiling != ""){
               this.$message.error('请输入完整的终端价格范围');
               return
            }else if(params.price_ceiling != "" && params.price_floor == ""){
              this.$message.error('请输入完整的终端价格范围');
              return
            }else if(params.price_floor>params.price_ceiling){
              this.$message.error('终端价格范围输入有误');
              return
            }else{
              params.price_range.push(params.price_floor*100)
              params.price_range.push(params.price_ceiling*100)
            }

            let loading = __tool.loading(this)

            if(this.id != ""){
              if(this.before_price != params.price || this.before_price_floor != params.price_floor || this.before_price_ceiling != params.price_ceiling || this.before_price_remark != params.price_remark){
                params.change_price = true
              }
              params.teacher_id = this.id
              // return
              updateTeacher(params, function(res){
                if(res.code == "200"){
                  _this.$message({
                    showClose: true,
                    message: '讲师信息更新成功',
                    type: 'success'
                  });
                  loading.close()
                  var fullname = params.fullname
                  _this.resetForm('ruleForm')
                  _this.$emit("updateSuccess",{name: fullname, teacher_id: _this.id})
                }
              }, function(res){
                loading.close()
                if(res.data) {
                  _this.$message(res.data);
                }
                else {
                  _this.$message(res.message);
                }
              })
            }else{
              createTeacher(params, function(res){
                if(res.code == "200"){
                  _this.$message({
                    showClose: true,
                    message: '添加成功',
                    type: 'success'
                  });
                  loading.close()
                  let fullname = params.fullname
                  _this.resetForm('ruleForm')
                  _this.$emit("addSuccess",{name:fullname, teacher_id: res.data.teacher_id})
                }
              }, function(){
                loading.close()
                if(res.data) {
                  _this.$message(res.data);
                }
                else {
                  _this.$message(res.message);
                }
              })
            }
          }
        });
      },
      backTags(tags, type){
        if(type == 1){
          this.ruleForm.tags_1 = tags
        }else if(type == 4){
          this.ruleForm.tags_2 = tags
        }
      },
      getTeacher(){
        var _this = this
        getTeacher({teacher_id: _this.id}, function(res){
          if(res.code == '200'){
            _this.pushData(res.data, ['fullname','gender','avatar','title','description', 'website', 'birthday', 'mobile', 'email', 'address', 'remark', 'other_remark', 'website', 'wx_name', 'price_remark', 'id_card', 'telephone'])
          }
        },function(){
          _this.$message.error('获取讲师信息失败');
          _this.close()
        })
      },
      pushData(data, arr){
        for(var i=0; i<arr.length; i++){
          var val = arr[i]
          if(data[val] != undefined && this.ruleForm[val] != undefined){
            this.ruleForm[val] = data[val]
          }
        }
        //价格转换
        if(data.price != ""){
          this.ruleForm.price = data.price/100
        }
        if(data.price_floor != ""){
          this.ruleForm.price_floor = data.price_floor/100
        }
        if(data.price_ceiling != ""){
          this.ruleForm.price_ceiling = data.price_ceiling/100
        }
        this.ruleForm.bank_cards_c = JSON.parse(data.bank)
        //记录当前几个价格字段
        this.before_price = data.price
        this.before_price_floor = data.price_floor
        this.before_price_ceiling = data.price_ceiling
        this.before_price_remark = data.price_remark


        this.ruleForm.avatar_arr.push({url:data.avatar})//头像列表
        this.ruleForm.province_id = data.location.province_id==0?'':data.location.province_id
        this.ruleForm.city_id = data.location.city_id==0?'':data.location.city_id
        this.ruleForm.area_id = data.location.area_id==0?'':data.location.area_id
        if(this.ruleForm.province_id != ""){
          this.regionList(2,1)
        }
        if(this.ruleForm.city_id != ""){
          this.regionList(3,1)
        }

        this.ruleForm.tags_1 = data.tags_1 == null? []:data.tags_1
        this.ruleForm.tags_2 = data.tags_2 == null? []:data.tags_2
        this.ruleForm.tags_1_init = this.ruleForm.tags_1.concat([])
        this.ruleForm.tags_2_init = this.ruleForm.tags_2.concat([])

        this.ruleForm.other_info = []
        this.ruleForm.other_info = data.other_info == null?[]:data.other_info

        if(data.teacher_file != null){
          for(let i=0; i<data.teacher_file.length; i++){
            this.ruleForm.file_ids.push({
              url: data.teacher_file[i].url,
              type: data.teacher_file[i].type,
              name: data.teacher_file[i].name,
              size: data.teacher_file[i].size?data.teacher_file[i].size: '',
              type: data.teacher_file[i].type
            })
          }
        }
      },
      resetForm(formName) {
        var _this = this
        this.$refs[formName].resetFields();

        this.ruleForm.price_range = []
        this.ruleForm.website = ""
        //编辑的时候机构价、终端范围价格、价格说明
        this.ruleForm.change_price = false
        this.before_price = ""
        this.before_price_floor = ""
        this.before_price_ceiling = ""
        this.before_price_remark = ""

        //标签
        this.ruleForm.tags_1 = []
        this.ruleForm.tags_2 = []
        //图片、文件
        this.ruleForm.avatar =  ""
        this.ruleForm.avatar_arr = []
        this.ruleForm.file_ids = []

        //省市区
        this.ruleForm.province_id = ""
        this.ruleForm.city_id = ""
        this.ruleForm.area_id = ""
        this.ruleForm.location = {}

        this.ruleForm.price_remark = ""
        this.ruleForm.birthday = ""

        this.ruleForm.bank_cards_c = [{bank_name:'',account_name:'',account_no:''}]
        this.ruleForm.bank_cards = ""

        this.ruleForm.mobile = ""
        this.ruleForm.telephone = ""
        this.ruleForm.wx_name = ""
        this.ruleForm.email = ""
        this.ruleForm.address = ""
        this.ruleForm.remark = ""

        for(var i=0; i<this.ruleForm.other_info.length; i++){
          this.ruleForm.other_info[i].content = ""
        }
        this.ruleForm.other_remark = ""
      },
      close(){
        this.resetForm("ruleForm")
        this.$emit("close")
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" >
  .wx-teacher-create-dialog{
    .line-title{
      font-size: 20px;
      font-weight: bold;
      margin-left: 24px;
      margin-bottom: 20px;
      padding: 5px 0;
      color: #5a5e66;
      border-bottom: 1px solid #b4bccc;

    }
    .el-dialog{
      margin-top: 10vh!important;
    }
    .el-dialog__body{
      height: 70vh;
      overflow-y: scroll;
    }
    .icon-blue{
      color: #409EFF;
      font-size: 20px;
    }
    .icon-add{
      color: #409EFF;
      font-size: 20px;
    }
    .icon-remove{
      color: #fa5555;
      font-size: 20px;
    }
    .bank-container{
      padding-bottom: 10px;
    }
  }
</style>
