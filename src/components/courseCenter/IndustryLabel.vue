<!-- 弹窗选择标签 -->
<template lang="html">
  <div class="wx-industry-label">
    <el-tag v-for="tag in backTags" :key="tag.tag_id" type="success" closable @close="closeTag(tag,1)" style="margin-right: 5px;">{{tag.name}}</el-tag>
    <el-button @click="choose" type="info">{{name}}</el-button>
    <el-dialog title="选择行业标签" :visible="dialogTagVisible" @close="cancel" append-to-body>
      <div class="tag-label-selected-container">
        <el-tag v-for="tag in selectedTags" :key="tag.tag_id" type="success" v-if="tag.selected" closable @close="closeTag(tag)">{{tag.name}}</el-tag>
      </div>
      <div class="tag-label-container">
        <!-- 一级标签 -->
        <ul class="first-level">
          <li v-for="tag in tags" :class="tag.on||tag.selected ? (tag.on?(tag.selected?'selected on':'on'):(tag.selected?'selected':'')):(tag.selected?'selected':'') "  @click="tagOn(tag)">{{tag.name}}<em></em></li>
        </ul>
        <!-- 二级标签 -->
        <div class="second-level">
          <template v-for="tag1 in tags">
            <div class="tag2-container" v-if="tag1.on"><span :class="tag1.selected ? 'tag2 selected' : 'tag2' " @click="tag2Click(tag1,1)">全部</span></div>
            <template v-for=" (tag2, index2) in tag1.children">
              <div class="tag2-container" v-if="tag1.on">
                <span :class="tag2.selected ? 'tag2 selected' : 'tag2' " @click="tag2Click(tag2,1)">
                  <template v-if="!tag2.hasChildren">{{tag2.name}}</template>
                  <template v-if="tag2.hasChildren">
                    <el-popover
                      placement="bottom"
                      title=""
                      width="650"
                      trigger="click"
                      content="">
                      <!-- 三级标签 -->
                      <div class="tag3-container" v-if="tag2.children.length > 0"><span :class="tag2.selected ? 'tag3 selected' : 'tag3' " @click="tag2Click(tag2,2)">全部</span></div>
                      <template v-for="tag3 in tag2.children">
                        <div class="tag3-container"><span :class="tag3.selected ? 'tag3 selected' : 'tag3' " @click="tag2Click(tag3,2)">{{tag3.name}}</span></div>
                      </template>
                      <span slot="reference">{{tag2.name}}</span>
                    </el-popover>
                  </template>
                </span>
              </div>
            </template>
          </template>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="sub">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import {tagList} from '@/service/default'

export default {
  name: "wx-industry-label",
  data(){
    return {
        dialogTagVisible: false,
        tags: [],//接口返回的标签
        newTags: [],//初始化标签
        selectedTags:[],//弹窗中选中的标签
        backTags: []//点击确定后选中的标签
    }
  },
  props:{
    initTag: {//[{name: '互联网1', tag_id: '21'}]
      type: Array,
      default: function(){
        return []
      }
    },
    type: {//1行业标签 2岗位标签 3职位标签 4课程分类/擅长领域 5企业固定标签
      type: String,
      default: '1'
    },
    limit: {//数量限制
      type: Number,
      default: 10000
    },
    name: {
      type: String,
      default: '选择标签'
    }
  },
  watch: {
    initTag(c,o){
      this.initTags()
    }
  },
  mounted(){
    let _this = this
    this.requestTags()
  },
  methods:{
    closeTag(tag, type){
      tag.selected = false;
      this.selectedTag(tag)
      if(type && type == 1){
        if(this.backTags.indexOf(tag) != -1){
          this.backTags.splice(this.backTags.indexOf(tag),1)
        }else{
          this.backTags.push(tag)
        }
        this.$emit("backTags",this.backTags,this.type)
      }
    },
    selectedTag(tag){
      if(this.selectedTags.indexOf(tag) != -1){
        this.selectedTags.splice(this.selectedTags.indexOf(tag),1)
      }else{
        this.selectedTags.push(tag)
      }
    },
    tagOn(tag){//一级标签选择
      for(var i=0; i<this.newTags.length; i++){
        if(this.newTags[i].level == 0 && this.newTags[i].on){
          this.newTags[i].on = false
          break;
        }
      }
      tag.on = true
    },
    tag2Click(tag, level){
        let count = 0
        for(var i=0; i<this.newTags.length; i++){
          if(this.newTags[i].selected){
            count++
          }
        }

        if(tag.hasChildren && tag.level == level){//有子标签但不是“全部”（可点击）
          // 点击有三级标签的二级标签
        }else{// 全部或者没有子标签的元素（可选择）
          if(tag.selected){//如果选中状态就取消选中
            tag.selected = false;
            this.selectedTag(tag)
          }else{
            if(tag.level != level){//选中全部
              tag.selected = true
              this.selectedTag(tag)
              for(var i=0; i<this.newTags.length; i++){
                //同级标签取消选中
                if(this.newTags[i].level == level && this.newTags[i].selected && this.newTags[i].parent_id == tag.tag_id){
                  this.newTags[i].selected = false
                  this.selectedTag(this.newTags[i])
                }
                //孙子标签也取消选中
                if(this.newTags[i].level == level && this.newTags[i].parent_id == tag.tag_id && this.newTags[i].hasChildren){//孙子组件也取消选中
                  for(var j=0; j<this.newTags[i].children.length; j++){
                    if(this.newTags[i].children[j].selected){
                      this.newTags[i].children[j].selected = false
                      this.selectedTag(this.newTags[i].children[j])
                    }
                  }
                }
                // 如果上级标签的上级标签的全部也被选中，则取消选中
                if(this.newTags[i].tag_id == tag.parent_id && this.newTags[i].selected){
                  this.newTags[i].selected = false
                  this.selectedTag(this.newTags[i])
                }
              }
            }else{

              if(count >= this.limit){//数量限制
                this.$message({
                  message: '最多选择'+this.limit+"个标签",
                  type: 'warning'
                });
                return
              }

              tag.selected = true
              this.selectedTag(tag)
              for(var i=0; i<this.newTags.length; i++){//同级标签取消选中
                if(this.newTags[i].tag_id == tag.parent_id && this.newTags[i].selected){
                  this.newTags[i].selected = false
                  this.selectedTag(this.newTags[i])
                }
              }
              if(level == 2){//如果父级标签的全部也是选中状态，则取消选中
                for(var l=0; l<this.newTags.length;l++){
                  if(tag.parent_id == this.newTags[l].tag_id){
                    for(var w=0; w<this.newTags.length;w++){
                      if(this.newTags[l].parent_id == this.newTags[w].tag_id && this.newTags[w].selected){
                        this.newTags[w].selected = false
                        this.selectedTag(this.newTags[w])
                        break
                      }
                    }
                  }
                }
              }
            }
          }
        }
    },
    choose(){
      this.dialogTagVisible = true
    },
    initNewTags(tags){
      var newTags = []
      for(var i=0; i<tags.length; i++){
        var tag1= tags[i]
        if(i == 0){
            tag1.on = true
        }else{
          tag1.on = false
        }
        tag1.level = 0
        tag1.selected = false
        if(tag1.children&&tag1.children.length>0){
          tag1.hasChildren = true
          newTags.push(tag1)
          // 循环二级标签
          var tags2 = tag1.children
          for(var j=0; j<tags2.length; j++){
            var tag2 = tags2[j]
            tag2.on = false
            tag2.level = 1
            tag2.selected = false
            if(tag2.children && tag2.children.length>0){
              tag2.hasChildren = true
              newTags.push(tag2)
              var tags3 = tag2.children
              for(var t=0; t<tags3.length; t++){
                var tag3 = tags3[t]
                tag3.on = false
                tag3.level = 2
                tag3.selected = false
                newTags.push(tag3)
              }
            }else{
              tag2.hasChildren = false
              newTags.push(tag2)
            }
          }
        }else{
          tag1.hasChildren = false
          newTags.push(tag1)
        }
      }

      this.tags = tags
      this.newTags = newTags
      this.initTags()
    },
    requestTags(){
      const type = 1
      const _this = this
      tagList({
        type: _this.type
      },function(res){
        if(res.code == '200'){
          let tags = res.data.tags
          _this.initNewTags(tags)
        }
      },function(){
      })
    },
    sub(){
      this.backTags = this.selectedTags.concat();
      this.dialogTagVisible = false
      this.$emit("backTags",this.backTags,this.type)
    },
    cancel(){
      this.selectedTags = []
      for(var j=0; j<this.newTags.length;j++){
        if(this.newTags[j].level == 0 && this.newTags[j].on){//保持当前第一级标签打开
          this.newTags[j].on = true
        }else{
          this.newTags[j].on = false
        }
        this.newTags[j].selected = false
        for(var i=0; i<this.backTags.length; i++){
          if(this.backTags[i].tag_id == this.newTags[j].tag_id){
            this.newTags[j].on = true
            this.newTags[j].selected = true
            this.selectedTag(this.newTags[j])
          }
        }
      }
      this.dialogTagVisible = false
      // this.$emit("backTags",this.backTags)
    },
    initTags(){//第一次进来初始化标签
      for(var i=0; i<this.newTags.length; i++){
        this.newTags[i].selected = false
      }
      this.backTags = []
      this.selectedTags = []

      for(var i=0; i<this.initTag.length; i++){
        for(var j=0; j<this.newTags.length; j++){
          if(this.newTags[j].tag_id == this.initTag[i].tag_id){
            this.newTags[j].selected = true
            this.selectedTag(this.newTags[j])
          }
        }
      }
      this.backTags = this.selectedTags.concat();
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .tag-label-selected-container{
      padding-bottom: 10px;
      .el-tag{
        margin-right: 10px;
      }
    }
  .tag-label-container{
      border-top: 1px solid #d7d7d7;
      border-bottom: 1px solid #d7d7d7;
      overflow: hidden;
      .first-level{
        width: 150px;
        float: left;
        margin: 0;
        padding-left: 0;
        li{
          list-style: none;
          position: relative;
          line-height: 18px;
          cursor: pointer;
          word-wrap: break-word;
          word-break: normal;
          padding: 8px 0 8px 14px;
          background-color: #E7E7E7;
          em{
            display: none;
            position: absolute;
            width: 5px;
            height: 100%;
            top: 0;
            left: 0;
            background-color: #ff6000;
          }
        }
        .on{
          font-weight: bold;
          color: #ff6000;
          background-color: #fff;
          em{
            display: block;
          }
        }
        .selected{
          background-color: #ffa63c;
          color: white;
        }
      }
      .second-level{
        padding-top: 10px;
        .tag2-container{
          display: inline-block;
          .tag2{
            display: inline-block;
            border-radius: 3px;
            padding: 2px 12px;
            margin: 0 5px 5px;
            cursor: pointer;
            text-align: center;
            &:hover{
              background-color: #d7d7d7;
            }
          }
        }

        .selected{
          background-color: #ffa63c;
          color: white;
          &:hover{
            background-color: #ffa63c!important;
          }
        }
      }
    }
  .el-popover{
    .tag3-container{
        display: inline-block;
       .tag3{
         display: inline-block;
         padding: 2px 12px;
         border-radius: 3px;
         margin: 0 5px 5px;
         cursor: pointer;
         text-align: center;
         &:hover{
           background-color: #d7d7d7;
         }
       }
       .selected{
         background-color: #ffa63c;
         color: white;
         &:hover{
           background-color: #ffa63c!important;
         }
       }
     }
  }
</style>
