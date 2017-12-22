<template lang="html">
  <div class="wx-open-course">
    我是公开课详情{{$route.params.course_id}}
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  computed: {},
  mounted () {
    this.getQuery()
  },
  methods: {
    getQuery() {
      console.log(this.$route.params.course_id, process.env.MAP_AK);
    }
  },
  components: {}
}
</script>

<style lang="css">
</style>
