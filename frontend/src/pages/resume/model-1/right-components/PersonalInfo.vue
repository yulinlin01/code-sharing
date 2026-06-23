<template>
  <div class="control-content-item">
    <div class="input-group">
      <label>姓名</label>
      <input type="text" v-model="localPersonalInfo.name" placeholder="请输入姓名" />
    </div>
    <div class="input-group">
      <label>年龄</label>
      <input type="text" v-model="localPersonalInfo.age" placeholder="请输入年龄" />
    </div>
    <div class="input-group">
      <label>城市</label>
      <input type="text" v-model="localPersonalInfo.city" placeholder="请输入城市" />
    </div>
    <div class="input-group">
      <label>电话</label>
      <input type="text" v-model="localPersonalInfo.phone" placeholder="请输入电话号码" />
    </div>
    <div class="input-group">
      <label>邮箱</label>
      <input type="email" v-model="localPersonalInfo.email" placeholder="请输入邮箱地址" />
    </div>
    <div class="input-group">
      <label>学历</label>
      <input type="text" v-model="localPersonalInfo.education" placeholder="请输入学历" />
    </div>
    <div class="input-group">
      <label>职位</label>
      <input type="text" v-model="localPersonalInfo.position" placeholder="请输入期望职位" />
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'

// 定义props
const props = defineProps({
  personalInfo: {
    type: Object,
    required: true
  }
})

// 定义emits
const emit = defineEmits(['update:personalInfo'])

// 创建本地响应式数据副本
const localPersonalInfo = reactive({ ...props.personalInfo })

// 监听props变化，同步到本地数据
watch(() => props.personalInfo, (newVal) => {
  Object.assign(localPersonalInfo, newVal)
}, { deep: true })

// 监听本地数据变化，同步到父组件
watch(localPersonalInfo, (newVal) => {
  emit('update:personalInfo', newVal)
}, { deep: true })
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

.input-group input:focus {
  outline: none;
  border-color: #3b82f6;
}
</style>
