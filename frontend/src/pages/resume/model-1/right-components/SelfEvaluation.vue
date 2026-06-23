<template>
  <div class="control-content-item">
    <div class="self-evaluation-toggle">
      <label class="toggle-label">显示自我评价</label>
      <button 
        class="toggle-btn" 
        :class="{ active: showSelfEvaluation }"
        @click="toggleSelfEvaluation"
      >
        {{ showSelfEvaluation ? '关闭' : '开启' }}
      </button>
    </div>
    <div class="self-evaluation-content" v-if="showSelfEvaluation">
      <div class="input-group">
        <label>性格特点</label>
        <textarea v-model="localSelfEvaluation.character" placeholder="请描述您的性格特点" rows="3"></textarea>
      </div>
      <div class="input-group">
        <label>学习能力</label>
        <textarea v-model="localSelfEvaluation.learning" placeholder="请描述您的学习能力" rows="3"></textarea>
      </div>
      <div class="input-group">
        <label>其他评价</label>
        <textarea v-model="localSelfEvaluation.other" placeholder="请添加其他自我评价" rows="3"></textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'

// 定义props
const props = defineProps({
  selfEvaluation: {
    type: Object,
    required: true
  },
  showSelfEvaluation: {
    type: Boolean,
    required: true
  }
})

// 定义emits
const emit = defineEmits([
  'update:selfEvaluation',
  'update:showSelfEvaluation',
  'toggleSelfEvaluation'
])

// 创建本地响应式数据副本
const localSelfEvaluation = reactive({ ...props.selfEvaluation })
const localShowSelfEvaluation = ref(props.showSelfEvaluation)

// 监听props变化，同步到本地数据
watch(() => props.selfEvaluation, (newVal) => {
  Object.assign(localSelfEvaluation, newVal)
}, { deep: true })

watch(() => props.showSelfEvaluation, (newVal) => {
  localShowSelfEvaluation.value = newVal
})

// 监听本地数据变化，同步到父组件
watch(localSelfEvaluation, (newVal) => {
  emit('update:selfEvaluation', newVal)
}, { deep: true })

watch(localShowSelfEvaluation, (newVal) => {
  emit('update:showSelfEvaluation', newVal)
})

// 自我评价相关方法
const toggleSelfEvaluation = () => {
  localShowSelfEvaluation.value = !localShowSelfEvaluation.value
  emit('toggleSelfEvaluation')
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

.input-group textarea:focus {
  outline: none;
  border-color: #3b82f6;
}

/* 自我评价切换按钮样式 */
.self-evaluation-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 6px;
}

.toggle-label {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.toggle-btn {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
  color: #666;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s ease;
}

.toggle-btn.active {
  background-color: #4e7282;
  color: #fff;
  border-color: #4e7282;
}

.toggle-btn:hover {
  background-color: #4e7282;
  color: #fff;
}
</style>
