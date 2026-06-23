<template>
  <div class="article-detail-page">
    <!-- 背景 -->
    <Bg></Bg>
    <div class="article-detail-container">
      <h1 class="title">{{ article.articleName }}</h1>
      <span class="time">时间：{{ article.articleCreateTime }}</span>
      <span class="count">阅读数：{{ article.count }}</span>
      <div v-if="article" class="desc-markdown" v-html="renderedContent"></div>
    </div>
    <!-- 浏览记录提示 -->
    <div v-if="showLogMessage" class="log-message">
      {{ logMessage }}
    </div>
  </div>
</template>

<script setup>
import Bg from '../components/Bg.vue'
import { useRoute } from "vue-router";
import { useArticleStore } from "../store/article";
import { computed } from "vue";
import { renderArticleMarkdown, highlightCode } from "../tools/markdown.js";
import "../tools/markdown.css";
import { nextTick } from "vue";
import { ref, onMounted ,onUnmounted} from "vue";
import { SERVER_URL } from "../tools/ip.js";
const route = useRoute();
const articleId = route.params.id;
const articleStore = useArticleStore();
const article = computed(() => articleStore.getArticleById(articleId));
// 浏览记录相关
const showLogMessage = ref(false);
const logMessage = ref("");
let logTimer = null;
const renderedContent = computed(() => {
  if (article.value && article.value.articleContent) {
    const html = renderArticleMarkdown(article.value.articleContent);
    // 确保在内容更新后重新高亮代码
    nextTick(() => {
      highlightCode(".desc-markdown pre code");
    });
    return html;
  }
  return "";
});
// 发送浏览记录到服务器
async function sendArticleLog() {
  try {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.log("用户未登录，跳过浏览记录");
      return;
    }

    const response = await fetch(`${SERVER_URL}admin/article-log`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        articleId: articleId,
        username : localStorage.getItem("username"),
      }),
    });

    const data = await response.json();
    if (response.ok) {
      // 显示服务器返回的消息
      logMessage.value = data.message || "浏览记录已保存";
      showLogMessage.value = true;

      // 2秒后隐藏提示
      setTimeout(() => {
        showLogMessage.value = false;
      }, 2000);
    } else {
      console.error("保存浏览记录失败:", data.message);
    }
  } catch (error) {
    console.error("发送浏览记录请求失败:", error);
  }
}
// 组件挂载时启动3秒定时器
onMounted(() => {
  logTimer = setTimeout(() => {
    sendArticleLog();
  }, 3000);
});
// 组件卸载时清理定时器
onUnmounted(() => {
  if (logTimer) {
    clearTimeout(logTimer);
  }
});
</script>

<style scoped>
.article-detail-page {
  padding: 100px 100px;
  width: 100vw;
}
.article-detail-container {
  max-width: 1200px;
  margin: 0 auto;
}
.title {
  font-size: 30px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 10px;
}
.time {
  font-size: 15px;
  color: #fff;
  padding: 10px;
  background: linear-gradient(135deg, rgba(16,185,129,0.3), rgba(59,130,246,0.3));
  border-radius: 10px;
  margin-right: 10px;
}
.count {
  font-size: 15px;
  color: #fff;
  padding: 10px;
  background: linear-gradient(135deg, rgba(29,78,216,0.3), rgba(236,72,153,0.3));
  border-radius: 10px;
}

/* 浏览记录提示样式 - 渐变色弹窗 */
.log-message {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(135deg, rgba(16,185,129,0.9), rgba(59,130,246,0.9));
  backdrop-filter: blur(10px);
  color: white;
  padding: 16px 24px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  z-index: 1001;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: fadeInScale 0.4s ease-out;
  min-width: 200px;
  text-align: center;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.7);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}
</style>
