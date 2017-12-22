<template lang="html">
  <el-form class="description">
    <el-form-item label="课程简介" class="upload" required>
      <div class="image">
        <img-upload :isShowImageList="false" :limit="1000" @success="success"></img-upload>
      </div>
      <div class="text">
        <el-input type="textarea" :rows="5"
          placeholder="课程简介尽量包含课程大纲、课程注意事项、课程介绍"
          v-model="descriptionsText">
        </el-input>
        <el-button type="primary" plain @click="addDescription(1)">新增文本简介</el-button>
      </div>
    </el-form-item>

    <el-form-item label="课程简介预览" class="list" v-if="descriptions.length">
      <ul>
        <li v-for="description,index in descriptions" :key="index"
          :class="description.type == 1 ? 'text' : 'image'">
          <el-input v-if="description.type == 1" type="textarea" :rows="11" :disabled="true"
            :placeholder="description.content" :style="{'width': '245px'}">
          </el-input>
          <wx-img v-if="description.type == 2" :src="description.url" :width="245" :height="245"></wx-img>
          <el-button type="primary" size="samll" plain @click="deleteDescription(index)">删除</el-button>
        </li>
      </ul>
      <div class="description-btn">
        <el-button type="primary" size="medium" @click="confirmDescription">保存简介</el-button>
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
import wxImg from 'components/common/Image.vue'
import ImgUpload from 'components/imgUpload/ImgUpload1'
import upyunConfig from 'components/imgUpload/config.js'
export default {
  props: {
    descriptions: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      descriptionsText: '',  // 临时文本
      descriptionsImageUrl: '',  // 临时上传成功的图片地址
    }
  },
  computed: {},
  mounted () {},
  methods: {
    success(images, fileData) {
      this.descriptionsImageUrl = upyunConfig.domain + fileData.url
      this.addDescription(2)
    },
    addDescription(type) {  // type 1: 文本 2: 图片 3:等等
      if (type == 1) {
        if (this.descriptionsText == '') return
        this.descriptions.push({
          type: type,
          content: this.descriptionsText
        })

        this.descriptionsText = ''
      }
      else {
        this.descriptions.push({
          type: type,
          url: this.descriptionsImageUrl
        })

        this.descriptionsImageUrl = ''
      }
    },

    deleteDescription(index) {
      this.descriptions.splice(index, 1)
    },
    confirmDescription() {
      this.$emit('success', this.descriptions)
    }
  },
  components: {
    ImgUpload,
    wxImg
  }
}
</script>

<style lang="scss">
.description {
  width: 100;
  .upload {
    width: 100%;
    .el-form-item__content {
      display: flex;
      display: -webit-flex;
    }
    .image {
      flex: 0 0 160px;
    }

    .text {
      flex: 1;
    }
  }

  .list {
    ul {
      margin-left: 60px;
      min-height: 280px;
      list-style: none;
      li {
        float: left;
      }
      .text {
        position: relative;
        button {
          position: absolute;
          bottom: -44px;
          left: 0;
        }
      }
    }
    .description-btn {
      margin-left: 100px;
    }
  }
}
</style>
