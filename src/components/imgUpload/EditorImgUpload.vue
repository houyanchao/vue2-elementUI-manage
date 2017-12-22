<template>
  <div class="wx-editor-upload">
    <el-upload
      :action="uploadUrl"
      :data="upladData"
      list-type="text"
      :multiple="isMultiple"
      :before-upload="beforeUpload"
      :on-success="successUpload"
      :on-error="uploadError"
      ref="multipleUpload">
      <el-button icon="el-icon-picture-outline">图片</el-button>
    </el-upload>
  </div>
</template>
<script>

  export default {
    data() {
      return {
      };
    },
    props: {
      isMultiple: {  // 是否支持多传
        type: Boolean,
        default: false
      },
      type: {//支持的类型
        type: String,
        default: 'png/jpg/jpeg'
      },
      size: {//大小限制（单位M）
        type: Number,
        default: 10
      }
    },
    computed:{
      uploadUrl: () => {
        return upyunConfig.api + upyunConfig.bucket
      },
      upladData(){

        let options = {}
        options.bucket = upyunConfig.bucket
        options['save-key'] = upyunConfig['save-key']
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
    },
    mounted(){
    },
    methods: {
      beforeUpload(file){
        var name = file.name
        var type = file.type
        var size = file.size / 1024 / 1024
        var validate_type = false
        var validate_size = false
        var format = type.split("image/")[1]
        if(this.type.indexOf(format) != -1){
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
      successUpload(response, file, fileList){
        var list = []
        var f = {
          url: file.response.url,
          path: upyunConfig.domain+file.response.url,
          name: file.name
        }
        for(let i=0; i<fileList.length; i++){
          list.push({
            url: fileList[i].response.url,
            path: upyunConfig.domain+fileList[i].response.url,
            name: fileList[i].name,
          })
        }
        this.$emit('success', list, f, response)
      },
      uploadError(err, file, fileList) {
        this.$message.error('上传图片失败')
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  .wx-editor-upload{
    width: 100px;
    display: inline-block;
    .el-upload-list{
      display: none;
    }
  }
</style>
