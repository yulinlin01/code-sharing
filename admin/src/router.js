/**
 * 路由配置文件 - router.js
 * 
 * 功能说明：
 * - 定义整个应用的路由规则和页面映射关系
 * - 使用 Vue Router 4.x 进行单页面应用的路由管理
 * - 支持浏览器历史记录和前进后退功能
 * 
 * 路由结构：
 * - 首页: / -> Home.vue
 * - 题库管理: /add-question-bank, /question-bank-category, /question-list
 * - 文章管理: /add-article, /add-article-category, /article-list
 * - 工具链接: /add-tool-link
 * - 用户管理: /user-registration-review
 */

// 导入 Vue Router 核心 API
import { createRouter, createWebHistory } from "vue-router";
import { SERVER_IP } from "./tools/ip.js";

// 导入所有页面组件
import Home from "./pages/Home.vue";
import AddQuestionBank from "./pages/AddQuestionBank.vue";
import AddArticle from "./pages/AddArticle.vue";
import AddArticleCategory from "./pages/AddArticleCategory.vue";
import AddToolLink from "./pages/AddToolLink.vue";
import UserRegistrationReview from "./pages/UserRegistrationReview.vue";
import ArticleList from "./pages/ArticleList.vue";
import QuestionBankCategory from "./pages/QuestionBankCategory.vue";
import QuestionList from "./pages/QuestionList.vue";

/**
 * 路由配置数组
 * 定义所有页面的路径和对应的组件
 */
const routes = [
  // 首页路由
  { path: "/", component: Home },
  
  // 题库管理相关路由
  { path: "/add-question-bank", component: AddQuestionBank },
  { path: "/question-bank-category", component: QuestionBankCategory },
  { path: "/question-list", component: QuestionList },
  
  // 文章管理相关路由
  { path: "/add-article", component: AddArticle },
  { path: "/add-article-category", component: AddArticleCategory },
  { path: "/article-list", component: ArticleList },
  
  // 工具链接管理路由
  { path: "/add-tool-link", component: AddToolLink },
  
  // 用户管理路由
  { path: "/user-registration-review", component: UserRegistrationReview },
];

/**
 * 创建路由实例
 * - 使用 HTML5 History API 模式
 * - 支持浏览器前进后退和直接访问 URL
 */
const router = createRouter({
  history: createWebHistory(), // 使用 HTML5 History 模式
  routes, // 路由配置
});

/**
 * 路由拦截器 - 实现token验证
 * 除了根路径(/)之外，访问其他路由都需要验证token
 */
router.beforeEach(async (to, from, next) => {
  // 如果是访问根路径，直接放行
  if (to.path === '/') {
    next();
    return;
  }

  // 获取sessionStorage中的token
  const token = localStorage.getItem('token');
  // 如果没有token，直接重定向到登录页
  if (!token) {
    alert("请先登陆")
    next('/');
    return;
  }

  try {
    // 发送token到服务器进行验证
    const response = await fetch(`${SERVER_IP}/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ token })
    });

    const data = await response.json();
    
    // 如果服务器返回success为true，允许访问
    if (data.success === true) {
      next();
    } else {
      // 验证失败，清除token并重定向到登录页
      alert(data.message);
      localStorage.removeItem('token');
      next('/');
    }
  } catch (error) {
    // 网络错误或其他异常，清除token并重定向到登录页
    console.error('Token验证失败:', error);
    localStorage.removeItem('token');
    next('/');
  }
});

// 导出路由实例供 main.js 使用
export default router;
