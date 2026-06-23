<template>
  <div class="control-content-item">
    <ul class="skills-button">
      <li 
        v-for="(skill, index) in skillsList" 
        :key="skill.id"
        :class="{ active: localActiveSkillIndex === index }"
        @click="switchSkill(index)"
      >
        {{ index + 1 }}
      </li>
      <li class="add-skill-btn" @click="addSkill">+</li>
    </ul>
    <div class="skill-input-group">
      <div class="input-group">
        <input 
          type="text" 
          v-model="localSkillsList[localActiveSkillIndex].name" 
          placeholder="技能名称"
        />
        <textarea 
          v-model="localSkillsList[localActiveSkillIndex].description" 
          placeholder="请输入技能详情" 
          rows="3"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

// 定义props
const props = defineProps({
  skillsList: {
    type: Array,
    required: true
  },
  activeSkillIndex: {
    type: Number,
    required: true
  }
})

// 定义emits（使用kebab-case以匹配父组件模板）
const emit = defineEmits([
  'update:skills-list',
  'update:active-skill-index',
  'add-skill',
  'remove-skill',
  'switch-skill'
])

// 创建本地响应式数据副本
const localSkillsList = ref([...props.skillsList])
const localActiveSkillIndex = ref(props.activeSkillIndex)

// 防抖标记，避免 props->local 同步时触发向上 emit 导致递归
let isSyncingSkills = false
let isSyncingActiveIndex = false

// 监听props变化，同步到本地数据
watch(() => props.skillsList, (newVal) => {
  isSyncingSkills = true
  localSkillsList.value = [...newVal]
  // 下一次tick后再允许向上同步
  Promise.resolve().then(() => { isSyncingSkills = false })
}, { deep: true })

watch(() => props.activeSkillIndex, (newVal) => {
  isSyncingActiveIndex = true
  localActiveSkillIndex.value = newVal
  Promise.resolve().then(() => { isSyncingActiveIndex = false })
})

// 监听本地数据变化，同步到父组件
watch(localSkillsList, (newVal) => {
  if (isSyncingSkills) return
  emit('update:skills-list', newVal)
}, { deep: true })

watch(localActiveSkillIndex, (newVal) => {
  if (isSyncingActiveIndex) return
  emit('update:active-skill-index', newVal)
})

// 技能相关方法
const addSkill = () => {
  emit('add-skill')
}

const removeSkill = (index) => {
  emit('remove-skill', index)
}

const switchSkill = (index) => {
  localActiveSkillIndex.value = index
  emit('switch-skill', index)
}
</script>

<style scoped>
.control-content-item {
  flex-grow: 1;
  width: 100%;
}

.skill-input-group {
  margin-bottom: 20px;
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

.skills-button {
  display: flex;
  list-style: none;
  gap: 10px;
  justify-content: flex-start;
  margin-bottom: 10px;
  padding: 0;
  font-size: 10px;
}

.skills-button li {
  background-color: #f0f0f0;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.skills-button li:hover {
  background-color: #e0e0e0;
}

.skills-button li.active {
  background-color: #8df0cc;
  color: #333;
  border-color: #4e7282;
}

.add-skill-btn {
  background-color: #4e7282 !important;
  color: white !important;
  font-weight: bold;
}

.add-skill-btn:hover {
  background-color: #3a5a6b !important;
}

</style>
