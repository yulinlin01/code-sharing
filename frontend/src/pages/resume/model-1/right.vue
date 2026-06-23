<template>
  <div class="resume-model1-right">
    <div class="control">
      <ul>
        <li v-for="(item, index) in menuItems" :key="index" :class="{ active: activeTab === index }"
          @click="setActiveTab(index)">
          {{ item }}
        </li>
      </ul>
      <div class="control-content">
        <!-- 个人信息 -->
        <PersonalInfo 
          v-show="activeTab === 0"
          :personal-info="localPersonalInfo"
          @update:personal-info="updatePersonalInfo"
        />
        <!-- 项目经验 -->
        <ProjectExperience 
          v-show="activeTab === 1"
          :projects-list="projectsList"
          :active-project-index="activeProjectIndex"
          @update:projects-list="updateProjectsList"
          @update:active-project-index="updateActiveProjectIndex"
          @add-project="addProject"
          @remove-project="removeProject"
          @switch-project="switchProject"
        />
        <!-- 掌握技能 -->
        <Skills 
          v-show="activeTab === 2"
          :skills-list="skillsList"
          :active-skill-index="activeSkillIndex"
          @update:skills-list="updateSkillsList"
          @update:active-skill-index="updateActiveSkillIndex"
          @add-skill="addSkill"
          @remove-skill="removeSkill"
          @switch-skill="switchSkill"
        />
        <!-- 教育经历 -->
        <Education 
          v-show="activeTab === 3"
          :education-list="educationList"
          :active-education-index="activeEducationIndex"
          @update:education-list="updateEducationList"
          @update:active-education-index="updateActiveEducationIndex"
          @add-education="addEducation"
          @remove-education="removeEducation"
          @switch-education="switchEducation"
        />
        <!-- 自我评价 -->
        <SelfEvaluation 
          v-show="activeTab === 4"
          :self-evaluation="localSelfEvaluation"
          :show-self-evaluation="showSelfEvaluation"
          @update:self-evaluation="updateSelfEvaluation"
          @update:show-self-evaluation="updateShowSelfEvaluation"
          @toggle-self-evaluation="toggleSelfEvaluation"
        />
      </div>
      <button @click="downloadPDF">下载 pdf 简历</button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import PersonalInfo from './right-components/PersonalInfo.vue'
import ProjectExperience from './right-components/ProjectExperience.vue'
import Skills from './right-components/Skills.vue'
import Education from './right-components/Education.vue'
import SelfEvaluation from './right-components/SelfEvaluation.vue'

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
  },
  resumeContentRef: {
    // 初始渲染时可能为undefined，设置为可选并提供默认值
    type: Object,
    required: false,
    default: null
  }
})

// 定义emits（统一使用kebab-case，和父组件/子组件模板保持一致）
const emit = defineEmits([
  'update:personal-info',
  'update:projects-list', 
  'update:skills-list',
  'update:education-list',
  'update:self-evaluation',
  'update:show-self-evaluation',
  'add-project',
  'remove-project',
  'switch-project',
  'add-skill',
  'remove-skill', 
  'switch-skill',
  'add-education',
  'remove-education',
  'switch-education',
  'toggle-self-evaluation'
])

// 创建本地响应式数据副本
const localPersonalInfo = reactive({ ...props.personalInfo })
const localSelfEvaluation = reactive({ ...props.selfEvaluation })

// 监听props变化，同步到本地数据
watch(() => props.personalInfo, (newVal) => {
  Object.assign(localPersonalInfo, newVal)
}, { deep: true })

watch(() => props.selfEvaluation, (newVal) => {
  Object.assign(localSelfEvaluation, newVal)
}, { deep: true })

// 监听本地数据变化，同步到父组件
watch(localPersonalInfo, (newVal) => {
  emit('update:personal-info', newVal)
}, { deep: true })

watch(localSelfEvaluation, (newVal) => {
  emit('update:self-evaluation', newVal)
}, { deep: true })

// 菜单项数据
const menuItems = ref(['个人信息', '项目经验', '掌握技能', '教育经历', '自我评价'])

// 当前激活的标签页
const activeTab = ref(0)

// 当前选中的项目索引
const activeProjectIndex = ref(0)

// 当前选中的技能索引
const activeSkillIndex = ref(0)

// 当前选中的教育经历索引
const activeEducationIndex = ref(0)

// 切换标签页的方法
const setActiveTab = (index) => {
  activeTab.value = index
}

// 数据更新方法
const updatePersonalInfo = (newData) => {
  Object.assign(localPersonalInfo, newData)
}

const updateProjectsList = (newData) => {
  emit('update:projects-list', newData)
}

const updateActiveProjectIndex = (newIndex) => {
  activeProjectIndex.value = newIndex
}

const updateSkillsList = (newData) => {
  emit('update:skills-list', newData)
}

const updateActiveSkillIndex = (newIndex) => {
  activeSkillIndex.value = newIndex
}

const updateEducationList = (newData) => {
  emit('update:education-list', newData)
}

const updateActiveEducationIndex = (newIndex) => {
  activeEducationIndex.value = newIndex
}

const updateSelfEvaluation = (newData) => {
  Object.assign(localSelfEvaluation, newData)
}

const updateShowSelfEvaluation = (newValue) => {
  emit('update:show-self-evaluation', newValue)
}

// 项目相关方法
const addProject = () => {
  emit('add-project')
}

const removeProject = (index) => {
  emit('remove-project', index)
}

const switchProject = (index) => {
  activeProjectIndex.value = index
  emit('switch-project', index)
}

// 技能相关方法
const addSkill = () => {
  emit('add-skill')
}

const removeSkill = (index) => {
  emit('remove-skill', index)
}

const switchSkill = (index) => {
  activeSkillIndex.value = index
  emit('switch-skill', index)
}

// 教育经历相关方法
const addEducation = () => {
  emit('add-education')
}

const removeEducation = (index) => {
  emit('remove-education', index)
}

const switchEducation = (index) => {
  activeEducationIndex.value = index
  emit('switch-education', index)
}

// 自我评价相关方法
const toggleSelfEvaluation = () => {
  emit('toggle-self-evaluation')
}

// 下载PDF的方法
const downloadPDF = async () => {
  try {
    // 显示加载提示
    const button = event.target
    const originalText = button.textContent
    button.textContent = '生成中...'
    button.disabled = true

    // 等待DOM更新
    await new Promise(resolve => setTimeout(resolve, 100))

    // 检查resumeContentRef是否存在
    if (!props.resumeContentRef) {
      throw new Error('简历内容引用不存在')
    }

    // 等待DOM更新
    await new Promise(resolve => setTimeout(resolve, 100))

    // 使用html2canvas截图指定区域
    const canvas = await html2canvas(document.body, {
      scale: 2, // 提高清晰度到2倍
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      // 指定截图区域：从页面坐标(0,0)开始，宽度800，高度1128
      x: 40,
      y: 40,
      width: 760,
      height: 1088,
      scrollX: 0,
      scrollY: 0,
      // 设置窗口尺寸
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      // 确保所有样式都被正确渲染
      foreignObjectRendering: true,
      // 处理字体渲染
      letterRendering: true,
      // 确保图片加载完成
      imageTimeout: 15000,
      // 移除日志输出
      logging: false
    })

    console.log('Canvas尺寸:', canvas.width, 'x', canvas.height)
    console.log('截图区域: 从(0,0)开始，尺寸800x1128')

    // 创建PDF - 使用A4尺寸
    const imgData = canvas.toDataURL('image/png', 1.0)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    // A4尺寸 (210mm x 297mm)
    const pdfWidth = 210
    const pdfHeight = 297
    const margin = 10 // 边距

    // 计算可用空间
    const availableWidth = pdfWidth - (margin * 2)
    const availableHeight = pdfHeight - (margin * 2)

    // 计算图片尺寸比例
    const imgWidth = canvas.width
    const imgHeight = canvas.height
    const ratio = Math.min(availableWidth / imgWidth, availableHeight / imgHeight)

    // 计算居中位置
    const finalWidth = imgWidth * ratio
    const finalHeight = imgHeight * ratio
    const x = (pdfWidth - finalWidth) / 2
    const y = margin

    console.log('PDF参数:', {
      pdfWidth,
      pdfHeight,
      imgWidth,
      imgHeight,
      ratio,
      finalWidth,
      finalHeight,
      x,
      y
    })

    // 添加图片到PDF
    pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight)

    // 下载PDF
    const fileName = `${localPersonalInfo.name || '简历'}_简历.pdf`
    pdf.save(fileName)

    // 恢复按钮状态
    button.textContent = originalText
    button.disabled = false

    console.log('PDF生成成功:', fileName)

  } catch (error) {
    console.error('生成PDF失败:', error)
    alert(`生成PDF失败: ${error.message}`)

    // 恢复按钮状态
    const button = event.target
    button.textContent = '下载 pdf 简历'
    button.disabled = false
  }
}
</script>

<style scoped>
.resume-model1-right {
  background: #fff;
  flex-grow: 1;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.resume-model1-right .control {
  padding: 10px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

/* 菜单 */
.resume-model1-right .control ul {
  padding: 0px 0px 10px 0px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.resume-model1-right .control ul li {
  list-style: none;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 2px;
  background-color: #eee;
  padding: 2px 7px;
  margin: 2px 0px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.resume-model1-right .control ul li:hover {
  background-color: #ddd;
}

.resume-model1-right .control ul li.active {
  background-color: #8df0cc;
  color: #333;
  font-weight: 600;
}

/* 内容 */
.resume-model1-right .control .control-content {
  flex-grow: 1;
  display: flex;
  width: 100%;
}

/* 下载按钮 */
.resume-model1-right .control button {
  height: 40px;
  border-radius: 5px;
  width: 100%;
  border: none;
  background-color: #8df0cc;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.3s;
}

.resume-model1-right button:hover {
  background-color: #2563eb;
  color: #fff;
}
</style>
