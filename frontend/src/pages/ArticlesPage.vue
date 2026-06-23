<template>
  <div class="articles-page">
    <!-- 背景 -->
    <Bg></Bg>
    <div class="articles-list">
      <ArticleCategory />
      <ArticleList />
    </div>
  </div>
</template>

<script setup>
import Bg from '../components/Bg.vue'
import ArticleList from "../components/ArticleList.vue";
import ArticleCategory from "../components/ArticleCategory.vue";
</script>

<style scoped>
.articles-page {
  min-height: 100vh;
}
.articles-list {
  max-width: none;
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding: 100px 100px;
  width: 100vw;
}
</style>
