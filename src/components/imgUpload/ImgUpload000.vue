<template>
  <div class="wx-upload">
    <ul class="upload-images" v-if="isShowImageList && images.length">
      <li v-for="image,index in images" :key="index" >
        <wx-image :src="image.url" :width="148" :height="148"></wx-image>
        <i class="el-icon-circle-close delete-image-btn" @click="removeImage(index)"></i>
      </li>
    </ul>
    <el-upload class="upload-wrapper"
      :list-type="listType"
      :show-file-list="false"
      :limit="limit"
      :multiple="isMultiple"
      :action="uploadUrl"
      :data="upladData"
      :before-upload="beforeUpload"
      :on-exceed="handleExceed"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      v-if="images.length < limit">
      <i class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>
<script>

  import wxImage from 'components/common/Image.vue'

  export default {
    data() {
      return {}
    },
    props: {
      images: {
        type: Array,
        default: () => {
          return []
        }
      },
      listType: {
        type: String,
        default: 'picture-card'  // text/picture/picture-card
      },
      limit: {  // 数量限制
        type: Number,
        default: 10000
      },
      type: {  // 支持的类型
        type: String,
        default: 'png/jpg/jpeg'
      },
      size: {  // 大小限制（单位M）
        type: Number,
        default: 2
      },
      isMultiple: {  // 是否支持多传
        type: Boolean,
        default: true
      },
      isShowImageList: {  // 是否需要展示自带的上传成功图片列表
        type: Boolean,
        default: true
      }
    },
    components: {
      wxImage
    },
    computed:{
      uploadUrl: () => {
        return upyunConfig.api + upyunConfig.bucket
      },
      upladData: () => {
        let options = {}
        options.bucket = upyunConfig.bucket
        options['save-key'] = upyunConfig['save-key']
        options.expiration = Math.floor(new Date().getTime() / 1000) + 86400
        const policy = window.btoa(JSON.stringify(options))
        const signature = md5(policy + '&' + upyunConfig.apiSecret)

        const data = {}
        data.policy = policy
        data.signature = signature
        return data
      }
    },
    mounted() {},
    methods: {
      beforeUpload(file) {
        let name = file.name
        let type = file.type
        let size = file.size / 1024 / 1024
        let validate_type = false
        let validate_size = false

        if (type.indexOf("image/") != -1) {
          let format = type.split("image/")[1]
          if (this.type.indexOf(format) != -1) {
            validate_type = true
          }
          else {
            this.$message.error(name + '图片格式不支持');
            return false
          }
        }
        else {
          this.$message.error('只允许上传图片');
          return false
        }

        if (size > this.size) {
          this.$message.error(name + '图片大小不能超过'+ this.size + 'M');
          return false
        }
        else {
          validate_size = true
        }

        return validate_type && validate_size;
      },
      uploadSuccess(response, file, fileList) {
        this.images.push({
          url: file.response.url,
          path: upyunConfig.domain+ file.response.url,
          name: file.name
        })
        this.$emit('success', this.images, response)
      },
      uploadError(err, file, fileList) {
        this.$message.error('上传失败');
        // this.$emit('error', this.images)
      },
      removeImage(index) {
        this.images.splice(index, 1)
        this.$emit('remove', this.images)
      },
      handleExceed(){
        this.$message.warning(`当前限制上传选择${this.limit}个文件`);
      },
    }
  }
</script>

<style lang="scss" scoped>
.wx-upload {
  display: flex;
  .upload-images {
    margin: 0;
    padding: 0;
    li {
      list-style: none;
      float: left;
      margin-right: 10px;
      position: relative;
      .delete-image-btn {
        position: absolute;
        top: -15px;
        right: -15px;
        &:before {
          font-size: 30px;
        }
      }
    }
  }
}
</style>
