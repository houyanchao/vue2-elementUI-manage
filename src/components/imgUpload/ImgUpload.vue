<template>
  <div class="wx-upload">
    <el-upload
      :class="{'upload-hide': imgNum>=limit}"
      :action="uploadUrl"
      :data="upladData"
      :limit="limit"
      :list-type="listType"
      :multiple="isMultiple"
      :on-exceed="handleExceed"
      :before-upload="beforeUpload"
      :on-success="successUpload"
      :on-error="uploadError"
      :on-remove="handleRemove"
      :file-list="files2"
      ref="multipleUpload">
      <el-button type="primary" v-if="listType=='text'">选择文件</el-button>
      <i class="el-icon-plus" v-else></i>
      <div slot="tip" v-if="imgNum<limit" class="el-upload__tip">{{tip}}</div>
    </el-upload>
  </div>
</template>
<script>

  export default {
    data() {
      return {
        imgNum: 0,
        files2: [],
        imgType: 'png/jpg/jpeg/gif',//默认接收的图片类型
        fileType: 'png/jpg/jpeg/gif/doc/ppt/xls/pdf/docx/xlsx/pages'//默认接收的文件类型
      };
    },
    props: {
      files: {
        type: Array,
        default: () => {
          return []
        }
      },
      isFile: {//文件类型必须为true
        type: Boolean,
        default: false
      },
      listType: { // text/picture/picture-card
        type: String,
        default: 'picture-card'
      },
      limit: {//数量限制
        type: Number,
        default: 1000
      },
      isMultiple: {  // 是否支持多传
        type: Boolean,
        default: true
      },
      type: {//支持的类型
        type: String,
        default: ''
      },
      size: {//大小限制（单位M）
        type: Number,
        default: 10
      },
      tip: {
        type: String,
        default: ''
      }
    },
    computed:{
      uploadUrl: () => {
        return upyunConfig.api + upyunConfig.bucket
      },
      upladData(){

        let options = {}
        options.bucket = upyunConfig.bucket
        if(this.isFile){
          options['save-key'] = upyunConfig['save-key-file']
        }else{
          options['save-key'] = upyunConfig['save-key']
        }
        options.expiration = Math.floor(new Date().getTime() / 1000) + 86400

        const policy = window.btoa(JSON.stringify(options))
        const signature = md5(policy + '&' + upyunConfig.apiSecret)

        const params = {}
        params.policy = policy
        params.signature = signature

        return params
      }
    },
    watch: {
      files(c,o){
        this.files2 = []
        for(let i=0; i<c.length; i++){
          var ex = JSON.parse(JSON.stringify(c[i]))
          ex.url = upyunConfig.domain+ex.url
          this.files2.push(ex)
        }
        if(this.files2.length == 0){
          this.$refs.multipleUpload.clearFiles()
        }
        this.imgNum = this.files2.length
      }
    },
    mounted(){
      this.imgNum = this.files2.length
    },
    methods: {
      getFileType(name){
        if(name){
          let file_type = name.split(".")
          return file_type[file_type.length-1]
        }else{
          return ''
        }
      },
      beforeUpload(file){
        this.imgNum++
        var name = file.name
        var type = file.type
        var size = file.size / 1024 / 1024
        var validate_type = false
        var validate_size = false

        var type2 = ""//接受的文件类型
        var format = this.getFileType(name)
        if(this.isFile){
          if(this.type == ""){
            type2 = this.fileType
          }else{
            type2 = this.type
          }
        }else{
          if(this.type == ""){
            type2 = this.imgType
          }else{
            type2 = this.type
          }
        }

        if(type2.indexOf(format) != -1){
          validate_type = true
        }else{
          this.$message.error('文件格式不支持');
          return false
        }

        if (size > this.size) {
          this.$message.error('文件大小不能大于'+this.size+'M');
          return false
        }else{
          validate_size = true
        }
        if(validate_type&&validate_size){
          return true
        }else{
          return false
        }
      },
      handleExceed(){
        this.$message.warning("当前限制上传选择 "+this.limit+" 个文件");
      },
      successUpload(response, file, fileList){
        var list = []
        var f = {
          url: file.response.url,
          path: upyunConfig.domain+file.response.url,
          name: file.name,
          size: parseInt(file.size/1024),
          type: this.getFileType(file.name)
        }
        for(let i=0; i<fileList.length; i++){
          if(fileList[i].response){
            list.push({
              url: fileList[i].response.url,
              path: upyunConfig.domain+fileList[i].response.url,
              name: fileList[i].name,
              size: file.uid == fileList[i].uid?parseInt(fileList[i].size/1024):parseInt(fileList[i].size),
              type: this.getFileType(fileList[i].name)
            })
          }else{
            let url = fileList[i].url
            list.push({
              url: url.split(upyunConfig.domain)[1],
              path: url,
              name: fileList[i].name,
              size: fileList[i].size?parseInt(fileList[i].size):'',
              type: this.getFileType(fileList[i].name)
            })
          }
        }
        this.$emit('success', list, f, response)
      },
      uploadError(err, file, fileList) {
        this.$message.error('上传失败')
        this.imgNum--
      },
      handleRemove(file, fileList) {
        var list = []
        var f = {
          url: file.url.replace(upyunConfig.domain, ""),
          path: file.url,
          name: file.name,
          size: file.size?parseInt(file.size):'',
          type: this.getFileType(file.name)
        }
        for(let i=0; i<fileList.length; i++){
          list.push({
            url: fileList[i].url.replace(upyunConfig.domain, ""),
            path: fileList[i].url,
            name: fileList[i].name,
            size: fileList[i].size?parseInt(fileList[i].size):'',
            type: this.getFileType(fileList[i].name)
          })
        }
        this.imgNum--
        this.$emit('remove', list, f)
      }
    }
  }
</script>
<style>
    .upload-hide .el-upload{
      display: none;
    }
    .el-upload__tip{
      margin-top: 0;
    }
</style>
