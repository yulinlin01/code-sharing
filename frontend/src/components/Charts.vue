<template>
  <div class="charts-container">
    <div class="chart-grid">
      <div class="chart-item">
        <h1 class="chart-h1">Today</h1>
        <p class="chart-p">今日阅读文章数量</p>
        <div class="number-display">{{ todayArticleCount }}</div>
      </div>
      <div class="chart-item">
        <h1 class="chart-h1">Today</h1>
        <p class="chart-p">今日答题数量</p>
        <div class="number-display">{{ todayQuestionCount }}</div>
      </div>
      <div class="chart-item">
        <h1 class="chart-h1">Total</h1>
        <p class="chart-p">总阅读文章数量</p>
        <div class="number-display">{{ totalArticleCount }}</div>
      </div>
      <div class="chart-item">
        <h1 class="chart-h1">Total</h1>
        <p class="chart-p">总答题数量</p>
        <div class="number-display">{{ totalQuestionCount }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useLogStore } from '../store/log';

const logStore = useLogStore();

// 从localStorage获取当前登录用户的userId
const currentUserId = ref(localStorage.getItem('userId') || '');

// 计算今日阅读文章数量
const todayArticleCount = computed(() => {
  const today = new Date().toISOString().split('T')[0]; // 获取今天的日期 YYYY-MM-DD
 
  return logStore.articleLog.filter(log => 
    log.userId === currentUserId.value && 
    log.articleTime && 
    log.articleTime.split('T')[0] === today
  ).length;
});

// 计算今日答题数量
const todayQuestionCount = computed(() => {
  const today = new Date().toISOString().split('T')[0]; // 获取今天的日期 YYYY-MM-DD
  return logStore.questionLog.filter(log => 
    log.userId === currentUserId.value && 
    log.questionTime && 
    log.questionTime.split('T')[0] === today
  ).length;
});

// 计算总阅读文章数量
const totalArticleCount = computed(() => {
  return logStore.articleLog.filter(log => log.userId === currentUserId.value).length;
});

// 计算总答题数量
const totalQuestionCount = computed(() => {
  return logStore.questionLog.filter(log => log.userId === currentUserId.value).length;
});
</script>

<style scoped>
.charts-container {
  width: 100%;
}

.chart-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.chart-item {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 20px;
}
.chart-h1{
    color : #fff;
    font-size: 30px;
    font-weight: 700;
}
.chart-p{
    color : #fff;
    font-size: 14px;
    font-weight: 700;
}
.number-display {
  color: #fff;
  font-size: 48px;
  font-weight: 700;
  margin-top: 10px;
}
</style>