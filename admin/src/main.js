/**
 * 应用入口文件 - main.js
 * 
 * 功能说明：
 * - Vue 3 应用的启动入口
 * - 负责创建 Vue 应用实例并挂载到 DOM
 * - 配置全局样式和路由
 * 
 * 执行流程：
 * 1. 导入全局样式文件
 * 2. 导入 Vue 3 核心 API
 * 3. 导入根组件和路由配置
 * 4. 创建应用实例并挂载
 */

// 导入全局样式文件
import "./assets/main.css";

// 导入 Vue 3 核心 API
import { createApp } from "vue";
// 导入根组件
import App from "./App.vue";
// 导入路由配置
import router from "./router";

// 创建 Vue 应用实例，配置路由，并挂载到 #app 元素
createApp(App).use(router).mount("#app");
