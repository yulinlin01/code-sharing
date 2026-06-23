<template>
  <div class="resume-model1-left" ref="resumeContent">
    <header class="header">
      <div class="header-info">
        <p style="font-size: 30px;  font-weight: 700;">{{ personalInfo.name }}</p>
        <p>
          <span>{{ personalInfo.age }}</span>
          <span>{{ personalInfo.city }}</span>
        </p>
        <p>
          <span>{{ personalInfo.phone }}</span>
          <span>{{ personalInfo.email }}</span>
        </p>
        <p>
          <span>{{ personalInfo.education }}</span>
          <span>{{ personalInfo.position }}</span>
        </p>
      </div>
      <div class="avatar" @click="handleAvatarClick">
        <img :src="avatarUrl" alt="头像">
        <div class="avatar-overlay">
          <div class="upload-icon">+</div>
        </div>
        <input 
          ref="fileInput" 
          type="file" 
          accept="image/*" 
          @change="handleFileChange" 
          style="display: none;"
        >
      </div>
    </header>
    <div class="content">
      <div class="project">
        <h2 class="box">项目经验</h2>
        <div class="work-content" v-for="(project, index) in projectsList" :key="project.id">
          <ul class="work-info">
            <li>
              <span>{{ project.company }}</span>
            </li>
            <li>
              <span>{{ project.position }}</span>
            </li>
            <li>
              <span>{{ project.startDate }}</span>
              <i>-</i>
              <span>{{ project.endDate }}</span>
            </li>
          </ul>
          <div class="work-message">
            <ul>
              <li class="shixineirong">
                <b>实习内容</b>
                <span>{{ project.content }}</span>
              </li>
              <li class="suoyongjishu">
                <b>所用技术</b>
                <span>{{ project.technologies }}</span>
              </li>
              <li class="jiejuewenti">
                <b>解决问题</b>
                <span>{{ project.problemsSolved }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="jineng">
        <h2 class="box">掌握技能</h2>
        <ul class="skills-list">
          <li v-for="skill in skillsList" :key="skill.id">
            <b>{{ skill.name? skill.name : '技能名称' }}</b>
            <span>{{ skill.description? skill.description : '技能详情' }}</span>
          </li>
        </ul>
      </div>
      <div class="jiaoyu">
        <h2 class="box">教育经历</h2>
        <ul>
          <li v-for="education in educationList" :key="education.id">
            <b>{{ education.type }}</b>
            <span>{{ education.content }}</span>
          </li>
        </ul>
      </div>
      <div class="ziwo" v-if="showSelfEvaluation">
        <h2 class="box">自我评价</h2>
        <ul>
          <li>
            <b>性格特点</b>
            <span>{{ selfEvaluation.character }}</span>
          </li>
          <li>
            <b>学习能力</b>
            <span>{{ selfEvaluation.learning }}</span>
          </li>
          <li v-if="selfEvaluation.other">
            <b>其他评价</b>
            <span>{{ selfEvaluation.other }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import defaultAvatar from './touxiang.png'

// 定义props
const props = defineProps({
  personalInfo: {
    type: Object,
    required: true
  },
  projectsList: {
    type: Array,
    required: true
  },
  skillsList: {
    type: Array,
    required: true
  },
  educationList: {
    type: Array,
    required: true
  },
  selfEvaluation: {
    type: Object,
    required: true
  },
  showSelfEvaluation: {
    type: Boolean,
    required: true
  }
})

// 简历内容的引用
const resumeContent = ref(null)
// 文件输入框的引用
const fileInput = ref(null)
// 头像URL
const avatarUrl = ref(defaultAvatar)

// 处理头像点击事件
const handleAvatarClick = () => {
  fileInput.value.click()
}

// 处理文件选择
const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件')
      return
    }
    
    // 检查文件大小（限制为5MB）
    if (file.size > 5 * 1024 * 1024) {
      alert('图片大小不能超过5MB')
      return
    }
    
    // 创建FileReader来读取文件
    const reader = new FileReader()
    reader.onload = (e) => {
      avatarUrl.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

// 暴露给父组件
defineExpose({
  resumeContent
})
</script>

<style scoped>
.resume-model1-left {
  /* A4比例基础尺寸（打印友好） */
  width: 800px;
  height: calc(800px * 1.41);
  flex-shrink: 0;
  background: #fff;
  color: #333;
  border-radius: 10px;
}

/* 头部 */
.header {
  width: 100%;
  padding: 27px 30px 0px 30px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
}

.header .header-info {
  flex: 1;
}

.header .header-info p {
  font-size: 13px;
  margin-bottom: 5px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}

.header .header-info p span {
  margin-right: 10px;
  font-weight: 600;
}

.header .avatar {
  height: 120px;
  position: relative;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
}

.header .avatar img {
  max-height: 120px;
  margin: 0px;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.avatar:hover .avatar-overlay {
  opacity: 1;
}

.upload-icon {
  color: white;
  font-size: 24px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
}


/* 内容 */
.content {
  padding: 0px 30px 0px 30px;
  box-sizing: border-box;
}

.project,.jineng,.jiaoyu,.ziwo {
  margin-top: 12px;
  font-size: 13px;
  line-height: 22px;
}

/* 每一项的标题 */
.box {
  background-color: #4e7282;
  color: #fff !important;
  padding: 5px;
  border-radius: 2px;
  letter-spacing: 2px;
  font-size: 15px;
}


/* 工作经验 */
.work-content {
  margin-top: 5px;
}

.work-info {
  display: flex;
  padding: 0px;
  justify-content: space-between;
}

.work-info li {
  width: 33.33%;
  flex: 0 0 auto;
  list-style: none;
  font-weight: 700;
}
.work-info li:nth-child(2) {
  text-align: center;
}
.work-info li:nth-child(3) {
  text-align: right;
}

.work-info i {
  margin: 0px 5px;
}

.work-message {
  margin-top: 3px;
}

.work-message ul {
  padding: 0px;
}

.work-message ul li {
  list-style: none;
}

.work-message ul li b {
  background-color: #eee;
  margin: 0px 10px 0px 0px;
  padding: 0px 5px;
  border-radius: 3px;
}


/* 掌握技能 */
.jineng ul {
  padding: 0px;
  margin-top: 5px;
}

.jineng ul li {
  list-style: none;
}

.jineng ul li b {
  margin: 0px 10px 0px 0px;
  padding: 0px 5px;
  border-radius: 5px;
  background-color: #eee;
}

/* 教育经历 */
.jiaoyu ul {
  padding: 0px;
  margin-top: 5px;
}

.jiaoyu ul li {
  list-style: none;
}

.jiaoyu ul li b {
  margin: 0px 10px 0px 0px;
  padding: 0px 5px;
  background-color: #eee;
  border-radius: 5px;
}

/* 自我评价 */
.ziwo ul {
  padding: 0px;
  margin-top: 5px;
}

.ziwo ul li {
  list-style: none;
}

.ziwo ul li b {
  margin: 0px 10px 0px 0px;
  padding: 0px 5px;
  background-color: #eee;
  border-radius: 5px;
}
</style>
