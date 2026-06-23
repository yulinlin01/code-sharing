<template>
  <div class="add-article-page-flex">
    <div class="article-section">
      <h2>添加文章</h2>
      <form class="article-form" @submit.prevent="submitArticle">
        <div class="form-group">
          <textarea
            v-model="articleText"
            rows="10"
            placeholder="请输入文章内容，支持 Markdown 语法"
            required
          ></textarea>
        </div>
        <div class="form-group file-upload-group">
          <label>上传 Markdown 文件</label>
          <input
            type="file"
            accept=".md,text/markdown"
            class="file-btn"
            @change="handleFileUpload"
          />
        </div>
        <div class="form-group">
          <label>文章标题</label>
          <input
            v-model="articleName"
            type="text"
            placeholder="请输入文章标题"
            required
          />
        </div>
        <div class="form-group">
          <label>文章分类</label>
          <div class="category-hint" :class="{ error: categoryHintError }" v-if="!selectedArticleCategory">请选择一个分类</div>
          <div class="category-cards">
            <button
              type="button"
              class="category-card"
              v-for="cat in articleCategoryList"
              :key="cat.articleCategory || cat"
              :class="{ selected: (selectedArticleCategory === (cat.articleCategory || cat)) }"
              @click="selectCategory(cat)">
              {{ typeof cat === 'string' ? cat : cat.articleCategory }}
            </button>
          </div>  
        </div>
        <button type="submit" class="article-submit">提交文章</button>
      </form>
    </div>
    <div class="article-preview-section">
      <h2>预览文章</h2>
      <div class="markdown-preview">
        <div class="desc-markdown" v-html="renderedMarkdown"></div>
      </div>
    </div>
  </div>
  <ConfirmModal
    :visible="showSuccessModal"
    :title="modalTitle"
    :content="modalContent"
    :showCancel="false"
    :showConfirm="true"
    confirmText="确定"
    @confirm="onSuccessConfirm"
    @update:visible="(v) => showSuccessModal = v"
  />
</template>

<script setup>
// 基础依赖与工具
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import { renderMarkdown } from "../tools/markdown.js";
import { SERVER_IP } from "../tools/ip.js";
import "../tools/markdown.css";
import ConfirmModal from "../components/ConfirmModal.vue";

// 表单状态：标题、内容、分类列表、当前选中分类、分类提示错误
const articleName = ref("");
const articleText = ref("");
const articleCategoryList = ref([]);
const selectedArticleCategory = ref("");
const categoryHintError = ref(false);

// 成功弹窗相关状态
const showSuccessModal = ref(false);
const modalTitle = ref("提交文章");
const modalContent = ref("");

// Markdown 渲染（右侧预览）
const renderedMarkdown = computed(() =>
  renderMarkdown(articleText.value || "", ".desc-markdown pre code")
);

// 获取文章分类列表
async function fetchArticleCategoryList() {
  try {
    const res = await axios.get(
      `${SERVER_IP}article/getArticleCategory`
    );
    articleCategoryList.value = Array.isArray(res.data)
      ? res.data
      : res.data.data || [];
  } catch (e) {
    articleCategoryList.value = [];
  }
}

// 选择分类
function selectCategory(cat) {
  selectedArticleCategory.value = typeof cat === "string" ? cat : (cat.articleCategory || "");
  if (selectedArticleCategory.value) {
    categoryHintError.value = false;
  }
}


// 提交文章
async function submitArticle() {
  if (
    !articleName.value.trim() ||
    !articleText.value.trim() ||
    !selectedArticleCategory.value
  )
  {
    if (!selectedArticleCategory.value) {
      categoryHintError.value = true;
    }
    return;
  }
  try {
    await axios.post(`${SERVER_IP}article/addArticle`, {
      articleName: articleName.value,
      articleContent: articleText.value,
      articleCategory: selectedArticleCategory.value,
    });
    const name = articleName.value.trim();
    const category = selectedArticleCategory.value;
    modalTitle.value = "提交文章";
    modalContent.value = `提交 ${category} 目录下的 ${name} 文章成功`;
    showSuccessModal.value = true;
    articleName.value = "";
    articleText.value = "";
    selectedArticleCategory.value = "";
    categoryHintError.value = false;
  } catch (e) {
    alert("提交失败");
  }
}

// 处理本地 Markdown 文件上传
function handleFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (evt) => {
    articleText.value = evt.target.result;
  };
  reader.readAsText(file, "utf-8");
}

// 生命周期：进入页面拉取分类数据
onMounted(() => {
  fetchArticleCategoryList();
});

// 成功弹窗的确定回调（关闭弹窗）
function onSuccessConfirm() {
  showSuccessModal.value = false;
}
</script>

<style scoped>
.add-article-page-flex {
  display: flex;
  width: 100%;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 10px;
}
.article-section {
  width: 50%;
  padding: 30px;
  box-sizing: border-box;
  border: 1px solid #ebeef5;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 600px;
}
.article-preview-section {
  width: 50%;
  padding: 30px;
  box-sizing: border-box;
  border: 1px solid #ebeef5;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 600px;
}
.article-section h2,
.article-preview-section h2 {
  text-align: center;
  font-size: 20px;
  font-weight: 700;
}
.article-form{
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.form-group label{
  font-size: 15px;
  font-weight: 500;
}

input[type="text"],
textarea {
  padding: 10px;
  border: 1px solid #dcdfe6;
  background-color: #fff !important;
  font-size: 15px;
  background: #f5f7fa;
  outline: none;
  transition: all 0.2s;
  box-sizing: border-box;
  width: 100%;
  min-height: 40px;
}

textarea{
  resize:none;
  height:500px !important;
}

input[type="text"]:focus,
textarea:focus {
  border-color: #409eff;
  background: #fff;
}

.article-submit{
  padding: 10px;
  background: #409eff;
  color: #fff;
  border: none;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  min-height: 40px;
}
.article-submit:hover{
  background: #408eff;
}

.markdown-preview {
  padding: 10px;
  border: 1px solid #ebeef5;
  height: 500px;
  overflow: scroll;
}

/* 分类卡片选择样式 */
.category-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.category-card {
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #dcdfe6;
  cursor: pointer;
  transition: all 0.15s ease;
  background-color: #fff;
}
.category-card:hover {
  border-color: #409eff;
  color: #409eff;
}
.category-card.selected {
  background: #409eff;
  color: #fff;
}
.category-hint {
  color: #909399;
  font-size: 15px;
}

.category-hint.error {
  color: #ff4d4f;
  font-weight: 700;
}

</style>
