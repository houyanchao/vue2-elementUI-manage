<template>
  <div class="wx-qrcode">
    <el-dialog title="签到二维码（需要会务端提供地址）" :visible="visible" @close="close">
      <vue-q-art :config="config" :class="{'zoomIn': zoomIn, 'zoomIn_mini': !zoomIn}"></vue-q-art>
      <el-button size="mini" type="primary" round @click="download">下载</el-button>
      <el-button size="mini" round @click="zoomInClick" >
        <template v-if="zoomIn">缩小</template>
        <template v-if="!zoomIn">放大</template>
      </el-button>
    </el-dialog>
  </div>
</template>

<script>
import VueQArt from 'vue-qart'
export default {
  name: 'wx-qrcode',
  data(){
    return {
      config: {
          value: '',
          imagePath: require('@/assets/404_images/404.png'),
          filter: 'color',
          size: 500
      },
      zoomIn: false
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: false
    },
  },
  watch: {
    value(c, o){
      this.config.value = c
    }
  },
  components: {VueQArt},
  mounted(){},
  methods: {
    download(){
      let myCanvas = document.getElementsByClassName("qr-code-container")[0].getElementsByTagName("canvas")[0]
      const type = 'image/png';
      let image = myCanvas.toDataURL(type).replace(type, "image/octet-stream");
      window.location.href = image; // it will save locally
    },
    zoomInClick(){
      this.zoomIn = !this.zoomIn
    },
    close(){
      this.zoomIn = false;
      this.$emit("close")
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .wx-qrcode{
    text-align: center;
    .zoomIn{
      canvas{
          width: 600px!important;
          height: 600px!important;
      }
    }
    .zoomIn_mini{
      canvas{
          width: 400px!important;
          height: 400px!important;
      }
    }
  }
</style>
