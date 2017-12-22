<template>
  <div class="wx-editor">
    <div class="content" >
      <template v-for="desc,index in description">
        <template v-if="desc.type == 'p'">
          <div class="text">
            <p v-show="!desc.isFocus">
              {{desc.value}}
              <i class="el-icon-edit" @click="textClick(desc)"></i>
              <i class="el-icon-circle-close-outline" @click="del(desc)"></i>
            </p>
            <el-input ref="textarea" type="textarea" v-model="desc.value" autosize class="width_400" v-show="desc.isFocus" @blur="descBlur(desc)"></el-input>
          </div>
        </template>
        <template v-if="desc.type == 'img'">
          <wx-image :src="desc.value" :width="148" :height="148">
            <i class="el-icon-error del-img" @click="del(desc)"></i>
          </wx-image>
        </template>
      </template>
    </div>
    <div class="btn-container">
      <editor-img-upload @success="imgUploadSucc"></editor-img-upload>
      <el-button icon="el-icon-tickets" @click="addText">文本</el-button>
    </div>
  </div>
</template>
<script>
  import wxImage from 'components/common/Image.vue'
  import EditorImgUpload from '@/components/imgUpload/EditorImgUpload'

export default {
  name: 'wx-files',
  data(){
    return {
      description: []
    }
  },
  props: {
    list: {//初始数据
      type: Array,
      default: function(){
        return []
      }
    }
  },
  watch: {
    list(c, o){
      this.description = []
      for(let i=0; i<c.length; i++){
        if(c[i].type == 'p'){
          this.description.push({
              value: c[i].value,
              type: c[i].type,
              isFocus: false
          })
        }else{
          this.description.push({
              value: c[i].value,
              type: c[i].type
          })
        }
      }
    }
  },
  components: {EditorImgUpload, wxImage},
  mounted(){
  },
  methods: {
    imgUploadSucc(filelist, file){
      this.description.push({
        type: 'img',
        value: file.url
      })
      let description = []
      for(let i=0; i<this.description.length; i++){
        description.push({
          type: this.description[i].type,
          value: this.description[i].value
        })
      }
      this.$emit('success', description)
    },
    addText(){
      var hasNull = this.checkNull()
      if(!hasNull){
        var text = {
          type: 'p',
          value: '',
          isFocus: false
        }
        this.description.push(text)
        this.textClick(text, 1)
      }
    },
    checkNull(){
      for(let i=0; i<this.description.length; i++){
        if(this.description[i].type == 'p' && this.description[i].value == ''){
          return true
        }
      }
      return false
    },
    textClick(desc, type){
      let _this = this
      let index = this.description.indexOf(desc)
      let num = 0
      for(var i=0; i<index; i++){
        if(this.description[i].type == 'p'){
          num++
        }
      }
      if(type == undefined){
        var hasNull = this.checkNull()
        if(!hasNull){
          desc.isFocus = true
          setTimeout(function(){
            _this.$refs.textarea[num].focus()
            console.log(_this.description)
          },20)
        }
      }else{
        desc.isFocus = true
        setTimeout(function(){
          _this.$refs.textarea[num].focus()
        },20)
      }
    },
    descBlur(desc){
      if(desc.value == ""){
        this.$message({
          message: '文本内容不能为空',
          type: 'warning'
        });
        this.textClick(desc, 1)
      }else{
        desc.isFocus = false
        let description = []
        for(let i=0; i<this.description.length; i++){
          description.push({
            type: this.description[i].type,
            value: this.description[i].value
          })
        }
        this.$emit('success', description)
      }
    },
    del(desc){
      let index = this.description.indexOf(desc)
      this.description.splice(index, 1)
      let description = []
      for(let i=0; i<this.description.length; i++){
        description.push({
          type: this.description[i].type,
          value: this.description[i].value
        })
      }
      this.$emit('success', description)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .wx-editor{
    .content{
      padding-bottom: 10px;
      p{
        padding-left: 5px;
        width: 400px;
        word-wrap:break-word;
        margin: 0;
      }
      p:hover{
        background-color: #F5F7FA;
      }
      textarea{
        margin: 0px 0;
      }
      .el-icon-edit{
        margin: 0 5px 0 10px;
        font-size: 18px;
      }
      .el-icon-circle-close-outline{
        color: #fa5555;
        font-size: 20px;
      }
      .del-img{
          color: #fa5555;
          font-size: 20px;
          position: absolute;
          right: 0;
          top: 0px;
          z-index: 1000
      }
    }
  }
</style>
