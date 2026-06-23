<template>
  <div class="control-content-item">
    <ul class="education-button">
      <li 
        v-for="(education, index) in educationList" 
        :key="education.id"
        :class="{ active: localActiveEducationIndex === index }"
        @click="switchEducation(index)"
      >
        {{ index + 1 }}
      </li>
      <li class="add-education-btn" @click="addEducation">+</li>
    </ul>
    <div class="education-input-group">
      <div class="input-group">
        <input 
          type="text" 
          v-model="localEducationList[localActiveEducationIndex].type" 
          placeholder="教育信息类型"
          :disabled="localActiveEducationIndex < 3"
        />
        <input 
          type="text" 
          v-model="localEducationList[localActiveEducationIndex].content" 
          placeholder="请输入具体教育信息内容"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

// 定义props
const props = defineProps({
  educationList: {
    type: Array,
    required: true
  },
  activeEducationIndex: {
    type: Number,
    required: true
  }
})

// 定义emits（使用kebab-case以匹配父组件模板）
const emit = defineEmits([
  'update:education-list',
  'update:active-education-index',
  'add-education',
  'remove-education',
  'switch-education'
])

// 创建本地响应式数据副本
const localEducationList = ref([...props.educationList])
const localActiveEducationIndex = ref(props.activeEducationIndex)

// 防抖标记，避免 props->local 同步时触发向上 emit 导致递归
let isSyncingEducation = false
let isSyncingActiveIndex = false

// 监听props变化，同步到本地数据
watch(() => props.educationList, (newVal) => {
  isSyncingEducation = true
  localEducationList.value = [...newVal]
  Promise.resolve().then(() => { isSyncingEducation = false })
}, { deep: true })

watch(() => props.activeEducationIndex, (newVal) => {
  isSyncingActiveIndex = true
  localActiveEducationIndex.value = newVal
  Promise.resolve().then(() => { isSyncingActiveIndex = false })
})

// 监听本地数据变化，同步到父组件
watch(localEducationList, (newVal) => {
  if (isSyncingEducation) return
  emit('update:education-list', newVal)
}, { deep: true })

watch(localActiveEducationIndex, (newVal) => {
  if (isSyncingActiveIndex) return
  emit('update:active-education-index', newVal)
})

// 教育经历相关方法
const addEducation = () => {
  emit('add-education')
}

const switchEducation = (index) => {
  localActiveEducationIndex.value = index
  emit('switch-education', index)
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

.input-group input {
  width: 100%;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 3px;
  font-size: 12px;
  transition: border-color 0.3s ease;
}

.input-group input:focus {
  outline: none;
  border-color: #3b82f6;
}

.education-button {
  display: flex;
  padding: 0;
  list-style: none;
  gap: 10px;
  justify-content: flex-start !important;
  margin-bottom: 20px;
}

.education-button li {
  background-color: #f0f0f0;
  border-radius: 3px;
  cursor: pointer;
  font-size: 10px;
  transition: all 0.3s ease;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.education-button li:hover {
  background-color: #e0e0e0;
}

.education-button li.active {
  background-color: #8df0cc;
  color: #333;
}

.add-education-btn {
  background-color: #4e7282 !important;
  color: white !important;
  font-size: 20px;
  font-weight: bold;
}

.add-education-btn:hover {
  background-color: #3a5a6b !important;
}

.education-input-group {
  margin-bottom: 20px;
}

.education-actions {
  margin-top: 20px;
  text-align: center;
}

.education-input-group .input-group input:disabled {
  background-color: #f5f5f5;
  color: #999;
  cursor: not-allowed;
}

.remove-btn {
  background-color: #ff4757;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.remove-btn:hover {
  background-color: #ff3742;
}
</style>
