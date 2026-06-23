<template>
  <div class="add-article-category-page">
    <div class="two-col">
      <section class="col">
        <h2>添加文章分类</h2>
        <form class="category-form" @submit.prevent="submitArticleCategory">
          <div class="form-group">
            <input
              v-model="articleCategory"  
              type="text"
              placeholder="请输入分类名称"
              required
            />
          </div>
          <button type="submit">提交分类</button>
        </form>
      </section>

      <section class="col">
          <h2>已有分类</h2>
          <template v-if="articleCategoryList.length">
            <table class="category-table">
              <thead>
                <tr>
                  <th>分类名称</th>
                  <th>文章数量</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="cat in articleCategoryList" :key="cat.articleCategory || cat">
                  <td>{{ typeof cat === 'string' ? cat : cat.articleCategory }}</td>
                  <td>{{ getCategoryCount(typeof cat === 'string' ? cat : cat.articleCategory) }}</td>
                  <td>
                    <button type="button" class="op-btn" @click="confirmDelete(cat)">删除</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </template>
          <template v-else>
            <div class="empty">暂无分类</div>
          </template>
      </section>
    </div>

    
  </div>
  <!-- 全局确认弹窗 -->
  <ConfirmModal
    :visible="modalVisible"
    :title="modalTitle"
    :content="modalContent"
    :show-cancel="modalShowCancel"
    :show-confirm="modalShowConfirm"
    confirm-text="确定"
    :close-on-overlay="false"
    @confirm="handleModalConfirm"
    @cancel="modalVisible = false"
  />
</template>

<script setup>
// 引入所需依赖：HTTP 客户端、Vue 组合式 API、服务端地址常量
import axios from "axios";
import { onMounted, ref } from "vue";
import ConfirmModal from "../components/ConfirmModal.vue";
import { SERVER_IP } from "../tools/ip.js";

/**
 * 用户正在输入的文章分类名称
 */
const articleCategory = ref("");

/**
 * 已有文章分类列表（由后端接口返回）
 * 兼容两种返回格式：字符串数组或包含 articleCategory 字段的对象数组
 */
const articleCategoryList = ref([]);
// 全部文章列表（用于统计每个分类下的文章数量）
const allArticles = ref([]);

/**
 * 弹窗控制与内容
 */
const modalVisible = ref(false);
const modalTitle = ref("添加分类");
const modalContent = ref("");
const modalShowCancel = ref(false);
const modalShowConfirm = ref(true);
const modalAction = ref("info"); // info | delete
const pendingDeleteId = ref(null);
const pendingDeleteName = ref("");

async function fetchArticleCategoryList() {
  // 从后端获取分类列表并做兼容性处理
  try {
    const res = await axios.get(`${SERVER_IP}article/getArticleCategory`);
    articleCategoryList.value = Array.isArray(res.data)
      ? res.data
      : res.data.data || [];
  } catch (e) {
    // 请求失败时，重置为空列表，避免渲染异常
    articleCategoryList.value = [];
  }
}

// 获取全部文章数据，用于统计分类文章数量
async function fetchAllArticles() {
  try {
    const res = await axios.get(`${SERVER_IP}article/getArticle`);
    allArticles.value = Array.isArray(res.data) ? res.data : (res.data.data || []);
  } catch (e) {
    allArticles.value = [];
  }
}

// 根据分类名称统计该分类下的文章数量
function getCategoryCount(categoryName) {
  if (!categoryName) return 0;
  return allArticles.value.filter(a => a.articleCategory === categoryName).length;
}

async function submitArticleCategory() {
  // 去除首尾空格并校验输入
  const category = articleCategory.value.trim();
  if (!category) return;
  try {
    // 先检查后端是否已存在该分类，避免重复添加
    const checkRes = await axios.get(`${SERVER_IP}article/getArticleCategory`);
    const existedList = Array.isArray(checkRes.data)
      ? checkRes.data
      : checkRes.data.data || [];
    const exists = existedList.some((item) => {
      const name = typeof item === "string" ? item : item.articleCategory;
      return name === category;
    });
    if (exists) {
      // 已存在：弹出提示，不进行提交
      modalTitle.value = "添加分类";
      modalContent.value = `你添加的 ${category} 分类已经存在，请重新核对输入`;
      modalShowCancel.value = false;
      modalShowConfirm.value = true;
      modalAction.value = "info";
      modalVisible.value = true;
      return;
    }

    await axios.post(`${SERVER_IP}article/addArticleCategory`, {
      articleCategory: category,
    });
    // 成功：弹窗提示
    modalTitle.value = "添加分类";
    modalContent.value = `成功添加了 ${category} 分类`;
    modalShowCancel.value = false;
    modalShowConfirm.value = true;
    modalAction.value = "info";
    modalVisible.value = true;
    // 清空输入框
    articleCategory.value = "";
    // 刷新列表显示新添加的分类
    fetchArticleCategoryList();
  } catch (e) {
    // 静默失败：此处可根据需要补充错误提示或日志
  }
}

onMounted(() => {
  // 组件挂载后加载已有分类列表
  fetchArticleCategoryList();
  fetchAllArticles();
});

// 触发删除分类的二次确认弹窗
function confirmDelete(cat) {
  const name = typeof cat === "string" ? cat : (cat.articleCategory || "");
  const id = (typeof cat === "object" && (cat.id || cat._id)) ? (cat.id || cat._id) : null;
  pendingDeleteId.value = id;
  pendingDeleteName.value = name;
  modalTitle.value = "删除分类";
  modalContent.value = `你确定要删除 ${name} 分类吗，删除后 ${name} 分类下的所有文章将设置为未分类状态？`;
  modalShowCancel.value = true;
  modalShowConfirm.value = true;
  modalAction.value = "delete";
  modalVisible.value = true;
}

// 弹窗确认按钮处理
async function handleModalConfirm() {
  if (modalAction.value === "delete") {
    if (!pendingDeleteId.value) {
      modalVisible.value = false;
      return;
    }
    try {
      const res = await axios.delete(`${SERVER_IP}article/deleteArticleCategory`, {
        data: { id: pendingDeleteId.value },
      });
      const msg = (res && res.data && res.data.message) ? res.data.message : "操作完成";
      alert(msg);
      modalVisible.value = false;
      // 刷新分类列表
      fetchArticleCategoryList();
    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || "删除失败";
      alert(msg);
      modalVisible.value = false;
    } finally {
      pendingDeleteId.value = null;
      pendingDeleteName.value = "";
      modalAction.value = "info";
    }
  } else {
    // info 模式仅关闭
    modalVisible.value = false;
  }
}
</script>

<style scoped>
.add-article-category-page {
  width: 100%;
}

.two-col {
  display: flex;
}

.two-col .col {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
.two-col .col:nth-child(1){
  width: 400px;
  flex-shrink: 0;
  padding-right: 20px;
}
.two-col .col:nth-child(2){
  padding-left: 20px;
  flex-grow: 1;
}
h2 {
  margin: 0 0 20px 0;
  text-align: center;
  font-size: 30px;
}

.category-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

input[type="text"] {
  width: 100%;
  padding: 10px 16px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  font-size: 15px;
}

button[type="submit"] {
  padding: 10px 16px;
  background: #409eff;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 700;
}

.category-table {
  width: 100%;
}
.category-table th,
.category-table td {
  padding: 10px;
  border-bottom: 1px solid #ebeef5;
  text-align: left;
  font-size: 15px;
}
.category-table th {
  background: #f5f7fa;
}
.category-table th:nth-child(2),
.category-table td:nth-child(2) {
  width: 140px;
  text-align: center;
}
.op-btn {
  padding: 4px 12px;
  background: #3370ff;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 13px;
  cursor: pointer;
}
.op-btn:hover {
  background: #2b63e5;
}
</style>
