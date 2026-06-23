<template>
  <div class="resume-model1">
    <ResumeLeft 
      ref="leftComponent"
      :personal-info="personalInfo"
      :projects-list="projectsList"
      :skills-list="skillsList"
      :education-list="educationList"
      :self-evaluation="selfEvaluation"
      :show-self-evaluation="showSelfEvaluation"
    />
    <ResumeRight 
      :personal-info="personalInfo"
      :projects-list="projectsList"
      :skills-list="skillsList"
      :education-list="educationList"
      :self-evaluation="selfEvaluation"
      :show-self-evaluation="showSelfEvaluation"
      :resume-content-ref="leftComponent?.resumeContent"
      @update:personal-info="updatePersonalInfo"
      @update:projects-list="updateProjectsList"
      @update:skills-list="updateSkillsList"
      @update:education-list="updateEducationList"
      @update:self-evaluation="updateSelfEvaluation"
      @update:show-self-evaluation="updateShowSelfEvaluation"
      @add-project="addProject"
      @remove-project="removeProject"
      @switch-project="switchProject"
      @add-skill="addSkill"
      @remove-skill="removeSkill"
      @switch-skill="switchSkill"
      @add-education="addEducation"
      @remove-education="removeEducation"
      @switch-education="switchEducation"
      @toggle-self-evaluation="toggleSelfEvaluation"
    />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import ResumeLeft from './left.vue'
import ResumeRight from './right.vue'

// 左侧组件引用
const leftComponent = ref(null)

// 个人信息数据
const personalInfo = reactive({
  name: '张晓亮',
  age: '28岁',
  city: '上海',
  phone: '15356785678',
  email: '123671236717263@qq.com',
  education: '大三',
  position: '前端实习生'
})

// 项目经验数据 - 改为数组
const projectsList = ref([
  {
    id: 1,
    company: '公司/个人',
    position: '职位/部门',
    startDate: '',
    endDate: '',
    content: '项目内容/实习内容',
    technologies: '所用技术',
    problemsSolved: '解决问题'
  }
])

// 当前选中的项目索引
const activeProjectIndex = ref(0)

// 掌握技能数据 - 改为数组
const skillsList = ref([
  {
    id: 1,
    name: '掌握技能',
    description: "请输入技能详情"
  }
])

// 当前选中的技能索引
const activeSkillIndex = ref(0)

// 教育经历数据 - 改为数组
const educationList = ref([
  {
    id: 1,
    type: '专业',
    content: '计算机科学与技术'
  },
  {
    id: 2,
    type: '学历',
    content: '本科'
  },
  {
    id: 3,
    type: '学校',
    content: '某某大学'
  }
])

// 当前选中的教育经历索引
const activeEducationIndex = ref(0)

// 自我评价数据
const selfEvaluation = reactive({
  character: '性格......',
  learning: '学习能力......',
  other: '其他自我评价内容...'
})

// 自我评价显示状态
const showSelfEvaluation = ref(true)

// 数据更新方法
const updatePersonalInfo = (newData) => {
  Object.assign(personalInfo, newData)
}

const updateProjectsList = (newData) => {
  projectsList.value = [...newData]
}

const updateSkillsList = (newData) => {
  skillsList.value = [...newData]
}

const updateEducationList = (newData) => {
  educationList.value = [...newData]
}

const updateSelfEvaluation = (newData) => {
  Object.assign(selfEvaluation, newData)
}

const updateShowSelfEvaluation = (newValue) => {
  showSelfEvaluation.value = newValue
}

// 项目相关方法
const addProject = () => {
  const newProject = {
    id: projectsList.value.length + 1,
    company: '公司/个人',
    position: '职位/部门',
    startDate: '',
    endDate: '',
    content: '项目内容/实习内容',
    technologies: '所用技术',
    problemsSolved: '解决问题'
  }
  projectsList.value.push(newProject)
  activeProjectIndex.value = projectsList.value.length - 1
}

const removeProject = (index) => {
  if (projectsList.value.length > 1) {
    projectsList.value.splice(index, 1)
    if (activeProjectIndex.value >= projectsList.value.length) {
      activeProjectIndex.value = projectsList.value.length - 1
    }
  }
}

const switchProject = (index) => {
  activeProjectIndex.value = index
}

// 技能相关方法
const addSkill = () => {
  const newSkill = {
    id: skillsList.value.length + 1,
    name: '新技能',
    description: '请输入技能详情'
  }
  skillsList.value.push(newSkill)
  activeSkillIndex.value = skillsList.value.length - 1
}

const removeSkill = (index) => {
  if (skillsList.value.length > 1) {
    skillsList.value.splice(index, 1)
    if (activeSkillIndex.value >= skillsList.value.length) {
      activeSkillIndex.value = skillsList.value.length - 1
    }
  }
}

const switchSkill = (index) => {
  activeSkillIndex.value = index
}

// 教育经历相关方法
const addEducation = () => {
  const newEducation = {
    id: educationList.value.length + 1,
    type: '其他教育信息',
    content: '请输入具体教育信息内容'
  }
  educationList.value.push(newEducation)
  activeEducationIndex.value = educationList.value.length - 1
}

const removeEducation = (index) => {
  // 不允许删除前三个默认的教育信息
  if (index >= 3 && educationList.value.length > 3) {
    educationList.value.splice(index, 1)
    if (activeEducationIndex.value >= educationList.value.length) {
      activeEducationIndex.value = educationList.value.length - 1
    }
  }
}

const switchEducation = (index) => {
  activeEducationIndex.value = index
}

// 自我评价相关方法
const toggleSelfEvaluation = () => {
  showSelfEvaluation.value = !showSelfEvaluation.value
}
</script>

<style scoped>
.resume-model1 {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}
</style>