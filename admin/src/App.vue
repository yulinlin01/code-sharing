<script setup>
/**
 * 主应用组件 - App.vue
 * 
 * 功能说明：
 * - 作为整个应用的根组件，负责整体布局和路由管理
 * - 包含导航栏和主内容区域的布局结构
 * - 提供页面切换的过渡动画效果
 * 
 * 组件结构：
 * - Nav: 顶部导航栏组件
 * - router-view: Vue Router 的页面内容渲染区域
 * - transition: 页面切换时的淡入淡出动画
 */

// 导入导航栏组件
import Nav from './components/Nav.vue'
</script>

<template>
  <div class="app-container">
    <!-- 导航栏 -->
    <Nav />
    <!-- 页面内容 -->
    <main class="main-content">
       <transition name="fade">
          <router-view />
       </transition>
    </main>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  padding: 10px 50px;
}
.main-content {
  padding: 50px 0px;
}

/* 路由过渡：fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
