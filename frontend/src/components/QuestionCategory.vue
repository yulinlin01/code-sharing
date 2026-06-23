<template>
  <div class="category-list">
    <div
      v-for="item in questionStore.categories"
      :key="item._id.$oid"
      class="category-item pointer"
    >
      <div class="category-name">
        {{ item.firstCategory }}
      </div>
      <div class="subcategory-list">
        <div
          v-for="child in item.children"
          :key="child._id.$oid"
          class="subcategory-item pointer subcategory-flex"
          @click.stop="handleSubcategoryClick(child)"
        >
          <span>{{ child.secondCategory }}</span>
          <span class="subcategory-count">
            {{ getQuestionCount(child) }} 题
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useQuestionStore } from "../store/question";
import { SERVER_URL } from "../tools/ip.js";

const router = useRouter();
const questionStore = useQuestionStore();

// 定义事件
const emit = defineEmits(["subcategory-click"]);

// 处理子分类点击
const handleSubcategoryClick = (secondCategory) => {
  emit("subcategory-click", secondCategory);
  router.push({
    name: "Questions",
    query: {
      category: secondCategory.secondCategory,
    },
  });
};

// 计算某二级分类下的题目数量
const getQuestionCount = (secondCategory) => {
  return questionStore.questions.filter(
    (q) => q.secondCategory === secondCategory.secondCategory
  ).length;
};

// 更新瀑布流布局
const updateWaterfallSpans = () => {
  const items = document.querySelectorAll(".category-item");
  items.forEach((item) => {
    const height = item.clientHeight;
    const rowHeight = 10; // 必须与grid-auto-rows一致
    item.style.setProperty("--span", Math.ceil(height / rowHeight) + 2); // +2补偿
  });
};

// 获取分类数据
const fetchCategories = async () => {
  try {
    // 获取问题分类数据
    const res = await fetch(`${SERVER_URL}getCateGory`);
    if (!res.ok) throw new Error("获取问题分类失败");
    const data = await res.json();
    questionStore.setCategories(data.data);
  } catch (e) {
    console.error("获取问题分类失败：", e);
  }
};

onMounted(async () => {
  await fetchCategories();
  updateWaterfallSpans();
});
</script>

<style scoped>
.category-list {
  width: 100vw;
  padding: 100px 100px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 20px;
}

.category-item {
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  padding: 18px;
  font-size: 16px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  grid-row-end: span var(--span, 1);
  transition: box-shadow 0.2s, transform 0.2s;
}

.category-item:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.13);
  transform: translateY(-3px);
}

.category-name {
  padding: 5px;
  font-size: 18px;
  font-weight: 600;
  background: linear-gradient(
    135deg,
    rgba(29, 78, 216, 0.3),
    rgba(236, 72, 153, 0.3)
  );
  color: #fff;
  border-radius: 10px;
}

.subcategory-list {
  margin-top: 8px;
}

.subcategory-item {
  padding: 5px;
  border-bottom: 1px dotted rgba(0, 0, 0, 0.7);
  cursor: pointer;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.subcategory-item:last-child {
  border-bottom: none;
}

.pointer {
  cursor: pointer;
}

.subcategory-flex {
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.subcategory-count {
  font-size: 13px;
  color: #fff;
  margin-left: 12px;
}
</style>
