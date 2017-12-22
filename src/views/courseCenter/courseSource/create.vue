<template>
 	<div class="wx-create-course">
    <a href="javascript:void(0)" class="back" @click="back" v-if="isShowBack"><<返回上一页</a>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="课程讲师" required prop="teacherIds_str">
        <select-teacher :data="ruleForm.teacherIds_data" @confirm="selectTeacherC"></select-teacher>
        <el-input v-model="ruleForm.teacherIds_str" style="display:none;"></el-input>
      </el-form-item>
      <el-form-item label="课程名称" prop="title">
        <el-input v-model="ruleForm.title" class="width_400"></el-input>
      </el-form-item>
      <el-form-item label="课程分类" required>
          <el-form-item prop="category_id_1" style="display:inline-block;">
            <el-select filterable v-model="ruleForm.category_id_1" placeholder="请选择课程一级分类" clearable @change="changeCategory">
              <el-option
                v-for="item in initData.category_1"
                :key="item.tag_id"
                :label="item.name"
                :value="item.tag_id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="display:inline-block;">
            <el-select filterable v-model="ruleForm.category_id_2" placeholder="请选择课程二级分类" clearable>
              <el-option
                v-for="item in initData.category_2"
                :key="item.tag_id"
                :label="item.name"
                :value="item.tag_id">
              </el-option>
            </el-select>
          </el-form-item>
      </el-form-item>
      <el-form-item label="行业标签">
          <industry-label @backTags="backTags" :initTag="ruleForm.tags_1" type="1" name="请关联行业标签"></industry-label>
      </el-form-item>
      <el-form-item label="岗位标签" required prop="tags_2_r">
          <industry-label @backTags="backTags" :initTag="ruleForm.tags_2" type="2" name="请关联岗位标签"></industry-label>
          <el-input v-model="ruleForm.tags_2_r" style="display:none;"></el-input>
      </el-form-item>
      <el-form-item label="职务标签" required prop="tags_3_r">
          <industry-label @backTags="backTags" :initTag="ruleForm.tags_3" type="3" name="请关联职务标签"></industry-label>
          <el-input v-model="ruleForm.tags_3_r" style="display:none;"></el-input>
      </el-form-item>
      <el-form-item label="课程主图" prop="image">
        <img-upload @success="handleAvatar" @remove="handleAvatarDel" :files="ruleForm.image_arr" :limit="ruleForm.image_limit" :size="ruleForm.image_size" tip="建议尺寸"></img-upload>
        <el-input v-model="ruleForm.image" style="display:none;"></el-input>
      </el-form-item>
      <el-form-item label="课程缩略图" prop="thumb">
        <img-upload @success="handleThumb" @remove="handleThumbDel" :files="ruleForm.thumb_arr" :limit="ruleForm.thumb_limit" :size="ruleForm.thumb_size" tip="建议尺寸"></img-upload>
        <el-input v-model="ruleForm.thumb" style="display:none;"></el-input>
      </el-form-item>
      <template v-for="item in ruleForm.description">
        <el-form-item :label="item.title">
          <el-input type="textarea" v-model="item.content" class="width_400" :placeholder="item.desc" :maxlength="item.maxlength"></el-input>
        </el-form-item>
      </template>
      <el-form-item label="课程简介" required>
          <editor @success="editorBack" :list="ruleForm.intro"></editor>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')" :disabled="isSubBtnDisabled">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

  import Editor from '@/components/common/Editor'
  import SelectTeacher from '@/components/courseCenter/SelectTeacher'
  import IndustryLabel from '@/components/courseCenter/IndustryLabel'
  import ImgUpload from '@/components/imgUpload/ImgUpload'
  import {tagList} from '@/service/default'
  import {createCourse, updateCourse, getCourseSource} from '@/service/courseCenter/courseSource'

  export default {
    name: 'wx-teacher-create',
    props: {
    },
    data() {
      return {
        course_id: '',
        // intro_arr: [],
        isShowBack: false,
        isSubBtnDisabled: false,
        ruleForm: {
          teacherIds_data: [],//编辑的时候用
          teacher_ids: [],//提交的时候用
          teacherIds_str: '',
          title: '',
          category_ids: [],
          category_id_1: '',
          category_id_2: '',
          tags_1: [],//行业标签
          tags_2: [],//领域标签
          tags_2_r: '',
          tags_3: [],//职务标签
          tags_3_r: '',
          image: '',
          image_arr: [],
          image_size: 2,
          image_limit: 1,
          thumb: '',
          thumb_arr: [],
          thumb_size: 2,
          thumb_limit: 1,
          description: [{
            title: '课程背景',
            content: '',
            is_requried: 'N',
            maxlength: 500,
            desc: '可简单阐述下课程培训的背景，帮助用户了解自身的实际情况选择报名'
          },{
            title: '课程收益',
            content: '',
            is_requried: 'N',
            maxlength: 200,
            desc: '请简单罗列下学员学习课程后能够预计获得的一些收获'
          },{
            title: '课程对象',
            content: '',
            is_requried: 'N',
            maxlength: 200,
            desc: '请简单描述下该课程适合的对象'
          }],
          intro: []
        },
        rules: {
          teacherIds_str: [
            { required: true, message: '请选择课程讲师', trigger: 'change' }
          ],
          title: [
            { required: true, message: '请输入讲师名称', trigger: 'change' }
          ],
          category_id_1: [
            { required: true, message: '请选择课程一级分类', trigger: 'change' }
          ],
          category_id_2: [
            { required: true, message: '请选择课程二级分类', trigger: 'change' }
          ],
          tags_2_r: [
            { required: true, message: '请选择岗位标签', trigger: 'change' }
          ],
          tags_3_r: [
            { required: true, message: '请选择职务标签', trigger: 'change' }
          ],
          image: [
            { required: true, message: '请上传课程主图', trigger: 'change' }
          ],
          thumb: [
            { required: true, message: '请上传课程缩略图', trigger: 'change' }
          ]
        },
        initData: {
          category_1: [],
          category_2: []
        }
      }
    },
    watch: {},
    computed: {},
    components: { IndustryLabel ,ImgUpload, SelectTeacher, Editor},
    mounted(){
      let _this = this

      if(this.$route.query.course_id != undefined){
        this.course_id = this.$route.query.course_id
        this.getCourseSource()
        this.isShowBack = true
      }
      // 讲师列表页过来的数据
      let name = this.$route.query.name
      let teacher_id = this.$route.query.teacher_id
      if(name != undefined && teacher_id != undefined){
        name = decodeURIComponent(name)
        teacher_id = decodeURIComponent(teacher_id)
        this.ruleForm.teacherIds_data.push({
          teacher_id: teacher_id,
          name: name
        })
        this.ruleForm.teacher_ids.push(teacher_id)
        this.ruleForm.teacherIds_str = '1'
        this.isShowBack = true
      }
      this.getTag(4)
    },
    methods: {
      handleAvatar(files, file, res){
        this.ruleForm.image_arr = files
        this.ruleForm.image =  file.url
      },
      handleAvatarDel(files, file){
        this.ruleForm.image_arr = []
        this.ruleForm.image =  ""
      },
      handleThumb(files, file, res){
        this.ruleForm.thumb_arr = files
        this.ruleForm.thumb =  file.url
      },
      handleThumbDel(files, file){
        this.ruleForm.thumb_arr = []
        this.ruleForm.thumb =  ""
      },
      handleFiles(files, file, res){
        this.ruleForm.file_ids = []
        for(let i=0;i<files.length;i++){
          this.ruleForm.file_ids.push({
            path:files[i].url,
            type: ''})
        }
      },
      addBank(){
        this.ruleForm.bank_cards_c.push({bank_name:'',account_name:'',account_no:''})
      },
      removeBank(index){
          this.ruleForm.bank_cards_c.splice(index,1)
      },
      getTag(type){
        var _this = this
        tagList({
          type: type
        },function(res){
          if(res.code == '200'){
            _this.initData.category_1 = res.data.tags
          }
        },function(){
        })
      },
      changeCategory(id, a){
        if(a == undefined){
          this.ruleForm.category_id_2 = ''
        }
        this.initData.category_2 = []
        if(this.ruleForm.category_id_1 != ""){
          for(var i=0;i<this.initData.category_1.length;i++){
            if(this.initData.category_1[i].tag_id == this.ruleForm.category_id_1){
              this.initData.category_2 = this.initData.category_1[i].children || []
              break;
            }
          }
        }
      },
      submitForm(formName) {
        let _this = this
        this.$refs[formName].validate((valid) => {
        //岗位标签和职务标签
        if(this.ruleForm.tags_2.length==0 || this.ruleForm.tags_3.length==0){
          if(this.ruleForm.tags_2.length==0){
            this.ruleForm.tags_2_r = ""
          }
          if(this.ruleForm.tags_3.length==0){
            this.ruleForm.tags_3_r = ""
          }
          valid = false
        }

        this.ruleForm.category_ids.push(this.ruleForm.category_id_1)
        this.ruleForm.category_ids.push(this.ruleForm.category_id_2)

        if(this.ruleForm.intro.length == 0){
          _this.$message({
            showClose: true,
            message: '请填写课程简介',
            type: 'warning'
          });
          valid = false
        }

        if (valid) {
          let loading = __tool.loading(_this)
          _this.isSubBtnDisabled = true
          if(this.course_id){
            this.ruleForm.course_source_id = this.course_id
            updateCourse(this.ruleForm, function(res){
              loading.close()
              _this.$message({
                showClose: true,
                message: '课程修改成功',
                type: 'success',
                onClose(){
                  // _this.$router.push({path: '/courseSource/list'});
                  _this.$router.back(-1)
                  _this.isSubBtnDisabled = false
                }
              });
            }, function(){
              loading.close()
              _this.isSubBtnDisabled = false
            })
          }else{
            createCourse(this.ruleForm, function(res){
              loading.close()
              _this.$message({
                showClose: true,
                message: '课程添加成功',
                type: 'success',
                onClose(){
                  // _this.$router.push({path: '/courseSource/list'});
                  _this.$router.back(-1)
                  _this.isSubBtnDisabled = false
                }
              });
            }, function(){
              loading.close()
              _this.isSubBtnDisabled = false
            })
          }
        }
      });
    },
    backTags(tags, type){
      if(type == 1){
        this.ruleForm.tags_1 = []
        if(tags.length>0){
          this.ruleForm.tags_1 = tags
        }
      }else if(type == 2){
        this.ruleForm.tags_2 = []
        if(tags.length>0){
          this.ruleForm.tags_2_r = '2'
          this.ruleForm.tags_2 = tags
        }else{
          this.ruleForm.tags_2_r = ''
        }
      }else if(type == 3){
        this.ruleForm.tags_3 = []
        if(tags.length>0){
          this.ruleForm.tags_3 = tags
          this.ruleForm.tags_3_r = '3'
        }else{
          this.ruleForm.tags_3_r = ''
        }
      }
    },
    selectTeacherC(teachers){
      this.ruleForm.teacher_ids = []
      for(let i=0; i<teachers.length; i++){
        this.ruleForm.teacher_ids.push(teachers[i].teacher_id)
      }
      this.ruleForm.teacherIds_str = this.ruleForm.teacher_ids.join(",")
    },
    getCourseSource(){
      let _this = this
      getCourseSource({
        course_source_id: _this.course_id
      },function(res){
        if(res.code == '200'){
          //课程讲师
          _this.pushData(res.data, ['title'])
        }
      })
    },
    pushData(data, arr){
      for(var i=0; i<arr.length; i++){
        var val = arr[i]
        if(data[val] != undefined && this.ruleForm[val] != undefined){
          this.ruleForm[val] = data[val]
        }
      }
      //讲师id
      this.ruleForm.teacherIds_data = data.teacher.concat([])
      if(data.teacher && data.teacher.length>0){
        for(var i=0; i<data.teacher.length; i++){
          this.ruleForm.teacher_ids.push(data.teacher[i].teacher_id)
        }

        this.ruleForm.teacherIds_str = "1"
      }

      //分类
      this.ruleForm.category_id_1 = data.category_1
      this.ruleForm.category_id_2 = data.category_2
      this.changeCategory(1, 1)

      //标签
      this.ruleForm.tags_1 = data.tags_1 == null?[]:data.tags_1
      this.ruleForm.tags_2 = data.tags_2 == null?[]:data.tags_2
      if(this.ruleForm.tags_2.length != 0){
        this.ruleForm.tags_2_r = '2'
      }

      this.ruleForm.tags_3 = data.tags_3 == null?[]:data.tags_3
      if(this.ruleForm.tags_3.length != 0){
        this.ruleForm.tags_3_r = '2'
      }

      //课程主图、缩略图
      this.ruleForm.image = data.image
      this.ruleForm.image_arr.push({
        url: data.image
      })

      this.ruleForm.thumb = data.thumb
      this.ruleForm.thumb_arr.push({
        url: data.thumb
      })

      //课程背景、课程收益、课程对象
      for(var i=0; i<this.ruleForm.description.length; i++){
        for(var j=0; j<data.description.length; j++){
          if(this.ruleForm.description[i].title == data.description[j].key){
            this.ruleForm.description[i].content = data.description[j].value
            break
          }
        }
      }
      //课程简介
      this.ruleForm.intro = JSON.parse(data.intro)
      // this.intro_arr = JSON.parse(data.intro)
    },
    editorBack(list){
      this.ruleForm.intro = list
    },
    back(){
      this.$router.back(-1)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" >
  .wx-create-course{
    .back{
      display: inline-block;
      padding-left: 30px;
      margin-bottom: 20px;
      color: #409EFF;
    }
  }
</style>
