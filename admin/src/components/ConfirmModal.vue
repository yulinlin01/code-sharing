<template>
  <transition name="modal-fade">
    <div v-if="visible" class="modal-overlay" @click="handleOverlayClick">
      <transition name="modal-pop">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>{{ title }}</h3>
          </div>
          <div class="modal-body">
            <slot>
              <p>{{ content }}</p>
            </slot>
          </div>
          <div class="modal-footer">
            <button 
              v-if="showCancel" 
              class="cancel-btn" 
              @click="handleCancel"
            >
              {{ cancelText }}
            </button>
            <button 
              v-if="showConfirm" 
              class="confirm-btn" 
              @click="handleConfirm"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup>
/**
 * 确认弹窗组件 - ConfirmModal.vue
 * 
 * 功能说明：
 * - 提供通用的确认对话框功能
 * - 支持自定义标题、内容、按钮文本
 * - 支持插槽内容自定义
 * - 提供确认、取消事件回调
 * - 支持遮罩层点击关闭功能
 * 
 * 使用场景：
 * - 删除操作确认
 * - 重要操作二次确认
 * - 信息提示对话框
 * 
 * 事件说明：
 * - confirm: 点击确认按钮时触发
 * - cancel: 点击取消按钮或遮罩层时触发
 * - update:visible: 更新弹窗显示状态
 */

// 导入 Vue 3 组合式 API
import { defineProps, defineEmits } from 'vue'

/**
 * 组件属性定义
 * 定义所有可配置的 props 及其类型和默认值
 */
const props = defineProps({
  // 弹窗是否显示
  visible: {
    type: Boolean,
    default: false
  },
  // 弹窗标题
  title: {
    type: String,
    default: '确认操作'
  },
  // 弹窗内容（当没有使用插槽时显示）
  content: {
    type: String,
    default: ''
  },
  // 是否显示取消按钮
  showCancel: {
    type: Boolean,
    default: true
  },
  // 是否显示确认按钮
  showConfirm: {
    type: Boolean,
    default: true
  },
  // 取消按钮文本
  cancelText: {
    type: String,
    default: '取消'
  },
  // 确认按钮文本
  confirmText: {
    type: String,
    default: '确认'
  },
  // 点击遮罩层是否关闭弹窗
  closeOnOverlay: {
    type: Boolean,
    default: true
  }
})

/**
 * 组件事件定义
 * 定义组件可以向父组件发送的事件
 */
const emit = defineEmits(['confirm', 'cancel', 'update:visible'])

/**
 * 处理确认按钮点击事件
 * 向父组件发送 confirm 事件
 */
function handleConfirm() {
  emit('confirm')
}

/**
 * 处理取消按钮点击事件
 * 向父组件发送 cancel 事件并关闭弹窗
 */
function handleCancel() {
  emit('cancel')
  emit('update:visible', false)
}

/**
 * 处理遮罩层点击事件
 * 根据 closeOnOverlay 属性决定是否关闭弹窗
 */
function handleOverlayClick() {
  if (props.closeOnOverlay) {
    emit('cancel')
    emit('update:visible', false)
  }
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-pop-enter-active,
.modal-pop-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.modal-pop-enter-from,
.modal-pop-leave-to {
  opacity: 0;
  transform: scale(0.98) translateY(6px);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  border-radius: 5px;
  width: 400px;
  height: 200px;
}

.modal-header {
  padding: 10px;
  height: 50px;
  border-bottom: 1px solid #eef0f2;
  text-align: center;
  box-sizing: border-box;
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
}

.modal-body {
  height: 100px;
  padding: 10px;
  box-sizing: border-box;
  border-bottom: 1px solid #eef0f2;
}

.modal-body p {
  margin: 0;
  font-size: 15px;
}

.modal-footer {
  height: 50px;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel-btn {
  padding: 0px 20px;
  background: #f2f3f5;
  border: none;
  border-radius: 5px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s ease;
}

.cancel-btn:hover {
  background: #e5e6eb;
}

.confirm-btn {
  padding: 0px 20px;
  background: #3370ff;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s ease;
}

.confirm-btn:hover {
  background: #2b63e5;
}

.confirm-btn.danger {
  background: #ff4d4f;
}

.confirm-btn.danger:hover {
  background: #d9363e;
}
</style>
