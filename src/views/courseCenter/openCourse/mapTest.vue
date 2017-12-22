<template>
    <div class="amap-page-container">
      <el-input v-model="address" placeholder="请输入内容" @blur="changLocation"></el-input>
      <el-amap vid="amapDemo" class="amap-box" v-if="isShowMap"
        :center="center" :zoom="18" :events="events">
        <el-amap-marker :position="center"></el-amap-marker>
      </el-amap>
      <div class="test">
        {{lng}} || {{lat}}
      </div>
    </div>
  </template>

  <script>

    export default {
      data() {
        return {
          isShowMap: false,
          center: [],
          lng: '',
          lat: '',
          address: '安徽省合肥市包河区政府',
          events: {
            click: (e) => {
              let self = this
              let { lng, lat } = e.lnglat
              self.lng = lng
              self.lat = lat
              self.center = [self.lng, self.lat]
            },
          }
        };
      },
      methods: {
        changLocation() {
          if (!this.address) {
            this.isShowMap = false
            this.lng = null
            this.lat = null
          }
          else {
            let self = this
            let geocoder = new AMap.Geocoder({
              radius: 1000,
              extensions: "all"
            });

            geocoder.getLocation(self.address, function(status, result) {
              if (status === 'complete' && result.info === 'OK') {
                if (result.geocodes.length) {
                  result.geocodes.forEach(item => {
                    self.lng = item.location.lng
                    self.lat = item.location.lat
                    self.center = [self.lng, self.lat]
                    self.isShowMap = true
                  })
                }
              }
            })
          }
        },
      }
    };
</script>
<style scoped>
  .amap-box {
    width: 100%;
    height: 300px;
  }
</style>
