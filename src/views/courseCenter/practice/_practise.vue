<template lang="html">
  <div class="wx-practices">
    <el-form label-width="100px">
      <div class="practice-item">
        <el-form-item label="背景资料">
          <el-input type="textarea" v-model="backgroundInfo"
            :placeholder="'请输入练习的背景资料帮助学员理解练习'" :rows="6">
          </el-input>
          <span>(最大长度为2000个字符  非必填)</span>
        </el-form-item>
      </div>
      <div class="practice-item" v-for="practice,index in list" :key="index">
        <el-form-item :required="true" :label="`第${index + 1}题`" required>
          <el-input type="textarea" v-model="practice.description"
            :rows="6" :placeholder="'请输入练习题目'">
          </el-input>
          <span>(最大长度为500个字符  必填)</span>
          <!-- <i v-if="practice.question_id == '0' && index > 0"
          class="el-icon-circle-close-outline" @click="del(index)"></i> -->
        </el-form-item>
      </div>
      <el-form-item>
        <el-button icon="el-icon-plus" @click.native="addPractice">添加题目</el-button>
        <el-button type="primary" @click="savePractice">立即保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      list: [],
      backgroundInfo: '', // 背景信息
    }
  },
  props: {
    practices: {
      type: Array,
      default: () => { // question_id ！0：默认后台题目 0：新增题目
        return []
      }
    },
    description: {
      type: String,
      default: ''
    }
  },
  mounted () {
    this.main()
  },
  methods: {
    main() {
      if(this.practices.length > 0) { // 编辑
        this.list = this.practices
        this.backgroundInfo = this.description
      }
      else {
        this.list = [
          {
            "question_id": "0",  // 默认题目
            "description": ""
          }
        ]
      }
    },
    addPractice() {
      this.list.push(
        {
          "question_id": "0",
          "description": ""
        }
      )
    },
    del(index) {
      this.list.splice(index, 1)
    },
    savePractice() {
      this.$emit('save', this.list, this.backgroundInfo)
    },
  },
  components: {}
}
</script>

<style lang="scss" scoped>
.practice-item {
  width: 50%;
}
</style>
