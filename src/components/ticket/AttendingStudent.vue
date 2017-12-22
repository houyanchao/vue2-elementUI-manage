<template>
  <div class="wx-attending-student">
    <el-dialog title="参课人员" :visible="visible" class="dialog-container" @close="close">

    </el-dialog>
  </div>
</template>
<script>

  export default {
    name: 'wx-attending-student',
    data() {
      return {
      };
    },
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      organization_id: {
        type: String,
        default: ''
      },
      ticket_id: {
        type: String,
        default: ''
      }
    },
    watch: {
      visible(c,o){
        if(c){
          //获取门票详情
        }else{

        }
      },
      organization_id(c,o){
        this.ruleForm.organization_id = c
      },
      ticket_id(c, o){
        this.ruleForm.ticket_id = c
      }
    },
    computed: {},
    mounted(){},
    methods: {
      close(){
        this.$emit("close")
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" >
  .wx-attending-student{
    .dialog-container{
    }
  }
</style>
