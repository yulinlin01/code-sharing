<template>
  <div class="bg" :class="bgClass">
    <img id="bg_img" src="../assets/bg.png" alt="" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

// 根据路由计算背景滤镜类名
const bgClass = computed(() => {
  const routeName = route.name;

  switch (routeName) {
    case "Home":
      return "bg-home";
    case "Login":
      return "bg-login";
    case "Categories":
      return "bg-categories";
    case "Questions":
      return "bg-questions";
    case "Articles":
      return "bg-articles";
    case "ArticleDetail":
      return "bg-article-detail";
    case "QuestionDetail":
      return "bg-question-detail";
    default:
      return "bg-default";
  }
});
</script>

<style scoped>
.bg {
  width: 100%;
  position: fixed;
  z-index: -100;
  top: -100px;
  left: 0px;
}

.bg #bg_img {
  width: 100%;
  max-height: 150vh;
  position: absolute;
  opacity: 0.3;
}

/* 首页 - 温暖的橙红色调 */
.bg-home img {
  filter: hue-rotate(20deg) saturate(1.2) brightness(0.8);
}

/* 登录页 - 清新的蓝绿色调 */
.bg-login img {
  filter: hue-rotate(180deg) saturate(1.1) brightness(0.9);
}

/* 分类页 - 神秘的紫色调 */
.bg-categories img {
  filter: hue-rotate(280deg) saturate(1.3) brightness(0.7);
}

/* 题目列表页 - 活力的绿色调 */
.bg-questions img {
  filter: hue-rotate(120deg) saturate(1.2) brightness(0.8);
}

/* 文章列表页 - 优雅的蓝紫色调 */
.bg-articles img {
  filter: hue-rotate(240deg) saturate(1.1) brightness(0.8);
}

/* 文章详情页 - 专业的深蓝色调 */
.bg-article-detail img {
  filter: hue-rotate(200deg) saturate(0.9) brightness(0.6);
}

/* 题目详情页 - 专注的深绿色调 */
.bg-question-detail img {
  filter: hue-rotate(100deg) saturate(1.1) brightness(0.7);
}

/* 默认样式 */
.bg-default img {
  filter: hue-rotate(0deg) saturate(1) brightness(0.8);
}
</style>
