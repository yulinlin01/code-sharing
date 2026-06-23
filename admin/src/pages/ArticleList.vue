<template>
  <div class="article-list-page">
    <h2>全部文章管理</h2>
    <div class="category-cards">
      <button
        type="button"
        class="category-card"
        :class="{ selected: selectedCategory === '全部分类' }"
        @click="selectCategory('全部分类')"
      >全部分类</button>
      <button
        v-for="cat in categoryNames"
        :key="cat"
        type="button"
        class="category-card"
        :class="{ selected: selectedCategory === cat }"
        @click="selectCategory(cat)"
      >{{ cat }}</button>
    </div>

    <div class="table-wrapper">
      <table class="article-table">
        <thead>
          <tr>
            <th>文章标题</th>
            <th>文章分类</th>
            <th>观看数量</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="a in filteredArticles" :key="a._id || a.id || a.articleName">
            <td class="title-cell" :title="a.articleName">{{ a.articleName }}</td>
            <td>{{ a.articleCategory }}</td>
            <td>{{ a.count ?? 0 }}</td>
            <td>{{ a.articleCreateTime }}</td>
            <td>
              <button class="delete-btn" @click="openDeleteModal(a)">删除</button>
            </td>
          </tr>
          <tr v-if="filteredArticles.length === 0">
            <td colspan="5" class="empty">暂无数据</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <ConfirmModal
    :visible="showDeleteModal"
    :title="modalTitle"
    :content="modalContent"
    :showCancel="true"
    :showConfirm="true"
    cancelText="取消"
    confirmText="确定"
    @cancel="onDeleteCancel"
    @confirm="onDeleteConfirm"
    @update:visible="(v) => showDeleteModal = v"
  />
</template>

<script setup>
// 导入依赖
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import { SERVER_IP } from "../tools/ip.js";
import ConfirmModal from "../components/ConfirmModal.vue";

// 基础状态：文章列表、分类列表、当前选中的分类
const articles = ref([]);
const categories = ref([]);
const selectedCategory = ref("全部分类");

// 分类名称数组（兼容后端返回字符串或对象的两种结构）
const categoryNames = computed(() => {
  const list = Array.isArray(categories.value) ? categories.value : [];
  return list.map(c => typeof c === 'string' ? c : (c.articleCategory || '')).filter(Boolean);
});

// 根据选中分类对文章进行筛选
const filteredArticles = computed(() => {
  if (selectedCategory.value === '全部分类') return articles.value;
  return articles.value.filter(a => a.articleCategory === selectedCategory.value);
});

// 切换分类
function selectCategory(cat) {
  selectedCategory.value = cat;
}

// 获取文章列表
async function fetchArticles() {
  try {
    const res = await axios.get(`${SERVER_IP}article/getArticle`);
    const list = Array.isArray(res.data) ? res.data : (res.data.data || []);
    articles.value = list;
  } catch (e) {
    articles.value = [];
  }
}

// 获取文章分类列表
async function fetchCategories() {
  try {
    const res = await axios.get(`${SERVER_IP}article/getArticleCategory`);
    const list = Array.isArray(res.data) ? res.data : (res.data.data || []);
    categories.value = list;
  } catch (e) {
    categories.value = [];
  }
}

// 删除文章（若后端未实现删除接口，则前端做移除兜底）
async function deleteArticle(a) {
  const id = a._id || a.id;
  if (!id) {
    // 后端可能未提供删除接口，先做前端删除兜底
    articles.value = articles.value.filter(x => x !== a);
    return;
  }
  try {
    await axios.delete(`${SERVER_IP}article/deleteArticle`, { data: { id } });
    articles.value = articles.value.filter(x => (x._id || x.id) !== id);
  } catch (e) {
    // 如果后端未实现删除接口，退化为前端移除
    articles.value = articles.value.filter(x => (x._id || x.id) !== id);
  }
}

// 页面挂载后请求数据
onMounted(() => {
  fetchArticles();
  fetchCategories();
});

// 删除弹窗相关
const showDeleteModal = ref(false);
const modalTitle = ref("删除文章");
const modalContent = ref("");
const pendingDeleteArticle = ref(null);

function openDeleteModal(a) {
  pendingDeleteArticle.value = a;
  modalTitle.value = "删除文章";
  const name = a?.articleName || "";
  const category = a?.articleCategory || "";
  modalContent.value = `你确定要删除 ${category} 分类下的 ${name} 文章吗？`;
  showDeleteModal.value = true;
}

function onDeleteCancel() {
  showDeleteModal.value = false;
  pendingDeleteArticle.value = null;
}

async function onDeleteConfirm() {
  const target = pendingDeleteArticle.value;
  if (target) {
    await deleteArticle(target);
  }
  showDeleteModal.value = false;
  pendingDeleteArticle.value = null;
}
</script>

<style scoped>
.article-list-page {
  width: 100%;
}

.article-list-page h2 {
  text-align: center;
  font-size: 30px;
  font-weight: 700;
  margin-bottom: 12px;
}

.category-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 12px;
}
.category-card {
  padding: 5px;
  border-radius: 10px;
  border: 1px solid #dcdfe6;
  cursor: pointer;
  transition: all 0.15s ease;
}
.category-card:hover {
  border-color: #409eff;
  color: #409eff;
}
.category-card.selected {
  background: #409eff;
  color: #fff;
}

.table-wrapper {
  width: 100%;
}

.article-table {
  width: 100%;
}
.article-table th,
.article-table td {
  padding: 10px;
  border-bottom: 1px solid #ebeef5;
  text-align: left;
  font-size: 15px;
}
.article-table th {
  background: #f5f7fa;
}
.empty {
  text-align: center;
  color: #909399;
}

.delete-btn {
  padding: 4px 12px;
  background: #ff4d4f;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 13px;
  cursor: pointer;
}
.delete-btn:hover {
  background: #d9363e;
}
</style>


