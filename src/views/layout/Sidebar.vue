<template>
  <el-menu mode="vertical" theme="dark" :default-active="$route.path" background-color="#324157"
      text-color="#fff"
      active-text-color="#ffd04b">
    <sidebar-item :routes="routes"></sidebar-item>
  </el-menu>
</template>

<script>
import SidebarItem from './SidebarItem'
export default {
  components: { SidebarItem },
  computed: {
    routes() {
      return this.$router.options.routes
    }
  }
}
</script>
