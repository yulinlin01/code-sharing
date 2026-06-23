<template>
  <header class="nav-bar">
    <div class="nav-box">
      <div class="logo" :class="[logoClass, { 'logo-anim': logoBorderAnim }]">
        <svg
          class="logo-svg"
          viewBox="0 0 256 256"
          xmlns="http://www.w3.org/2000/svg"
        >
          <!-- animated border -->
          <rect
            x="40"
            y="20"
            width="176"
            height="216"
            rx="22"
            class="logo-border"
          />
          <g fill="currentColor">
            <rect x="60" y="36" width="56" height="184" rx="0" ry="0" />
            <rect x="60" y="36" width="120" height="48" rx="0" ry="0" />
            <rect x="60" y="116" width="104" height="44" rx="0" ry="0" />
          </g>
        </svg>
      </div>
      <nav class="nav-menu">
        <router-link to="/">首页</router-link>
        <router-link to="/articles">文章</router-link>
        <router-link to="/categories">题库分类</router-link>
        <router-link to="/questions">全部题库</router-link>
        <router-link to="/resume">在线简历</router-link>
        <div v-if="!username" class="login-container">
          <button @click="goToLogin" class="login-btn">登录/注册</button>
        </div>
        <div
          v-else
          class="user-avatar-container"
          @mouseenter="handleMouseEnter"
          @mouseleave="handleMouseLeave"
        >
          <div class="user-avatar">
            {{ username.charAt(0) }}
          </div>
          <div
            v-if="showDropdown"
            class="dropdown-menu"
            @mouseenter="handleMouseEnter"
            @mouseleave="handleMouseLeave"
          >
            <div class="dropdown-item" @click="logout">退出登录</div>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { ref, onMounted, watch, computed } from "vue";

const router = useRouter();
const route = useRoute();
const username = ref("");
const showDropdown = ref(false);
const hideTimeout = ref(null);
const logoBorderAnim = ref(false);

// 根据路由计算logo颜色类
const logoClass = computed(() => {
  const routeName = route.name;
  switch (routeName) {
    case "Home":
      return "logo-home";
    case "Articles":
      return "logo-articles";
    case "Categories":
      return "logo-category";
    case "Questions":
      return "logo-questions";
    case "Resume":
      return "logo-resume";
    case "ArticleDetail":
      return "logo-article-detail";
    case "QuestionDetail":
      return "logo-question-detail";
    case "Login":
      return "logo-login";
    default:
      return "logo-default";
  }
});

// Trigger border animation on route changes
watch(
  () => route.fullPath,
  () => {
    logoBorderAnim.value = false;
    requestAnimationFrame(() => {
      logoBorderAnim.value = true;
      setTimeout(() => (logoBorderAnim.value = false), 800);
    });
  },
  { immediate: true }
);

// 从localStorage获取用户名
function updateUsername() {
  username.value = localStorage.getItem("username") || "";
}

// 监听localStorage变化
function handleStorageChange() {
  updateUsername();
}

function goToLogin() {
  router.push("/login");
}

function handleMouseEnter() {
  // 清除之前的隐藏定时器
  if (hideTimeout.value) {
    clearTimeout(hideTimeout.value);
    hideTimeout.value = null;
  }
  showDropdown.value = true;
}

function handleMouseLeave() {
  // 设置延迟隐藏，给用户时间移动到下拉菜单
  hideTimeout.value = setTimeout(() => {
    showDropdown.value = false;
  }, 200);
}

function logout() {
  localStorage.removeItem("username");
  localStorage.removeItem("userId");
  localStorage.removeItem("token");
  username.value = "";
  showDropdown.value = false;
  router.push("/login");
}

// 组件挂载时获取用户名
onMounted(() => {
  updateUsername();

  // 监听localStorage变化
  window.addEventListener("storage", handleStorageChange);

  // 定时检查localStorage变化（因为storage事件只在其他标签页修改时触发）
  setInterval(() => {
    const currentUsername = localStorage.getItem("username") || "";
    if (currentUsername !== username.value) {
      updateUsername();
    }
  }, 1000);
});
</script>

<style scoped>
.nav-bar {
  width: 100vw;
  height: 60px;
  padding: 0px 100px;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 10px;
  left: 0;
  z-index: 1000;
}
.nav-box {
  height: 60px;
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  backdrop-filter: blur(10px);
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0px 0px 5px 0px #8df0cc inset;
}

.logo {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;
}

.logo-svg {
  width: 40px;
  height: 40px;
  display: block;
}

.logo-border {
  fill: none;
  stroke: currentColor;
  stroke-width: 20;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 560; /* approx perimeter */
  stroke-dashoffset: 560;
  opacity: 0;
}

.logo-anim .logo-border {
  animation: logo-stroke 0.8s ease forwards;
}

@keyframes logo-stroke {
  0% {
    stroke-dashoffset: 560;
    opacity: 0.1;
  }
  60% {
    opacity: 1;
  }
  100% {
    stroke-dashoffset: 0;
    opacity: 1;
  }
}

.logo-icon {
  width: 40px;
  height: 40px;
  background-color: currentColor; /* fill the SVG via mask to support route-based color */
  /* Use CSS var for url to avoid escaping issues */
  -webkit-mask: var(--logo-url) center / contain no-repeat;
  mask: var(--logo-url) center / contain no-repeat;
  transition: background-color 0.3s ease;
}

/* 不同路由的logo颜色 */
.logo-home {
  color: #10b981; /* 绿色 - 首页 */
}

.logo-articles {
  color: #3b82f6; /* 蓝色 - 文章 */
}

.logo-category {
  color: #8b5cf6; /* 紫色 - 分类 */
}

.logo-questions {
  color: #f59e0b; /* 橙色 - 题库 */
}

.logo-resume {
  color: #ec4899; /* 粉色 - 在线简历 */
}

.logo-article-detail {
  color: #06b6d4; /* 青色 - 文章详情 */
}

.logo-question-detail {
  color: #ef4444; /* 红色 - 题目详情 */
}

.logo-login {
  color: #84cc16; /* 青绿色 - 登录 */
}

.logo-default {
  color: rgba(255, 255, 255, 0.8); /* 默认白色 */
}

.nav-menu {
  display: flex;
  gap: 32px;
  align-items: center;
  font-weight: 700;
}

.nav-menu a,
.nav-menu .router-link-active {
  color: #fff9;
  text-decoration: none;
  font-size: 16px;
  transition: color 0.2s;
  padding: 2px 10px;
  border-radius: 8px;
}

.nav-menu a:hover,
.nav-menu .router-link-active {
  background-color: #8df0cc;
  color: black;
}

.login-btn {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 6px 20px;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.login-btn:hover {
  background: linear-gradient(135deg, #2563eb, #7c3aed);
}

/* 用户头像样式 */
.user-avatar-container {
  position: relative;
  cursor: pointer;
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 20%;
  background-color: rgba(255, 255, 255, 0.08);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  transition: background-color 0.2s;
}

.user-avatar:hover {
  background: #1746a2;
}

/* 下拉菜单样式 */
.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 120px;
  z-index: 1001;
  margin-top: 8px;
}

.dropdown-item {
  padding: 12px 16px;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background: #f5f5f5;
  color: #2d5af1;
}

.home-page,
.articles-page,
.question-bank-page,
.article-detail-page {
  padding-top: 64px;
}
</style>
