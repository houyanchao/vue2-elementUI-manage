<template lang="html">
  <div class="wx-copy">
    <ul>
      <li v-for="list,index in lists" :key="index" style="width: 200px;height: 200px;display:inline-block">
        <div class="zoom-img" v-img="list"> </div>
        <img class="easy-img" :src="list" />
      </li>
    </ul>
    <p>{{copyData}}</p>
    <button v-clipboard="copyData" @success="handleSuccess" @error="handleError">复制</button>
    <ul class="time-test">
      <li v-for="time,index in times">
        <p v-time="time">
          <span class="hours">00</span>：
          <span class="minute">00</span>：
          <span class="second">00</span>
        </p>
      </li>
    </ul>

    <div @click="isShow = true">
      点击我显示选讲师
    </div>
    <ul>
      <li v-for="item,index in selectTeachers">{{item.name}}</li>
    </ul>
    <select-teacher :isShow="isShow" :list="selectTeachers"
     @close="isShow = false" @confirm="selectedTeacher"></select-teacher>
  </div>
</template>

<script>
import selectTeacher from './_selectTeacher.vue'
export default {
  data () {
    return {
      isShow: false,
      selectTeachers: [], // 讲师列表
      copyData: '我是公开课参课信息，我想要复制他',
      times: ['5500', '15845855', '12319023'],
      lists: [
        'http://img.taopic.com/uploads/allimg/140123/234814-14012312122722.jpg',
        'http://www.zhlzw.com/UploadFiles/Article_UploadFiles/201210/20121006154614667.jpg',
        'http://imp.todaycity.cn/cba47410529b4697b2ace4ff596040af.jpg@400w_400h_80q_1pr.jpg',
        'http://s.amazeui.org/media/i/demos/bing-1.jpg',
        'http://s.amazeui.org/media/i/demos/bing-4.jpg',
        'http://s.amazeui.org/media/i/demos/bing-3.jpg',
        'http://s.amazeui.org/media/i/demos/bing-2.jpg'
      ]
    }
  },
  directives: {
    img: {
      inserted: function(el, binding) {
        let bgColor = Math.floor(Math.random() * 1000000)
        el.style.backgroundColor = '#' + bgColor
        // el.style.backgroundImage = "url('默认图片路径')"
        let img = new Image()
        img.src = binding.value

        img.onload = function () {
          el.style.backgroundImage = `url(${img.src})`
        }
      }
    },
    time: {
      inserted: function(el, binding) {
        let t = binding.value
        let h, m, s
        let timer = setInterval(() => {
          t -= 1000
          if (t < 1000) {
            clearInterval(timer)
            h = m = s = 0
          }
          else {
            h = Math.floor(t / 1000 / 3600)
            m = Math.floor(t / 1000 % 3600 / 60)
            s = Math.floor(t / 1000 % 3600 % 60)
          }
          el.getElementsByClassName('hours')[0].innerHTML = (h < 10) ? ('0' + h) : h
          el.getElementsByClassName('minute')[0].innerHTML = (m < 10) ? ('0' + m) : m
          el.getElementsByClassName('second')[0].innerHTML = (s < 10) ? ('0' + s) : s
        }, 1000)
      }
    }
  },
  computed: {},
  mounted () {},
  methods: {
    handleSuccess(e) {
      this.$message('复制成功，快去粘贴吧')
    },
    handleError(e) {
        console.log(e);
    },
    selectedTeacher(list) {
      this.selectTeachers = list
      this.isShow = false
    }
  },
  components: {
    selectTeacher
  }
}
</script>

<style lang="scss" scoped>
.zoom-img {
  width: 100%;
  height: 0;
  overflow: hidden;
  padding-bottom: 100%;
  background-position: center center;
  background-repeat: no-repeat;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  background-size: cover;
}
.easy-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
