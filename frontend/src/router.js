import { createRouter, createWebHistory } from "vue-router";
import HomePage from "./pages/HomePage.vue";
import CategoryPage from "./pages/CategoryPage.vue";
import QuestionListPage from "./pages/QuestionListPage.vue";
import ArticlesPage from "./pages/ArticlesPage.vue";
import ArticleDetailPage from "./pages/ArticleDetailPage.vue";
import QuestionDetailPage from "./pages/QuestionDetailPage.vue";
import LoginPage from "./pages/LoginPage.vue";
import ResumePage from "./pages/ResumePage.vue";
import { customAlert } from "./utils/alert";
import { SERVER_URL } from "./tools/ip.js";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomePage,
  },
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
  },
  {
    path: "/categories",
    name: "Categories",
    component: CategoryPage,
  },
  {
    path: "/questions",
    name: "Questions",
    component: QuestionListPage,
  },
  {
    path: "/articles",
    name: "Articles",
    component: ArticlesPage,
  },
  {
    path: "/resume",
    name: "Resume",
    component: ResumePage,
  },
  {
    path: "/articles/:id",
    name: "ArticleDetail",
    component: ArticleDetailPage,
  },
  {
    path: "/questions/:id",
    name: "QuestionDetail",
    component: QuestionDetailPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      // 浏览器前进/后退时，自动恢复滚动位置
      return savedPosition;
    } else {
      // 其他情况，滚动到顶部
      return { top: 0 };
    }
  }
});

// 路由前置守卫
router.beforeEach(async (to, from, next) => {
  // 白名单页面：无需登录即可访问
  const whitelist = ['/login'];
  if (whitelist.includes(to.path)) {
    next();
    return;
  }

  try {
    // 获取localStorage中的token
    const token = localStorage.getItem('token');
    // 如果没有token，直接跳转到登录页
    if (!token) {
      customAlert('未找到登录信息，请登录', '登录提示');
      next('/login');
      return;
    }
    // 调用服务器check接口验证token，设置超时
    const response = await fetch(`${SERVER_URL}admin/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ token }),
    });
    const data = await response.json();
    if (data.code === 200) {
      // token有效，放行
      console.log('Token验证成功');
      next();
    } else if (data.code === 302) {
      // token无效，提示用户并跳转到登录页
      customAlert('Token已过期，请重新登录', '登录过期');
      next('/login');
    } 
  } catch (error) {
    console.log(error);
  }
});

export default router;
