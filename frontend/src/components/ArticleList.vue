<template>
  <div class="article-list">
    <div
      v-if="!displayArticles || displayArticles.length === 0"
      class="empty-tip"
    >
      暂无文章数据
    </div>
    <div
      v-for="(item, index) in displayArticles"
      :key="item._id"
      class="article-card"
      :style="{ background: gradients[index % gradients.length] }"
      @click="goToDetail(item._id)"
      style="cursor: pointer"
    >
      <div class="title">{{ item.articleName }}</div>
      <div class="divider"></div>
      <div class="meta">
        <span class="time">创建时间：{{ item.articleCreateTime }}</span>
        <span class="count">观看数：{{ item.count }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch, ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useArticleStore } from "../store/article";
import { SERVER_URL } from "../tools/ip.js";

const articleStore = useArticleStore();
const articles = ref(articleStore.filterArticle);

// 获取文章数据
const fetchArticles = async () => {
  try {
    const res = await fetch(`${SERVER_URL}getArticle`);
    if (!res.ok) throw new Error("网络请求失败");
    const data = await res.json();
    articleStore.setArticles(data.data);
  } catch (e) {
    console.error("获取文章失败：", e);
  }
};

// 组件挂载时获取数据
onMounted(async () => {
  await fetchArticles();
});

// 定义渐变色数组
const gradients = [
  'linear-gradient(135deg, rgba(29,78,216,0.3), rgba(236,72,153,0.3))',
  'linear-gradient(135deg, rgba(16,185,129,0.3), rgba(59,130,246,0.3))',
  'linear-gradient(135deg, rgba(234,88,12,0.3), rgba(99,102,241,0.3))',
  'linear-gradient(135deg, rgba(168,85,247,0.3), rgba(236,72,153,0.3))',
  'linear-gradient(135deg, rgba(34,197,94,0.3), rgba(59,130,246,0.3))',
  'linear-gradient(135deg, rgba(245,158,11,0.3), rgba(239,68,68,0.3))'
];

watch(
  () => articleStore.filterArticle,
  (val) => {
    articles.value = val;
  },
  { deep: true }
);



const router = useRouter();
const route = useRoute();

const displayArticles = computed(() => {
  if (route.path === "/" || route.name === "Home") {
    // 按count降序排序，取前4
    return [...articles.value]
      .sort((a, b) => (b.count || 0) - (a.count || 0))
      .slice(0, 4);
  }
  return articles.value;
});

function goToDetail(id) {
  router.push({ name: "ArticleDetail", params: { id } });
}
</script>

<style scoped>
.article-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}
.article-card {
  border-radius: 12px;
  backdrop-filter: blur(10px);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  padding: 10px 14px 8px 14px;
  display: flex;
  flex-direction: column;
  gap: 0;
  transition: box-shadow 0.2s, transform 0.2s;
  height: 100px;
}
.article-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.13);
  transform: translateY(-3px);
}
.title {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 2px;
}
.meta {
  display: flex;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 2px;
}
.author {
  color: #2d5af1;
}
.time {
  color: rgba(255, 255, 255, 0.7);
}
.count {
  color: rgba(255, 255, 255, 0.9);
  margin-left: 10px;
}
.divider {
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
  margin: 6px 0;
}
.empty-tip {
  grid-column: 1 / -1;
  color: #aaa;
  text-align: center;
  font-size: 16px;
  margin: 32px 0;
}
</style>
