<template lang="html">
  <div class="add-course-second">
    <el-form :model="courseForm" ref="courseForm" label-width="100px">
      <el-form-item label="课程讲师">
        <div class="teachers" v-if="teachers.length">
          <span v-for="teacher,index in teachers">{{teacher.name}}、</span>
        </div>
        <div class="teachers" v-else>
          <span>未在第一步选择</span>
        </div>
      </el-form-item>
      <el-form-item label="课程名称">
        <div class="courses" v-if="courses.length">
          <span v-for="item,index in courses">{{item.title}}</span>
        </div>
        <div class="courses" v-else>
          <span>未在第一步选择</span>
        </div>
      </el-form-item>
      <el-button type="primary" disabled>基础信息</el-button>
      <el-form-item label="课程分类" required>
        <el-select filterable v-model="courseForm.categoryFirstId" placeholder="请选择课程一级分类" @change="courseCategoryChange">
          <el-option v-for="category,index in categoryFirst" :key="index"
            :label="category.name" :value="category.tag_id">
          </el-option>
        </el-select>
        <el-select filterable v-model="courseForm.categorySecondId" placeholder="请选择课程二级分类">
          <el-option v-for="category,index in categorySecond" :key="index"
            :label="category.name" :value="category.tag_id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="行业标签">
        <industry-label :type="'1'" @backTags="tradeTags"></industry-label>
      </el-form-item>
      <el-form-item label="岗位标签">
        <industry-label :type="'2'" @backTags="stationTags"></industry-label>
      </el-form-item>
      <el-form-item label="职务标签" required>
        <industry-label :type="'3'" @backTags="workTags"></industry-label>
      </el-form-item>

      <el-form-item label="课程主图" required>
        <img-upload :limit="1" @success="successMasterImage"  @remove="masterImageRemove"></img-upload>
      </el-form-item>
      <el-form-item label="课程缩略图" required>
        <img-upload :limit="1" @success="successBreviaryImage" @remove="breviaryImageRemove"></img-upload>
      </el-form-item>

      <el-form-item label="课程背景">
        <el-input type="textarea" v-model="courseForm.introduce1"
          placeholder="可简单阐述下课程培训的背景，帮助用户了解自身的实际情况选择报名"
          :maxlength="500" :rows="3">
        </el-input>
      </el-form-item>

      <el-form-item label="课程收益">
        <el-input type="textarea" v-model="courseForm.introduce2"
          placeholder="请简单罗列下，学员学习课程后能够预计获得到的一些收获"
          :maxlength="200" :rows="2">
        </el-input>
      </el-form-item>

      <el-form-item label="课程对象">
        <el-input type="textarea" v-model="courseForm.introduce3"
          placeholder="请简单描述下该课程适合的对象"
          :maxlength="200" :rows="2">
        </el-input>
      </el-form-item>

      <el-form-item label="课程简介" class="description" required>
        <editor @success="editorBack"></editor>
        <!-- <div class="description-image">
          <img-upload :isShowImageList="false" :limit="1000" @success="successDescriptionImage"></img-upload>
        </div>
        <div class="description-text">
          <el-input type="textarea" :rows="5"
            placeholder="课程简介尽量包含课程大纲、课程注意事项、课程介绍"
            v-model="descriptionsText">
          </el-input>
          <el-button type="primary" plain @click="addDescription(1)">新增文本简介</el-button>
        </div> -->
      </el-form-item>

      <!-- <el-form-item label="课程简介预览" v-if="descriptions.length">
        <ul class="description-list">
          <li v-for="description,index in descriptions" :key="index">
            <template v-if="description.type == 1">
              <el-input type="textarea" :rows="11" :disabled="true"
                :placeholder="description.content" :style="{'width': '245px'}">
              </el-input>
            </template>
            <template v-if="description.type == 2">
              <wx-img :src="description.url" :width="245" :height="245"></wx-img>
            </template>
            <el-button type="primary" plain @click="deleteDescription(index)">删除</el-button>
          </li>
        </ul>
      </el-form-item> -->

      <el-button type="primary" disabled>开课信息</el-button>
      <el-form-item label="开课日期" required>
        <el-date-picker placeholder="课程开始日期" v-model="courseForm.startDate" class="width_400"></el-date-picker>-
        <el-date-picker placeholder="课程结束日期" v-model="courseForm.endDate" class="width_400"></el-date-picker>
        <el-button type="primary" plain @click="confirmAddSyllabus">确定</el-button>
        <el-table :data="courseForm.syllabus" v-if="courseForm.isShowSyllabus" :border="true"
          :stripe="true" align="center" style="width:580px;margin-top:15px">
          <el-table-column align="center" prop="date" label="开课日期" width="120"></el-table-column>
          <el-table-column align="center" label="上课时间" width="180">
            <template slot-scope="scope">
              <el-time-select v-model="scope.row.start" calss="width_100"
                :editable="false" :picker-options="{
                  start: '00:00',
                  step: '00:10',
                  end: '23:00'
                }">
              </el-time-select>
            </template>
          </el-table-column>
          <el-table-column align="center" label="下课时间" width="180">
            <template slot-scope="scope">
              <el-time-select v-model="scope.row.end"
                :editable="false" :picker-options="{
                  start: '00:00',
                  step: '00:10',
                  end: '23:00'
                }">
              </el-time-select>
            </template>
          </el-table-column>
          <el-table-column align="center" label="课时" width="100">
            <template slot-scope="scope">
              <el-input v-model="scope.row.hours"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item label="报名时间" required>
        <el-date-picker type="datetime"
          placeholder="开始报名时间" v-model="courseForm.reportStartTime" class="width_400"></el-date-picker>-
        <el-date-picker type="datetime"
          placeholder="报名结束时间" v-model="courseForm.reportEndTime" class="width_400"></el-date-picker>
      </el-form-item>

      <el-form-item label="常驻地" required>
        <el-select filterable v-model="courseForm.location.province_id" @change="provinceChange" placeholder="省" clearable>
          <el-option v-for="province,index in provinces" :key="index"
            :label="province.region_name" :value="province.region_id">
          </el-option>
        </el-select>
        <el-select filterable v-model="courseForm.location.city_id" @change="cityChange" placeholder="市" clearable>
          <el-option v-for="city,index in citys" :key="index"
            :label="city.region_name" :value="city.region_id">
          </el-option>
        </el-select>
        <el-select filterable v-model="courseForm.location.area_id" placeholder="区" clearable>
          <el-option v-for="area,index in areas" :key="index"
            :label="area.region_name" :value="area.region_id">
          </el-option>
        </el-select>
        <el-input v-model="courseForm.address" placeholder="请填写详细地址" style="margin-top: 10px; width: 50%;"></el-input>
      </el-form-item>
      <!-- <el-form-item label="地理位置">
        <span>地图最后弄 先把经纬度写死为{{courseForm.geo.lng}}, {{courseForm.geo.lat}}</span>
      </el-form-item> -->

      <el-form-item label="取消报名" required>
        <el-radio-group v-model="courseForm.isCancel">
          <el-radio :label="'N'">不可取消</el-radio>
          <el-radio :label="'Y'">可取消</el-radio>
          <el-date-picker v-if="courseForm.isCancel == 'Y'" placeholder="取消截止日期"
          v-model="courseForm.cancelDate" type="datetime"  class="width_400"></el-date-picker>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="单客户限制" required>
        <el-input v-model="courseForm.userLimit" placeholder="单客户名额限制，0为不限制" class="width_400"></el-input>
      </el-form-item>
      <!--<el-form-item label="课程主办" required>
         <el-select filterable v-model="courseForm.agency_id" placeholder="请选择课程主办分区">
          <el-option v-for="category,index in courseForm.categoryFirst" :key="index"
            :label="category.name" :value="category.id">
          </el-option>
        </el-select>
      </el-form-item>-->
      <el-form-item label="招生人数" required>
        <el-input v-model="courseForm.max_count" placeholder="请输入课程招生名额上限" class="width_400"></el-input>
      </el-form-item>
      <el-form-item label="门票数">
        <el-input v-model="courseForm.ticket_count" placeholder="输入学习卡门票数，不填为免费" class="width_400"></el-input>
      </el-form-item>
      <el-form-item label="报名费用">
        <el-input v-model="courseForm.original_price" placeholder="输入报名费用，不填为免费" class="width_400"></el-input>
      </el-form-item>
      <el-form-item label="优惠费用">
        <el-input v-model="courseForm.price" placeholder="优惠费用不填则为无优惠" class="width_400"></el-input>
      </el-form-item>
      <el-form-item label="服务热线" required>
        <el-input v-model="courseForm.hotline" placeholder="输入学员可联系的练习方式" class="width_400"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm" class="width_200">保存</el-button>
        <!-- <el-button @click="resetForm('courseForm')">重置</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import Editor from '@/components/common/Editor'
  import IndustryLabel from 'components/courseCenter/IndustryLabel'
  // import ImgUpload from 'components/imgUpload/ImgUpload1'
  import wxImg from 'components/common/Image.vue'
  import openCourse from 'service/courseCenter/openCourse/create'
  import upyunConfig from 'components/imgUpload/config.js'

  import {tagList, regionList} from 'service/default.js'
  export default {
    components: {
      IndustryLabel,
      ImgUpload,
      Editor,
      wxImg,
    },
    props: {
      teachers: {
        type: Array,
        default: []
      },
      courses: {
        type: Array,
        default: []
      },
      courseInfo: {
        type: Object,
      }
    },
    data() {
      return {
        categoryFirst: [],     // 一级分类
        categorySecond: [],    // 二级分类
        provinces: [],         // 省份数组
        citys: [],             // 市数组
        areas: [],             // 区、县数组
        descriptions: [],
        // descriptionsText: '',  // 临时文本
        // descriptionsImageUrl: '',  // 临时上传成功的图片地址
        syllabusIndex: 0,
        // 以上为修改后的

        courseForm: {
          title: '',             // 课程标题
          teachers: [],          // 课程库讲师
          temporaryTeacher: [],  // 临时讲师
          // 已完成
          categoryFirstId: '',
          categorySecondId: '',
          category_ids: [],     // ["1","5"]  后台需要的数组形式  第一项为一级分类  第二项为二级分类
          tradeTags: [],           // 行业标签列表 对应后台tags_1  [{"tag_id":"1","title":"x","level":"2"}]
          stationTags: [],
          workTags: [],
          masterImage: '',       // 课程主图
          breviaryImage: '',     // 缩略图
          introduce: '',         // 课程相关介绍  课程背景  课程收益 课程对象
          introduce1: '',
          introduce2: '',
          introduce3: '',
          startDate: '',  // 开始日期
          endDate: '',    // 结束日期
          startTime: '',  // 开始日期的具体时间
          endTime: '',    // 结束日期的具体时间
          syllabus: [],   // 课程表数组  提交时传给后台
          isShowSyllabus: false,  // 课程表显隐
          reportStartTime: '',  // 开始报名时间
          reportEndTime: '',  // 结束报名时间
          location: {
            province_id: '',
            city_id: '',
            area_id: ''
          },
          address: '',           // 详细地址
          geo: {
            lng: '141.963',
            lat: '46.3'
          },
          isCancel: 'Y',       // 是否可以取消课程
          cancelDate: '',      // 取消时间
          userLimit: '0',      // 名额限制
          max_count: '',       // 招生人数
          ticket_count: '',    //字符串	非必填	  报名门票数
          original_price: '',  //	字符串	非必填	  报名费用
          price: '',           // 字符串	非必填   优惠费用
          hotline: '',
        }
      };
    },
    mounted() {
      Date.prototype.format = function() {
        let date = '';
        let mouth = (this.getMonth() + 1) >= 10 ? (this.getMonth() + 1) : ('0' + (this.getMonth() + 1))
        let day = this.getDate() >= 10 ? this.getDate() : ('0'+this.getDate())
        date += this.getFullYear() + '-' // 获取年份。
        date += mouth + "-" // 获取月份。
        date += day // 获取日。
        return (date)
      }
      this.main()
    },
    methods: {
      main() {
        this.getCategorys()
        this.getRegionList()
      },

      tradeTags(tags) {
        this.courseForm.tradeTags = []
        if (tags.length) {
          tags.forEach(tag => {
            this.courseForm.tradeTags.push({
              "tag_id": tag.tag_id,
              "name": tag.name,
              "level": tag.level
            })
          })
        }
      },
      stationTags(tags) {
        this.courseForm.stationTags = []
        if (tags.length) {
          tags.forEach(tag => {
            this.courseForm.stationTags.push({
              "tag_id": tag.tag_id,
              "name": tag.name,
              "level": tag.level
            })
          })
        }
      },
      workTags(tags) {
        this.courseForm.workTags = []
        if (tags.length) {
          tags.forEach(tag => {
            this.courseForm.workTags.push({
              "tag_id": tag.tag_id,
              "name": tag.name,
              "level": tag.level
            })
          })
        }
      },

      successMasterImage(images) {
        images.forEach(image => {
          this.courseForm.masterImage = image.url
        })
      },
      masterImageRemove(images) {
        this.courseForm.masterImage = ""
      },

      successBreviaryImage(images) {
        images.forEach(image => {
          this.courseForm.breviaryImage = image.url
        })
      },
      breviaryImageRemove(file, fileList) {
        this.courseForm.breviaryImage = ""
      },

      editorBack(list){
        this.descriptions = list
      },

      // successDescriptionImage(images, fileData) {
      //   this.descriptionsImageUrl = fileData.url
      //   this.addDescription(2)
      // },

      // addDescription(type) {  // type 1: 文本 2: 图片 3:等等
      //   if (type == 1) {
      //     if (this.descriptionsText == '') return
      //     this.descriptions.push({
      //       type: type,
      //       content: this.descriptionsText
      //     })
      //
      //     this.descriptionsText = ''
      //   }
      //   else {
      //     this.descriptions.push({
      //       type: type,
      //       url: this.descriptionsImageUrl
      //     })
      //
      //     this.descriptionsImageUrl = ''
      //   }
      // },

      deleteDescription(index) {
        this.descriptions.splice(index, 1)
      },

      confirmAddSyllabus() {
        if (!this.courseForm.startDate || !this.courseForm.endDate) {
          this.$message('请检查开课时间输入的是否正确')
        }
        else {
          if(this.courseForm.startDate > this.courseForm.endDate) {
            this.$message('请检查输入的开课日期')
            return
          }
          this.courseForm.syllabus = []  // 每次更换时间 置空原来数据
          let dateList = this.getAllDate(__tool.formatDate(this.courseForm.startDate), __tool.formatDate(this.courseForm.endDate))

          dateList.forEach(item => {
            this.courseForm.syllabus.push({
              "date": item,
              "start":" ",
              "end":" ",
              "hours":" "
            })
          })

          this.courseForm.isShowSyllabus = true
        }
      },

      // 分类完成
      getCategorys() {
        tagList(
          {type: 4},
          (res) => {
            let categorys = res.data.tags
            if (categorys.length > 0) {
              categorys.forEach(item => {
                this.categoryFirst.push(item)
              })
            }
          },
          (res) => {
            console.log('获取分类接口错误');
          }
        )
      },

      getRegionList(id, type) {
        let _type = type || 1
        regionList(
          {region_id: id},
          (res) => {
            if (_type === 1) {
              this.provinces = []
              this.provinces = res.data.region_list
            }
            else if(_type === 2) {
              this.citys = []
              this.citys = res.data.region_list
            }
            else if(_type === 3) {
              this.areas = []
              this.areas = res.data.region_list
            }
          }
        )
      },

      courseCategoryChange(val) {
        this.categorySecond = []
        this.courseForm.categorySecondId = ''
        this.categoryFirst.forEach(item => {
          if (item.tag_id == val) {
            this.categorySecond = item.children
          }
        })
      },
      provinceChange(provinceId) {
        this.courseForm.location.city_id = ''
        this.courseForm.location.area_id = ''
        this.getRegionList(provinceId, 2)
      },
      cityChange(cityId) {
        this.courseForm.location.area_id = ''
        this.getRegionList(cityId, 3)
      },
      submitForm() {
        let errors = []
        let courseForm = this.courseForm
        if (!courseForm.categoryFirstId) {
          errors.push('请选择课程分类的一级分类')
        }

        if (!courseForm.categorySecondId) {
          errors.push('请选择课程分类的二级分类')
        }

        if(!courseForm.workTags.length) {
          errors.push('请选择职务标签')
        }

        if(!courseForm.masterImage) {
          errors.push('请上传课程主图')
        }

        if(!courseForm.breviaryImage) {
          errors.push('请上传课程缩略图')
        }

        if(!this.descriptions.length) { // 特列
          errors.push('请输入课程简介')
        }

        // 没有时间的开课日期比较
        if (!courseForm.startDate || !courseForm.endDate) {
          errors.push('请输入开课日期')
        }
        if (courseForm.startDate > courseForm.endDate) {
          errors.push('结束日期不得大于开课日期')
        }

        // 课程安排模块必填操作=====
        let isSyllabusNull = false
        //  循环课程表数组中每个对象下的每个属性 从而判断用户是否必填
        if (courseForm.syllabus.length > 0) {
          courseForm.syllabus.forEach(syllabu => {
            for(let item in syllabu) {
              if (/^\s*$/.test(syllabu[item])) {  // 此处正则用于判断是否为空字符串
                isSyllabusNull = true
              }
              if (!this.syllabusIndex) {
                courseForm.startTime = syllabu['start']
              }
              courseForm.endTime = syllabu['end']
              this.syllabusIndex ++
            }
          })
        }
        else {
          errors.push('课程安排必须填写')
        }

        if(isSyllabusNull) {
          errors.push('课程安排必须填写')
        }

        let startCourseTime = __tool.formatDatetime(courseForm.startDate).replace('00:00:00', courseForm.startTime + ':00')
        let endCourseTime = __tool.formatDatetime(courseForm.endDate).replace('00:00:00', courseForm.endTime + ':00')

        if(!courseForm.reportStartTime || !courseForm.reportEndTime) {
          errors.push('请输入报名时间')
        }
        else if(courseForm.reportStartTime >= Date.parse(startCourseTime) || courseForm.reportEndTime >= Date.parse(startCourseTime)){
          errors.push('报名时间不得在开课时间之后')
        }
        else if(courseForm.reportStartTime > courseForm.reportEndTime) {
          errors.push('报名时间填写错误')
        }

        if (!courseForm.location.province_id || !courseForm.location.city_id || !courseForm.location.area_id) {
          errors.push('请选择省市区')
        }

        if (!courseForm.address) {
          errors.push('请输入详细地址')
        }

        if (courseForm.isCancel == 'Y') {
          if(!courseForm.cancelDate || courseForm.cancelDate < courseForm.reportStartTime) {
            errors.push('取消截止时间填写有误或大于课程报名时间')
          }
        }

        if (courseForm.userLimit == '') {
          errors.push('请填写单客户限额，0为不限额')
        }

        if (!courseForm.max_count) {
          errors.push('请输入招生人数')
        }

        if(!courseForm.hotline) {
          errors.push('请填写服务热线')
        }

        if (errors.length) {
          this.$message(errors[0])
        }
        else {
          // 校验全部通过后  将数据转化成后台所需数据
          let teacherIds = []
          let teacherExpand = []
          let courseSourceId = ''

          if (this.courses.length > 0) {
            courseSourceId = this.courses[0].course_source_id
          }
          this.courses.forEach(course => {  // 目前课程数组只有一项
            if(parseInt(course.course_source_id) > 0) {
              courseSourceId = course.course_source_id
            }
            courseForm.title = course.title
          })

          this.teachers.forEach(teacher => {
            if(parseInt(teacher.teacher_id) > 0) {
              teacherIds.push(teacher.teacher_id)
            }
            else {
              teacherExpand.push(teacher.name)
            }
          })

          courseForm.category_ids = [courseForm.categoryFirstId, courseForm.categorySecondId]
          courseForm.introduce = [
            {"title": "课程背景", "content": courseForm.introduce1},
            {"title": "课程收益", "content": courseForm.introduce2},
            {"title": "课程对象", "content": courseForm.introduce3},
          ]
          let cancelDate = courseForm.isCancel == 'Y' ? Date.parse(courseForm.cancelDate) / 1000 : ''
          openCourse.createCourse(
            {
              'course_source_id': courseSourceId,//	字符串	非必填
              'teacher_ids': teacherIds, //	数组	必填			讲师ID列表
              'teacher_expand': teacherExpand,//	数组	非必填			自定义新增的讲师['讲师1','讲师2'....]
              'title': courseForm.title,//	字符串	必填			课程标题
              'category_ids': courseForm.category_ids,//	数组	必填			课程分类[一级、二级分类ID]
              'public_type': '1',	//字符串	必填	1		1=公开课、2=内训课[默认传1]
              'type': '1', //	字符串	必填	1		1=线下课、2=录播课、3=直播课、4=微课[默认传1]
              'tags_1': courseForm.tradeTags,//	数组	非必填			行业签列表
              'tags_2': courseForm.stationTags,//	数组	非必填			岗位标签列表
              'tags_3': courseForm.workTags,//	数组	必填			职务标签列表
              'thumb': courseForm.breviaryImage,  // 字符串 必填 课程缩略图地址
              'image': courseForm.masterImage, // 字符串 必填 课程主图地址
              'description': courseForm.introduce,//	Array	非必填			 [{"title":"课程背景","content":"内容"}]
              'intro': this.descriptions,//	Array	必填 课程详情[图文详情]
              'time': courseForm.syllabus,//	Array	必填			上课时间表[开课时间数组]
              'apply_time_start': Date.parse(courseForm.reportStartTime) / 1000, //	字符串	必填			开始报名时间时间戳
              'apply_time_end': Date.parse(courseForm.reportEndTime) / 1000,//	字符串	必填			结束报名时间时间戳
              'location': courseForm.location,//	对象	必填			开课地点
              // 'geo': courseForm.geo,//对象	非必填	 开课地点地理坐标*************
              'address': courseForm.address,//	字符串	必填			开课地点详细地址
              'can_cancel': courseForm.isCancel,//	字符串	必填			是否可以取消报名[Y=可取消、N=不可取消]
              'cancel_time': cancelDate,//	字符串	非必填			取消报名截止时间
              'max_count': courseForm.max_count, //	字符串	必填			招生人数
              'limit_count': courseForm.userLimit, //字符串	非必填			单客户限额
              'ticket_count': courseForm.ticket_count, //字符串	非必填			报名门票数
              'original_price': courseForm.original_price, //	字符串	非必填			报名费用
              'price':	courseForm.price, //字符串	非必填			优惠费用
              'hotline': courseForm.hotline,
              // 'agency_id': '1'  // 超级管理员时必传
            },
            (res) => {
              this.syllabusIndex = 0  // 重置
              this.$message('创建成功')
              this.$router.push('list')
            },
            (res) => {
                this.$message(res.message)
            }
          )
        }

      },

      getAllDate(start, end) {
        let startTimes = start.split("-");
        let endTimes = end.split("-");
        let db = new Date();
        db.setUTCFullYear(startTimes[0], startTimes[1] - 1, startTimes[2]);
        let de = new Date();
        de.setUTCFullYear(endTimes[0], endTimes[1] - 1, endTimes[2]);
        let unixDb = db.getTime();
        let unixDe = de.getTime();
        let list = []
        for (let k = unixDb; k <= unixDe;) {
            list.push(new Date(parseInt(k)).format())
            k = k + 24 * 60 * 60 * 1000;
        }

        return list
      }
    }
  }
</script>

// <style lang="scss" scoped>
// .description {
//   .description-image {
//     float: left;
//     width: 150px;
//     margin-right: 10px;
//   }
//
//   .description-text {
//     float: left;
//     width: 50%;
//     button {
//       margin-top: 10px;
//       margin-left: 50px;
//     }
//   }
// }
//
// .description-list {
//   display: block;
//   white-space:nowrap;
//   overflow:auto;
//
//   li {
//     display: inline-block;
//     position: relative;
//     list-style: none;
//     padding-bottom: 50px;
//     button {
//       position: absolute;
//       bottom: 0;
//       left: 50%;
//       margin-left: -35px;
//     }
//   }
// }
//
// .gaode-map {
//   width: 100%;
//   height: 400px;
// }
// </style>
