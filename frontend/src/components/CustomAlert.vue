<template>
  <div v-if="visible" class="alert-overlay" @click="handleOverlayClick">
    <div class="alert-container" @click.stop>
      <div class="alert-header">
        <h3 class="alert-title">{{ title }}</h3>
        <button class="alert-close" @click="close">×</button>
      </div>
      <div class="alert-content">
        <p class="alert-message">{{ message }}</p>
      </div>
      <div class="alert-footer">
        <button class="alert-btn alert-btn-primary" @click="confirm">
          {{ confirmText }}
        </button>
        <button v-if="showCancel" class="alert-btn alert-btn-secondary" @click="cancel">
          {{ cancelText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '提示'
  },
  message: {
    type: String,
    default: ''
  },
  confirmText: {
    type: String,
    default: '确定'
  },
  cancelText: {
    type: String,
    default: '取消'
  },
  showCancel: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['confirm', 'cancel', 'close'])

const confirm = () => {
  emit('confirm')
  close()
}

const cancel = () => {
  emit('cancel')
  close()
}

const close = () => {
  emit('close')
}

const handleOverlayClick = () => {
  close()
}
</script>

<style scoped>
.alert-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease;
}

.alert-container {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.8));
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  min-width: 300px;
  max-width: 500px;
  animation: slideIn 0.3s ease;
}

.alert-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.alert-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.alert-close {
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.alert-close:hover {
  background: rgba(0, 0, 0, 0.1);
  color: #333;
}

.alert-content {
  padding: 20px 24px;
}

.alert-message {
  margin: 0;
  font-size: 16px;
  color: #666;
  line-height: 1.5;
}

.alert-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px 24px;
}

.alert-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 80px;
}

.alert-btn-primary {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
}

.alert-btn-primary:hover {
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  transform: translateY(-1px);
}

.alert-btn-secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.alert-btn-secondary:hover {
  background: #e5e7eb;
  transform: translateY(-1px);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
