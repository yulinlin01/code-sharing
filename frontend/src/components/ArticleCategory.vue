<template>
  <div class="article-category-list">
    <span
      v-for="cat in categories"
      :key="cat"
      :class="['category-item-btn', { active: selectedCategory === cat }]"
      @click="handleCategoryClick(cat)"
    >
      {{ cat }}
    </span>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useArticleStore } from "../store/article";
import { SERVER_URL } from "../tools/ip.js";

const articleStore = useArticleStore();
const categories = ref(["全部"]);
const selectedCategory = ref("全部");

// 定义事件
const emit = defineEmits(['category-change']);

// 处理分类点击
const handleCategoryClick = (category) => {
  selectedCategory.value = category;
  emit('category-change', category);
};

// 获取分类数据
const fetchCategories = async () => {
  try {
    const res = await fetch(`${SERVER_URL}getArticleCategory`);
    if (!res.ok) throw new Error("获取分类失败");
    const data = await res.json();
    categories.value = ["全部", ...data.data.map((c) => c.articleCategory)];
  } catch (e) {
    console.error("获取分类失败：", e);
  }
};

// 监听分类变化，更新文章过滤
watch(
  selectedCategory,
  (val) => {
    if (val === "全部") {
      articleStore.setFilterArticle(articleStore.articles);
    } else {
      articleStore.setFilterArticle(
        articleStore.articles.filter((a) => a.articleCategory === val)
      );
    }
  },
  { immediate: true }
);

onMounted(() => {
  fetchCategories();
});
</script>

<style scoped>
.article-category-list {
  margin-bottom: 16px;
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}

.category-item-btn {
  padding: 6px 18px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  outline: none;
  user-select: none;
  backdrop-filter: blur(10px);
  font-weight: 700;
}

.category-item-btn.active {
   background:  #8df0cc;
  color: black;
}
</style>
