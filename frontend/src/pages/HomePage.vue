<template>
  <div class="home-page">
    <div class="main-content">
      <!-- 背景 -->
      <Bg></Bg>
      <!-- 中间内容区 -->
      <section class="content-center">
          <!-- 轮播图 -->
          <Swiper />
          <!-- 用户图表 -->
          <Charts />
          <!-- 排行榜 -->
          <Rank />
          <!-- 友情链接 -->
          <FriendLinks />
      </section>
    </div>
  </div>
</template>

<script setup>
import Charts from '../components/Charts.vue'
import Rank from "../components/Rank.vue";
import FriendLinks from "../components/FriendLinks.vue";
import Swiper from '../components/Swiper.vue';
import Bg from '../components/Bg.vue'
</script>

<style scoped>
.home-page {
  min-height: 100vh;
}
.main-content {
  display: flex;
  gap: 24px;
  padding: 100px 100px;
  width: 100vw;
}
.content-center {
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex: 1 1 0;
  min-width: 0;
}
</style>
