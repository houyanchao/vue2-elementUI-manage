<template>
  <div class="wx-files">
    <ul>
      <li v-for="item in list">
        <a href="javascript:void(0)" class="file-container">
          <i class="el-icon-document" style="padding-right:3px;"></i>
          {{item.name}}
          <a class="download-container" :download="item.name" :href="item.path" v-if="isDownload"><i class="el-icon-download"></i></a>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'wx-files',
  data(){
    return {}
  },
  props: {
    list: {
      type: Array,
      default: function(){
        return []
      }
    },
    isDownload: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    list(){
      for(let i=0; i<this.list.length; i++){
          this.list[i].path = upyunConfig.domain+this.list[i].path
      }
    }
  },
  mounted(){}
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .wx-files{
    ul{
      padding-left: 60px;
      li{
        list-style: none;
        .file-container{
          display: inline-block;
          width: 100%;
          position: relative;
          padding-left: 10px;
          .download-container{
            font-weight: bold;
            font-size: 18px;
            color: #409EFF;
            position: absolute;
            right: 20px;
          }
        }
        .file-container:hover{
          background-color: #F5F7FA;
        }
      }
    }
  }
</style>
