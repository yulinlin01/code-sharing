<template>
  <!-- 
    导航栏组件 - Nav.vue
    
    功能说明：
    - 提供整个应用的主要导航功能
    - 包含平台标题和功能模块导航链接
    - 支持路由激活状态显示和悬停效果
    
    组件结构：
    - nav-brand: 平台标题区域，点击返回首页
    - nav-menu: 导航菜单区域，包含所有功能模块链接
  -->
  <nav class="nav-container">
    <div class="nav-content">
      <!-- 平台标题区域 -->
      <div class="nav-brand">
        <router-link to="/" class="brand-link">
          <h1 class="brand-title">技术分享后台管理</h1>
        </router-link>
      </div>
      
      <!-- 导航菜单区域 -->
      <div class="nav-menu">
        <!-- 题库管理模块 -->
        <router-link to="/add-question-bank" class="nav-item">
          <span class="nav-text">添加题库</span>
        </router-link>

        <router-link to="/question-bank-category" class="nav-item">
          <span class="nav-text">题库分类管理</span>
        </router-link>
        
        <router-link to="/question-list" class="nav-item">
          <span class="nav-text">全部题库管理</span>
        </router-link>
        
        <!-- 文章管理模块 -->
        <router-link to="/add-article" class="nav-item">
          <span class="nav-text">添加文章</span>
        </router-link>
        
        <router-link to="/add-article-category" class="nav-item">
          <span class="nav-text">文章分类管理</span>
        </router-link>
        
        <router-link to="/article-list" class="nav-item">
          <span class="nav-text">全部文章管理</span>
        </router-link>

        <!-- 工具链接管理模块 -->
        <router-link to="/add-tool-link" class="nav-item">
          <span class="nav-text">添加友情链接</span>
        </router-link>
        
        <!-- 用户管理模块 -->
        <router-link to="/user-registration-review" class="nav-item">
          <span class="nav-text">注册审核</span>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* 导航栏容器 */
.nav-container {
  width: 100%;
  position: sticky;
  top: 10px;
  z-index: 100;
  display: flex;
  justify-content: center;
  background-color: #ffffff;
}

/* 导航内容 */
.nav-content {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  padding: 0 30px;
  border-radius: 10px;
}

.brand-link {
  text-decoration: none;
}

.brand-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
}

.brand-title:hover {
  color: #3370ff;
  transition: color 0.2s ease;
}

/* 导航菜单 */
.nav-menu {
  display: flex;
  align-items: center;
  gap: 0px;
}

/* 导航项 */
.nav-item {
  padding: 8px 16px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.2s ease;
  color: #1f2329;
}

.nav-item:hover {
  background: #f2f3f5;
  color: #1f2329;
}

/* 激活状态 */
.nav-item.router-link-active {
  background: #e6f4ff;
  color: #3370ff;
}
</style>

