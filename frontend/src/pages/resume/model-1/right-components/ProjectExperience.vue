<template>
  <div class="control-content-item">
    <ul class="project-button">
      <li 
        v-for="(project, index) in projectsList" 
        :key="project.id"
        :class="{ active: localActiveProjectIndex === index }"
        @click="switchProject(index)"
      >
        {{ index + 1 }}
      </li>
      <li class="add-project-btn" @click="addProject">+</li>
    </ul>
    <!-- 项目基本信息 -->
    <div class="project-basic-info">
      <div class="input-group">
        <label>公司/部门</label>
        <input type="text" v-model="localProjectsList[localActiveProjectIndex].company" placeholder="请输入公司或部门名称" />
      </div>
      <div class="input-group">
        <label>职位</label>
        <input type="text" v-model="localProjectsList[localActiveProjectIndex].position" placeholder="请输入职位名称" />
      </div>
      <div class="input-group">
        <label>开始时间</label>
        <input type="date" v-model="localProjectsList[localActiveProjectIndex].startDate" />
      </div>
      <div class="input-group">
        <label>结束时间</label>
        <input type="date" v-model="localProjectsList[localActiveProjectIndex].endDate" />
      </div>
      <div class="input-group">
        <label>项目背景</label>
        <textarea v-model="localProjectsList[localActiveProjectIndex].content" placeholder="请描述实习期间的主要工作内容和职责" rows="4"></textarea>
      </div>
      <div class="input-group">
        <label>技术方案</label>
        <textarea v-model="localProjectsList[localActiveProjectIndex].technologies" placeholder="请列出使用的主要技术和工具" rows="3"></textarea>
      </div>
      <div class="input-group">
        <label>解决问题</label>
        <textarea v-model="localProjectsList[localActiveProjectIndex].problemsSolved" placeholder="请描述解决的主要问题和取得的成果" rows="3"></textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

// 定义props
const props = defineProps({
  projectsList: {
    type: Array,
    required: true
  },
  activeProjectIndex: {
    type: Number,
    required: true
  }
})

// 定义emits（使用kebab-case以匹配父组件模板）
const emit = defineEmits([
  'update:projects-list',
  'update:active-project-index',
  'add-project',
  'remove-project',
  'switch-project'
])

// 创建本地响应式数据副本
const localProjectsList = ref([...props.projectsList])
const localActiveProjectIndex = ref(props.activeProjectIndex)

// 防抖标记，避免 props->local 同步时触发向上 emit 导致递归
let isSyncingProjects = false
let isSyncingActiveIndex = false

// 监听props变化，同步到本地数据
watch(() => props.projectsList, (newVal) => {
  isSyncingProjects = true
  localProjectsList.value = [...newVal]
  nextTick(() => { isSyncingProjects = false })
}, { deep: true })

watch(() => props.activeProjectIndex, (newVal) => {
  isSyncingActiveIndex = true
  localActiveProjectIndex.value = newVal
  nextTick(() => { isSyncingActiveIndex = false })
})

// 监听本地数据变化，同步到父组件
watch(localProjectsList, (newVal) => {
  if (isSyncingProjects) return
  emit('update:projects-list', newVal)
}, { deep: true })

watch(localActiveProjectIndex, (newVal) => {
  if (isSyncingActiveIndex) return
  emit('update:active-project-index', newVal)
})

// 项目相关方法
const addProject = () => {
  emit('add-project')
}

const removeProject = (index) => {
  emit('remove-project', index)
}

const switchProject = (index) => {
  localActiveProjectIndex.value = index
  emit('switch-project', index)
}
</script>

<style scoped>
.control-content-item {
  flex-grow: 1;
  width: 100%;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 5px;
  font-size: 12px;
}

.input-group label {
  padding-left: 3px;
  width: fit-content;
  color: #4e7282;
  font-weight: 500;
}

.input-group input {
  width: 100%;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 3px;
  font-size: 12px;
  transition: border-color 0.3s ease;
}

.input-group textarea {
  font-size: 12px;
  height: 150px !important;
  width: 100%;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 3px;
  resize: none;
  transition: border-color 0.3s ease;
}

.input-group input:focus {
  outline: none;
  border-color: #3b82f6;
}

.input-group textarea:focus {
  outline: none;
  border-color: #3b82f6;
}

.project-basic-info {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e0e0e0;
}

.project-button {
  display: flex;
  padding: 0;
  list-style: none;
  gap: 10px;
  justify-content: flex-start;
  margin-bottom: 10px;
}

.project-button li {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  background-color: #f0f0f0;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.project-button li:hover {
  background-color: #e0e0e0;
}

.project-button li.active {
  background-color: #8df0cc;
  color: #333;
  border-color: #4e7282;
}

.add-project-btn {
  background-color: #4e7282 !important;
  font-size: 20px;
}

.add-project-btn:hover {
  background-color: #3a5a6b !important;
}
</style>
