<template lang="html">
  <div class="wx-open-course-create">
    <el-form ref="courseInfo"  :model="courseInfo" label-width="120px">
      <el-form-item label="讲师名称:">
        <el-tag v-for="item,index in teachers" :key="index"
          closable :disable-transitions="false" style="margin-right: 10px"
          @close="deleteTeachers(item)">
          {{item.name}}
        </el-tag>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="isShowSelectTeacher = true">添加讲师</el-button>
      </el-form-item>
      <el-form-item label="课程名称:">
        <select-course :courses="courses" :teachers="teachers"
         @delete="deleteCourses" @selected="selectedCourses"></select-course>
      </el-form-item>
      <div class="line-title">基础信息</div>
      <el-form-item label="课程分类" required>
        <el-select filterable v-model="categoryFirstId"
          placeholder="请选择课程一级分类" @change="categoryChange">
          <el-option v-for="category,index in categoryFirst" :key="index"
            :label="category.name" :value="category.tag_id">
          </el-option>
        </el-select>
        <el-select filterable v-model="categorySecondId" placeholder="请选择课程二级分类">
          <el-option v-for="category,index in categorySecond" :key="index"
            :label="category.name" :value="category.tag_id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="行业标签">
        <industry-label :type="'1'" :initTag="courseInfo.tradeTags" @backTags="tradeTags"></industry-label>
      </el-form-item>
      <el-form-item label="岗位标签">
        <industry-label :type="'2'" :initTag="courseInfo.stationTags" @backTags="stationTags"></industry-label>
      </el-form-item>
      <el-form-item label="职务标签" required>
        <industry-label :type="'3'" :initTag="courseInfo.workTags" @backTags="workTags"></industry-label>
      </el-form-item>
      <el-form-item label="课程主图" required>
        <wx-upload :files="courseInfo.initMasterImages" :limit="1"
          @success="successMasterImage" @remove="masterImageRemove">
        </wx-upload>
      </el-form-item>
      <el-form-item label="课程缩略图" required>
        <wx-upload :files="courseInfo.initBreviaryImages" :limit="1"
          @success="successBreviaryImage" @remove="breviaryImageRemove">
        </wx-upload>
      </el-form-item>
      <el-form-item label="课程背景">
        <el-input type="textarea" v-model="courseInfo.introduce1"
          placeholder="可简单阐述下课程培训的背景，帮助用户了解自身的实际情况选择报名"
          :maxlength="500" :rows="3">
        </el-input>
      </el-form-item>

      <el-form-item label="课程收益">
        <el-input type="textarea" v-model="courseInfo.introduce2"
          placeholder="请简单罗列下，学员学习课程后能够预计获得到的一些收获"
          :maxlength="200" :rows="2">
        </el-input>
      </el-form-item>

      <el-form-item label="课程对象">
        <el-input type="textarea" v-model="courseInfo.introduce3"
          placeholder="请简单描述下该课程适合的对象"
          :maxlength="200" :rows="2">
        </el-input>
      </el-form-item>

      <el-form-item label="课程简介" class="description" required>
        <description @success="introBack" :list="courseInfo.introArr"></description>
      </el-form-item>
      <div class="line-title">开课信息</div>
      <el-form-item label="开课日期" required>
        <el-date-picker type="daterange" v-model="courseInfo.startCourseDate" @change="addSyllabus"
          range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
        <el-table :data="courseInfo.syllabus" v-if="courseInfo.isShowSyllabus" :border="true"
          :stripe="true" align="center" style="width:720px; margin-top:15px">
          <el-table-column align="center" prop="date" label="开课日期" width="120"></el-table-column>
          <el-table-column align="center" label="上课时间" width="240">
            <template slot-scope="scope">
              <el-time-select v-model="scope.row.start"
                :editable="false" :picker-options="{
                  start: '00:00',
                  step: '00:10',
                  end: '23:00'
                }">
              </el-time-select>
            </template>
          </el-table-column>
          <el-table-column align="center" label="下课时间" width="240">
            <template slot-scope="scope">
              <el-time-select v-model="scope.row.end"
                :editable="false" :picker-options="{
                  start: scope.row.start,
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
        <el-date-picker v-model="courseInfo.enrollDate" type="datetimerange"
          range-separator="至" start-placeholder="开始报名时间" end-placeholder="结束报名时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="开课地点" required>
        <el-select filterable v-model="courseInfo.location.province_id"
          @change="provinceChange" placeholder="省" clearable>
          <el-option v-for="province,index in provinces" :key="index"
            :label="province.region_name" :value="province.region_id">
          </el-option>
        </el-select>
        <el-select filterable v-model="courseInfo.location.city_id" @change="cityChange" placeholder="市" clearable>
          <el-option v-for="city,index in citys" :key="index"
            :label="city.region_name" :value="city.region_id">
          </el-option>
        </el-select>
        <el-select filterable v-model="courseInfo.location.area_id" placeholder="区" clearable>
          <el-option v-for="area,index in areas" :key="index"
            :label="area.region_name" :value="area.region_id">
          </el-option>
        </el-select>
        <el-input v-model="courseInfo.address" placeholder="请填写详细地址" @blur="changMap" style="margin-top: 10px; width: 50%;"></el-input>
      </el-form-item>
      <el-form-item label="地图详情" v-if="isShowMap">
        <el-amap vid="amapDemo" class="amap-box"
          :center="mapCenter" :zoom="18" :events="events">
          <el-amap-marker :position="mapCenter"></el-amap-marker>
        </el-amap>
      </el-form-item>
      <el-form-item label="取消报名" required>
        <el-radio-group v-model="courseInfo.isCancel">
          <el-radio :label="'N'">不可取消</el-radio>
          <el-radio :label="'Y'">可取消</el-radio>
          <el-date-picker v-if="courseInfo.isCancel == 'Y'" placeholder="取消截止日期"
          v-model="courseInfo.cancelDate" type="datetime"  class="width_400"></el-date-picker>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="单客户限制" required>
        <el-input v-model="courseInfo.userLimit" @blur="checkNumber" placeholder="单客户名额限制，0为不限制" class="width_400"></el-input>
      </el-form-item>
      <el-form-item label="招生人数" required>
        <el-input v-model="courseInfo.maxCount" placeholder="请输入课程招生名额上限" class="width_400"></el-input>
      </el-form-item>
      <el-form-item label="门票数">
        <el-input v-model="courseInfo.ticketCount" :disabled="isDisabled" placeholder="输入学习卡门票数，不填为免费" class="width_400"></el-input>
      </el-form-item>
      <el-form-item label="报名费用">
        <el-input v-model="courseInfo.originalPrice" :disabled="isDisabled" placeholder="输入报名费用，不填为免费" class="width_400"></el-input>
      </el-form-item>
      <el-form-item label="优惠费用">
        <el-input v-model="courseInfo.price" :disabled="isDisabled" placeholder="不填为使用报名费用，0为免费" class="width_400"></el-input>
      </el-form-item>
      <!-- <el-form-item label="课程主办方">
        本期不做 :disabled="isDisabled" 绑定在input上
      </el-form-item> -->
      <el-form-item label="服务热线" required>
        <el-input v-model="courseInfo.hotline" placeholder="输入学员可联系的练习方式" class="width_400"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" plain @click="saveForm('courseInfo')">保存为计划开课</el-button>
        <el-button type="primary" @click="submitForm('courseInfo')">立即 提交</el-button>
      </el-form-item>
    </el-form>
    <select-teacher :isShow="isShowSelectTeacher" :list="teachers"
      @close="isShowSelectTeacher = false" @confirm="selectedTeachers">
    </select-teacher>
    <!-- <notice :isShowNotice="isShowNotice" :content="'提交成功，我们将尽快为该课程进行审核！'" @close="closeNotice"></notice> -->
  </div>
</template>

<script>
import {tagList, regionList} from 'service/default.js'
import openCourseApi from 'service/courseCenter/openCourse/create'
import wxUpload from 'components/imgUpload/ImgUpload'
import industryLabel from 'components/courseCenter/IndustryLabel'
import description from 'components/common/Editor'
import selectTeacher from './_selectTeacher.vue'
import selectCourse from './_selectCourse.vue'
import notice from './notice.vue'
export default {
  components: {
    selectTeacher,
    selectCourse,
    industryLabel,
    description,
    wxUpload,
    notice
  },
  data () {
    return {
      // isShowNotice: false,   // 显隐公开课须知
      mapCenter: [],  // 地图中心点
      lng: '',
      lat: '',
      events: {
        click: (e) => {
          let self = this
          let { lng, lat } = e.lnglat
          self.lng = lng
          self.lat = lat
          self.mapCenter = [self.lng, self.lat]
        },
      },
      isShowMap: false,
      categoryFirst: [],     // 一级分类
      categorySecond: [],    // 二级分类
      provinces: [],         // 省份数组
      citys: [],             // 市数组
      areas: [],             // 区、县数组
      teachers: [],  // 讲师列表
      courses: [],   // 课程列表
      isDisabled: false, // 报名费用、优惠费用、门票数只要有用户报名就不可修改
      isShowSelectTeacher: false,
      categoryFirstId: '',  // 一级分类id
      categorySecondId: '',  // 二级分类id

      courseInfo: {
        title: '',   // 课程名
        courseSourceId: '',
        tradeTags: [],  // 行业标签
        stationTags: [],  // 岗位标签
        workTags: [],  // 职务标签
        masterImage: '',  // 课程主图
        initMasterImages: [],
        breviaryImage: '',  // 缩略图
        initBreviaryImages: [],
        description: [],  // [{"title":"课程背景","content":"内容"}]
        introduce1: '',
        introduce2: '',
        introduce3: '',
        intro: [],   // 最终传给后台的简介数组
        introArr: [],  //  用于回填简介数据的
        startCourseDate: [], // 开课开始计数日期数组
        syllabus: [],  // 课程表数组  提交时传给后台
        isShowSyllabus: false,  // 是否显示课程表
        enrollDate: [],  //  报名时间
        location: {
          province_id: '',
          city_id: '',
          area_id: ''
        },
        address: '',
        isCancel: 'Y',
        cancelDate: '',      // 取消时间
        userLimit: '0',      // 名额限制
        maxCount: '',       // 招生人数
        ticketCount: '',    //字符串	非必填	  报名门票数
        originalPrice: '',  //	字符串	非必填	  报名费用
        price: '',           // 字符串	非必填   优惠费用
        hotline: '',
      }
    }
  },
  watch: {
    teachers(newVal, oldVal) { // 课程数组永远只有一项但是不排除会不会加临时课程
      this.courses = []
      this.initCourseInfo()
    },
    courses(newVal, oldVal) { // 课程数组永远只有一项但是不排除会不会加临时课程
      newVal.forEach(item => {
        this.getCourseInfo(item.course_source_id)
      })
    },
    categoryFirstId(newVal, oldVal) {
      if (parseInt(newVal) > 0) {
        this.categorySecond = []
        this.categoryFirst.forEach(item => {
          if (item.tag_id == newVal) {
            this.categorySecond = item.children
          }
        })
      }
    }
  },
  computed: {},
  mounted () {
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
    changMap() {
      let address = this.courseInfo.address
      if (!address) {
        this.isShowMap = false
        this.lng = null
        this.lat = null
      }
      else {
        let provincesName = this.returnName(this.provinces, this.courseInfo.location.province_id)
        let cityName = this.returnName(this.citys, this.courseInfo.location.city_id)
        let areaName = this.returnName(this.areas, this.courseInfo.location.area_id)
        let mapAddress = provincesName + cityName + areaName + address
        let self = this
        let geocoder = new AMap.Geocoder({
          radius: 1000,
          extensions: "all"
        });

        geocoder.getLocation(mapAddress, function(status, result) {
          if (status === 'complete' && result.info === 'OK') {
            if (result.geocodes.length) {
              result.geocodes.forEach(item => {
                self.lng = item.location.lng
                self.lat = item.location.lat
                self.mapCenter = [self.lng, self.lat]
                self.isShowMap = true
              })
            }
          }
        })
      }
    },
    deleteTeachers(tag) {
      this.teachers.splice(this.teachers.indexOf(tag), 1)
    },
    selectedTeachers(list) {
      this.teachers = list
      this.isShowSelectTeacher = false
    },
    deleteCourses() {
      this.courses = []
      this.initCourseInfo()
    },
    selectedCourses(arr) {
      this.courses = arr
    },
    categoryChange(val) {
      this.categorySecond = []
      this.categorySecondId = ''
      this.categoryFirst.forEach(item => {
        if (item.tag_id == val) {
          this.categorySecond = item.children
        }
      })
    },
    tradeTags(tags) {
      this.courseInfo.tradeTags = []
      if (tags.length) {
        tags.forEach(tag => {
          this.courseInfo.tradeTags.push({
            "tag_id": tag.tag_id,
            "name": tag.name,
          })
        })
      }
    },
    stationTags(tags) {
      this.courseInfo.stationTags = []
      if (tags.length) {
        tags.forEach(tag => {
          this.courseInfo.stationTags.push({
            "tag_id": tag.tag_id,
            "name": tag.name,
          })
        })
      }
    },
    workTags(tags) {
      this.courseInfo.workTags = []
      if (tags.length) {
        tags.forEach(tag => {
          this.courseInfo.workTags.push({
            "tag_id": tag.tag_id,
            "name": tag.name,
          })
        })
      }
    },
    successMasterImage(list) {
      list.forEach(item => {
        this.courseInfo.masterImage = item.url
      })
    },
    masterImageRemove(list, file) {
      this.courseInfo.masterImage = ""
    },
    successBreviaryImage(list) {
      list.forEach(item => {
        this.courseInfo.breviaryImage = item.url
      })
    },
    breviaryImageRemove(file, fileList) {
      this.courseInfo.breviaryImage = ""
    },
    introBack(list) {
      this.courseInfo.intro = list
    },
    addSyllabus(time) {
      if (!this.courseInfo.startCourseDate) {
        this.$message('请选择开课日期')
        this.courseInfo.isShowSyllabus = false
      }
      else {
        let start = __tool.formatDate(this.courseInfo.startCourseDate[0])
        let end = __tool.formatDate(this.courseInfo.startCourseDate[1])
        let dateList = this.getAllDate(start, end)
        this.courseInfo.syllabus = []
        dateList.forEach(date => {
          this.courseInfo.syllabus.push({
            "date": date,
            "start":" ",
            "end":" ",
            "hours":" "
          })
        })
        this.courseInfo.isShowSyllabus = true
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
    },
    provinceChange(provinceId, flag) {
      let _flag = flag || false
      if (!_flag) {
        this.courseInfo.location.city_id = ''
        this.courseInfo.location.area_id = ''
      }
      this.getRegionList(provinceId, 2)
    },
    cityChange(cityId, flag) {
      let _flag = flag || false
      if (!_flag) {
        this.courseInfo.location.area_id = ''
      }
      this.getRegionList(cityId, 3)
    },
    checkNumber() {
      if (!/^\d+$/.test(this.courseInfo.userLimit)) {
        this.$message('单客户限制最少为0且必须为整数')
        this.courseInfo.userLimit = 0
      }
    },
    getCourseInfo(id) {
      openCourseApi.getCourseInfo(
        {
          course_source_id: id,
        },
        (res) => {
          res.data.category_ids = [res.data.category_1, res.data.category_2]
          res.data.intro = JSON.parse(res.data.intro)
          let description = []
          if(res.data.description.length) {
            res.data.description.forEach(item => {
              description.push({
                title: item.key,
                content: item.value
              })
            })
            res.data.description = description
          }
          this.initCourseInfo(res.data)
        },
        (res) => {
          this.initCourseInfo()
          console.log('课程库详情获取失败');
        }
      )
    },
    initCourseInfo(obj) {
      let data = obj || ''
      let course = this.courseInfo
      if (data) {
        // 一二级分类id
        this.categoryFirstId = data.category_ids[0]
        this.categorySecondId = data.category_ids[1]
        // 行业 岗位  职务标签
        course.tradeTags = data.tags_1 || []
        course.stationTags = data.tags_2 || []
        course.workTags = data.tags_3 || []
        // 课程主图  缩略图
        course.initMasterImages = [{url: data.image}]
        course.masterImage = data.image
        course.initBreviaryImages = [{url: data.thumb}]
        course.breviaryImage = data.thumb
        // 课程背景 收益 对象
        course.introduce1 = data.description[0].content
        course.introduce2 = data.description[1].content
        course.introduce3 = data.description[2].content
        //课程简介
        course.intro = data.intro
        course.introArr = data.intro
      }
      else {
        // 一二级分类id
        this.categoryFirstId = ''
        this.categorySecondId = ''
        // 行业 岗位  职务标签
        course.tradeTags = []
        course.stationTags = []
        course.workTags =  []
        // 课程主图  缩略图
        course.initMasterImages = []
        course.masterImage = ''
        course.initBreviaryImages = []
        course.breviaryImage = ''
        // 课程背景 收益 对象
        course.introduce1 = ''
        course.introduce2 = ''
        course.introduce3 = ''
        //课程简介
        course.intro = []
        course.introArr = []
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
              if (item.tag_id == this.categoryFirstId) {
                this.categorySecond = item.children
              }
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
    returnName(lists, id) {
      let name = ''
      lists.forEach(list => {
        if (list.region_id == id) {
          name = list.region_name
        }
      })
      return name
    },
    submitForm(){
      // 1.赶时间， 2.产品没给出具体的校验规则  后期补上校验
      // 课程安排模块必填操作=====
      let isSyllabusNull = false
      //  循环课程表数组中每个对象下的每个属性 从而判断用户是否必填
      if (this.courseInfo.syllabus.length > 0) {
        this.courseInfo.syllabus.forEach(syllabu => {
          for(let item in syllabu) {
            if (/^\s*$/.test(syllabu[item])) {  // 此处正则用于判断是否为空字符串
              isSyllabusNull = true
            }
          }
        })
      }
      else {
        this.$message('课程安排必须填写')
      }

      if(isSyllabusNull) {
        this.$message('课程安排必须填写')
      }

      if(!this.courseInfo.originalPrice || parseInt(this.courseInfo.originalPrice) < 0) {
        this.$message.error('报名费用不能为空或小于0')
        return
      }

      if(parseInt(this.courseInfo.price) < 0 || parseInt(this.courseInfo.price) > parseInt(this.courseInfo.originalPrice)) {
        this.$message.error('优惠费用不能小于0或大于报名费用')
        return
      }

      if (this.courseInfo.price && parseInt(this.courseInfo.price) < 0) {
        this.$message.error('优惠费用可为空或必须大于等于0')
        return
      }

      let teacherIds = []
      this.teachers.forEach(item => {
        teacherIds.push(item.teacher_id)
      })
      let course = this.courseInfo
      let categorys = [this.categoryFirstId, this.categorySecondId]
      let courseSourceId = ''
      this.courses.forEach(item => {
        courseSourceId = item.course_source_id
        course.title = item.title
      })
      // 当为临时课程名称  在存数据时course_source_id与title是相等的
      if (courseSourceId == course.title) {
        courseSourceId = ''
      }
      course.description = [
        {"title": "课程背景", "content": course.introduce1},
        {"title": "课程收益", "content": course.introduce2},
        {"title": "课程对象", "content": course.introduce3},
      ]

      let applyStartTime = __tool.formatSecond(course.enrollDate[0])
      let applyEndTime = __tool.formatSecond(course.enrollDate[1])
      let geo = {  // 地理位置  可为null
        lng: this.lng,
        lat: this.lat
      }
      let cancelDate = course.isCancel == 'Y' ? __tool.formatSecond(course.cancelDate) : ''
      let adminAgency = (__tool.getLocalStorage('platform') == 'agency') ? '' : '1'
      let price = !course.price ? '-1' : course.price
      openCourseApi.createCourse(
        {
          'title': course.title,//	字符串	必填			课程标题
          'course_source_id': courseSourceId,
          'teacher_ids': teacherIds, //	数组	必填			讲师ID列表
          'category_ids': categorys,//	数组	必填			课程分类[一级、二级分类ID]
          'tags_1': course.tradeTags,//	数组	非必填			行业签列表
          'tags_2': course.stationTags,//	数组	非必填			岗位标签列表
          'tags_3': course.workTags,//	数组	必填			职务标签列表
          'thumb': course.breviaryImage,  // 字符串 必填 课程缩略图地址
          'image': course.masterImage, // 字符串 必填 课程主图地址
          'description': course.description,//	Array	非必填			 [{"title":"课程背景","content":"内容"}]
          'public_type': '1',	//字符串	必填	1		1=公开课、2=内训课[默认传1]
          'type': '1', //	字符串	必填	1		1=线下课、2=录播课、3=直播课、4=微课[默认传1]
          'intro': course.intro,//	Array	必填 课程详情[图文详情]
          'time': course.syllabus,//	Array	必填			上课时间表[开课时间数组]
          'apply_time_start': applyStartTime, //	字符串	必填			开始报名时间时间戳
          'apply_time_end': applyEndTime,//	字符串	必填			结束报名时间时间戳
          'location': course.location,//	对象	必填			开课地点
          'address': course.address,//	字符串	必填			开课地点详细地址
          'can_cancel': course.isCancel,//	字符串	必填			是否可以取消报名[Y=可取消、N=不可取消]
          'cancel_time': cancelDate,//	字符串	非必填			取消报名截止时间
          // 'teacher_expand': teacherExpand,//	数组	非必填	自定义新增的讲师['讲师1','讲师2'....]
          'geo': geo,//对象	非必填	 开课地点地理坐标  暂时不做
          'max_count': course.maxCount, //	字符串	必填			招生人数
          'limit_count': course.userLimit, //字符串	非必填			单客户限额
          'ticket_count': course.ticketCount, //字符串	非必填			报名门票数
          'original_price': course.originalPrice, //	字符串	非必填			报名费用
          'price':	price, //字符串	非必填			优惠费用
          'hotline': course.hotline,
          'agency_id': adminAgency,  // 超级管理员时必传
        },
        (res) => {
          this.$message({
            type: 'success',
            message: '创建成功'
          })
          setTimeout(() => {
            this.$router.push('/open-course/list')
          }, 1500)
        },
        (res) => {
          this.$message(res.message)
        }
      )
    },
    saveForm() {
      // 课程安排模块必填操作=====
      let isSyllabusNull = false
      //  循环课程表数组中每个对象下的每个属性 从而判断用户是否必填
      if (this.courseInfo.syllabus.length > 0) {
        this.courseInfo.syllabus.forEach(syllabu => {
          for(let item in syllabu) {
            if (/^\s*$/.test(syllabu[item])) {  // 此处正则用于判断是否为空字符串
              isSyllabusNull = true
            }
          }
        })
      }
      else {
        this.$message('课程安排必须填写');
        return
      }

      if(isSyllabusNull) {
        this.$message('课程安排不能为空');
        return
      }

      if(!this.courseInfo.originalPrice || parseInt(this.courseInfo.originalPrice) < 0) {
        this.$message.error('报名费用不能为空或小于0')
        return
      }

      if(parseInt(this.courseInfo.price) < 0 || parseInt(this.courseInfo.price) > parseInt(this.courseInfo.originalPrice)) {
        this.$message.error('优惠费用不能小于0或大于报名费用')
        return
      }

      if (this.courseInfo.price && parseInt(this.courseInfo.price) < 0) {
        this.$message.error('优惠费用可为空或必须大于等于0')
        return
      }

      let teacherIds = []
      if (this.teachers.length > 0) {
        this.teachers.forEach(item => {
          teacherIds.push(item.teacher_id)
        })
      }
      else {
        this.$message('未选择讲师');
        return
      }
      let course = this.courseInfo
      let categorys = [this.categoryFirstId, this.categorySecondId]
      let courseSourceId = ''
      this.courses.forEach(item => {
        courseSourceId = item.course_source_id
        course.title = item.title
      })
      if (!course.title) {
        this.$message('课程名称必须填写')
        return
      }
      // 当为临时课程名称  在存数据时course_source_id与title是相等的
      if (courseSourceId == course.title) {
        courseSourceId = ''
      }
      course.description = [
        {"title": "课程背景", "content": course.introduce1},
        {"title": "课程收益", "content": course.introduce2},
        {"title": "课程对象", "content": course.introduce3},
      ]

      let applyStartTime = __tool.formatSecond(course.enrollDate[0])
      let applyEndTime = __tool.formatSecond(course.enrollDate[1])
      let geo = {  // 地理位置  可为null
        lng: this.lng,
        lat: this.lat
      }
      let cancelDate = course.isCancel == 'Y' ? __tool.formatSecond(course.cancelDate) : ''
      let adminAgency = (__tool.getLocalStorage('platform') == 'agency') ? '' : '1'
      let price = !course.price ? '-1' : course.price
      openCourseApi.saveOpenCourse(
        {
          'title': course.title,//	字符串	必填			课程标题
          'course_source_id': courseSourceId,
          'teacher_ids': teacherIds, //	数组	必填			讲师ID列表
          'category_ids': categorys,//	数组	必填			课程分类[一级、二级分类ID]
          'tags_1': course.tradeTags,//	数组	非必填			行业签列表
          'tags_2': course.stationTags,//	数组	非必填			岗位标签列表
          'tags_3': course.workTags,//	数组	必填			职务标签列表
          'thumb': course.breviaryImage,  // 字符串 必填 课程缩略图地址
          'image': course.masterImage, // 字符串 必填 课程主图地址
          'description': course.description,//	Array	非必填			 [{"title":"课程背景","content":"内容"}]
          'public_type': '1',	//字符串	必填	1		1=公开课、2=内训课[默认传1]
          'type': '1', //	字符串	必填	1		1=线下课、2=录播课、3=直播课、4=微课[默认传1]
          'intro': course.intro,//	Array	必填 课程详情[图文详情]
          'time': course.syllabus,//	Array	必填			上课时间表[开课时间数组]
          'apply_time_start': applyStartTime, //	字符串	必填			开始报名时间时间戳
          'apply_time_end': applyEndTime,//	字符串	必填			结束报名时间时间戳
          'location': course.location,//	对象	必填			开课地点
          'address': course.address,//	字符串	必填			开课地点详细地址
          'can_cancel': course.isCancel,//	字符串	必填			是否可以取消报名[Y=可取消、N=不可取消]
          'cancel_time': cancelDate,//	字符串	非必填			取消报名截止时间
          // 'teacher_expand': teacherExpand,//	数组	非必填	自定义新增的讲师['讲师1','讲师2'....]
          'geo': geo,//对象	非必填	 开课地点地理坐标  暂时不做
          'max_count': course.maxCount, //	字符串	必填			招生人数
          'limit_count': course.userLimit, //字符串	非必填			单客户限额
          'ticket_count': course.ticketCount, //字符串	非必填			报名门票数
          'original_price': course.originalPrice, //	字符串	非必填			报名费用
          'price': price, //字符串	非必填			优惠费用
          'hotline': course.hotline,
          'agency_id': adminAgency  // 超级管理员时必传
        },
        (res) => {
          this.$message('保存计划公开课成功')
          this.$router.push('/open-course/list')
        },
        (res) => {
          this.$message(res.message)
        }
      )
    }
  },

}
</script>

<style lang="scss" scoped>
.amap-box {
  height: 400px;
  width: 80%;
}

.line-title{
  font-size: 20px;
  font-weight: bold;
  margin-left: 24px;
  margin-bottom: 20px;
  padding: 5px 0;
  color: #5a5e66;
  border-bottom: 1px solid #b4bccc;
}
</style>
