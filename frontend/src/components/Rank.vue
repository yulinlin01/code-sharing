<template>
  <div class="rank-box">
    <h1 class="title-h1">Ranking List</h1>
    <p class="title-p">排行榜</p>
    <div class="author-list">
      <div 
        v-for="(author, index) in sortedAuthors" 
        :key="author.username" 
        class="author-item"
      >
        <div class="rank">{{ index + 1 }}</div>
        <div class="info">
          <div class="name">{{ author.username.split('-')[0] }}</div>
          <div class="stats">
            <span class="question-count">{{ author.questionCount }}个题目</span>
            <span class="article-count">{{ author.articleCount }}篇文章</span>
          </div>
        </div>
      </div>
      <div v-if="sortedAuthors.length === 0" class="no-data">
        暂无数据
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch, onMounted } from 'vue';
import { useLogStore } from '../store/log';
import { useUserStore } from '../store/user';
import { SERVER_URL } from '../tools/ip.js';

const logStore = useLogStore();
const userStore = useUserStore();

// 组件挂载时获取用户相关日志数据
onMounted(async () => {
  try {
    const articleLogRes = await fetch(`${SERVER_URL}admin/get-article-log`);
    if (articleLogRes.ok) {
      const articleLogData = await articleLogRes.json();
      logStore.setArticleLog(articleLogData.data);
    }

    const questionLogRes = await fetch(`${SERVER_URL}admin/get-question-log`);
    if (questionLogRes.ok) {
      const questionLogData = await questionLogRes.json();
      logStore.setQuestionLog(questionLogData.data);
    }

    // 获取所有用户信息
    const usersRes = await fetch(`${SERVER_URL}admin/getAllUser`);
    if (usersRes.ok) {
      const usersData = await usersRes.json();
      userStore.setUsers(usersData.data);
    }
  } catch (e) {
    console.error('获取数据失败：', e);
  }
});

// 计算排行榜数据
const sortedAuthors = computed(() => {
  // 从 userStore 获取所有用户作为基础数据
  const allUsers = userStore.getAllUsers;
  // 初始化所有用户的统计数据
  const authorStats = {};
  allUsers.forEach(user => {
    authorStats[user.username] = {
      username: user.username,
      userId: user._id,
      articleCount: 0,
      questionCount: 0
    };
  });
  
  // 统计文章日志中的用户数据
  logStore.articleLog.forEach(log => {
    if (log.username && authorStats[log.username]) {
      authorStats[log.username].articleCount++;
    }
  });
  
  // 统计问题日志中的用户数据
  logStore.questionLog.forEach(log => {
    if (log.username && authorStats[log.username]) {
      authorStats[log.username].questionCount++;
    }
  });
  
  // 转换为数组并计算总数
  const authors = Object.values(authorStats).map(author => ({
    ...author,
    totalCount: author.articleCount + author.questionCount
  }));
  
  // 按总数降序排序（展示所有用户）
  return authors.sort((a, b) => b.totalCount - a.totalCount);
});

// 侦听数据变化，重新计算
watch(
  [() => logStore.articleLog, () => logStore.questionLog, () => userStore.users],
  () => {
    // 数据变化时会自动重新计算 sortedAuthors
    //console.log('排行榜数据已更新');
  },
  { deep: true }
);
</script>

<style scoped>
.rank-box {
  width: 100%;
}
.title-h1{
  font-size: 40px;
  margin: 0px !important;
  margin-bottom: 12px;
  color: #fff;
  font-weight: 700;
  text-align: center;
}
.title-p{
  font-size: 16px;
  margin-bottom: 12px;
  color: #fff;
  font-weight: 700;
  text-align: center;
}
.author-list {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 14px;
}
.author-item {
  background: rgba(255,255,255,0.1);
  border-radius: 10px;
  backdrop-filter: blur(10px);
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.rank {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.2);
  color: #fff9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}
.info .name {
  font-size: 15px;
  font-weight: 500;
  color: #fff9;
}
.stats {
  display: flex;
  gap: 12px;
  font-size: 8px;
  color : #8df0cc;
}
.no-data {
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  padding: 20px 0;
}
</style>
