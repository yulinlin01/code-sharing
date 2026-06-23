import { createApp } from 'vue'
import CustomAlert from '../components/CustomAlert.vue'

class AlertManager {
  constructor() {
    this.currentAlert = null
  }

  show(options = {}) {
    // 如果已有弹窗，先关闭
    if (this.currentAlert) {
      this.hide()
    }

    const {
      title = '提示',
      message = '',
      confirmText = '确定',
      cancelText = '取消',
      showCancel = false,
      onConfirm = null,
      onCancel = null,
      onClose = null
    } = options

    // 创建弹窗容器
    const container = document.createElement('div')
    container.id = 'custom-alert-container'
    document.body.appendChild(container)

    // 创建Vue应用实例
    const app = createApp(CustomAlert, {
      visible: true,
      title,
      message,
      confirmText,
      cancelText,
      showCancel,
      onConfirm: () => {
        if (onConfirm) onConfirm()
        this.hide()
      },
      onCancel: () => {
        if (onCancel) onCancel()
        this.hide()
      },
      onClose: () => {
        if (onClose) onClose()
        this.hide()
      }
    })

    // 挂载应用
    app.mount(container)

    // 保存引用
    this.currentAlert = { app, container }
  }

  hide() {
    if (this.currentAlert) {
      this.currentAlert.app.unmount()
      if (this.currentAlert.container && this.currentAlert.container.parentNode) {
        this.currentAlert.container.parentNode.removeChild(this.currentAlert.container)
      }
      this.currentAlert = null
    }
  }

  // 简单的alert替代方法
  alert(message, title = '提示') {
    return new Promise((resolve) => {
      this.show({
        title,
        message,
        onConfirm: () => resolve(true),
        onClose: () => resolve(true)
      })
    })
  }

  // confirm替代方法
  confirm(message, title = '确认') {
    return new Promise((resolve) => {
      this.show({
        title,
        message,
        showCancel: true,
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
        onClose: () => resolve(false)
      })
    })
  }
}

// 创建全局实例
const alertManager = new AlertManager()

// 导出便捷方法
export const customAlert = (message, title) => alertManager.alert(message, title)
export const customConfirm = (message, title) => alertManager.confirm(message, title)
export const showAlert = (options) => alertManager.show(options)
export const hideAlert = () => alertManager.hide()

// 默认导出
export default alertManager
