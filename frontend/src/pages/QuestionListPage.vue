<template>
  <div class="question-box">
    <!-- 背景 -->
    <Bg></Bg>
    <!-- 题目列表 -->
    <QuestionList />
  </div>
</template>

<script setup>
import QuestionList from "../components/QuestionList.vue";
import Bg from "../components/Bg.vue";
</script>

<style scoped>
.question-box {
  padding: 100px 100px;
}
</style>
