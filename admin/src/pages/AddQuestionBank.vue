<template>
  <div class="question-bank-layout">

    <div class="question-section">
      <!-- 添加题目功能区 -->
      <h2>添加题库题目</h2>
      <form class="question-form" @submit.prevent="openAddModal">
        <div class="form-group">
          <textarea v-model="questionText" rows="8" placeholder="请输入题目内容，支持 Markdown 语法" required></textarea>
        </div>
        <div class="form-group">
          <textarea v-model="questionAnswer" rows="4" placeholder="请输入题目答案，支持 Markdown 语法" required></textarea>
        </div>
        <div class="form-group">
          <textarea v-model="questionSolution" rows="4" placeholder="请输入题目解析，支持 Markdown 语法" required></textarea>
        </div>
        <div class="form-group">
          <input v-model="questionName" type="text" placeholder="请输入题目标题" required />
        </div>
        <div class="form-group">
          <div class="category-cards">
            <button
              type="button"
              class="category-card"
              v-for="cat in firstCategories"
              :key="cat.firstCategory"
              :class="{ selected: selectedPrimaryCategoryForQuestion === cat.firstCategory }"
              @click="() => { selectedPrimaryCategoryForQuestion = cat.firstCategory; onPrimaryCategoryChange(); }"
            >
              {{ cat.firstCategory }}
            </button>
          </div>
        </div>
        <div class="form-group">
          <div class="category-cards">
            <button
              type="button"
              class="category-card"
              v-for="child in (firstCategories.find(c => c.firstCategory === selectedPrimaryCategoryForQuestion)?.children || [])"
              :key="child.secondCategory"
              :class="{ selected: selectedSecondaryCategoryForQuestion === child.secondCategory }"
              @click="() => { selectedSecondaryCategoryForQuestion = child.secondCategory }"
            >
              {{ child.secondCategory }}
            </button>
          </div>
        </div>
        <button type="submit">提交题目</button>
      </form>
    </div>
    <div class="preview-section">
      <h2>题目预览</h2>
      <div class="preview">
        <div class="markdown-preview">
          <div class="preview-content question-content" v-html="questionText.trim() ? renderedMarkdown : ''"></div>
        </div>
        <div class="markdown-preview">
          <div class="preview-content answer-markdown"
            v-html="questionAnswer && questionAnswer.trim() ? renderedAnswer : ''"></div>
        </div>
        <div class="markdown-preview">
          <div class="preview-content analysis-markdown" v-html="questionSolution && questionSolution.trim() ? renderedSolution : ''
            "></div>
        </div>
      </div>
    </div>
  </div>
  <ConfirmModal
    :visible="addVisible"
    :title="addTitle"
    :content="addContent"
    :showCancel="true"
    :showConfirm="true"
    cancelText="取消"
    confirmText="确定"
    @cancel="onAddCancel"
    @confirm="onAddConfirm"
    @update:visible="(v) => addVisible = v"
  />
</template>

<script setup>
/**
 * 添加题库题目页面 - AddQuestionBank.vue
 * 
 * 功能说明：
 * - 提供题库题目的添加功能
 * - 支持Markdown格式的题目内容、答案和解析
 * - 实时预览Markdown渲染效果
 * - 支持一级和二级分类选择
 * - 使用确认弹窗进行提交操作
 * 
 * 主要功能：
 * 1. 题目信息输入：标题、内容、答案、解析
 * 2. 分类选择：一级分类和二级分类的联动选择
 * 3. 实时预览：Markdown内容的实时渲染预览
 * 4. 题目提交：通过确认弹窗提交到服务器
 * 5. 表单重置：提交后清空所有输入内容
 * 
 * 技术特点：
 * - 使用Markdown渲染器支持富文本内容
 * - 分类选择采用卡片式交互设计
 * - 实时预览提供良好的用户体验
 * - 表单验证确保数据完整性
 */

// ==================== 依赖导入 ====================

// 导入必要的依赖
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import { renderMarkdown } from "../tools/markdown.js";
import { SERVER_IP } from "../tools/ip.js";
import "../tools/markdown.css";
import ConfirmModal from "../components/ConfirmModal.vue";

// ==================== 响应式数据定义 ====================

/**
 * 分类与表单状态
 * 管理题目添加相关的所有状态数据
 */

/**
 * 分类数据
 * 存储从服务器获取的题库分类结构（包含一级分类和二级分类）
 * 数据结构：{ firstCategory: string, children: { secondCategory: string }[] }[]
 */
const firstCategories = ref([]);

/**
 * 选中的分类信息
 * 用于题目提交时的分类关联
 */
const selectedPrimaryCategoryForQuestion = ref(""); // 当前选中的一级分类名称
const selectedSecondaryCategoryForQuestion = ref(""); // 当前选中的二级分类名称

/**
 * 题目表单数据
 * 存储用户在表单中输入的所有题目信息
 */
const questionName = ref(""); // 题目标题
const questionText = ref(""); // 题目内容（Markdown格式）
const questionAnswer = ref(""); // 题目答案（Markdown格式）
const questionSolution = ref(""); // 题目解析（Markdown格式）

/**
 * 本地题目列表
 * 存储新提交的题目列表，可用于本地展示或回显
 */
const questions = ref([]);

// ==================== 计算属性 ====================

/**
 * Markdown 预览内容
 * 将用户输入的Markdown内容实时渲染为HTML，供预览区域展示
 */

/**
 * 题目内容预览
 * 将题目内容（questionText）渲染为HTML，供预览区域展示
 */
const renderedMarkdown = computed(() =>
  renderMarkdown(questionText.value || "", ".question-content pre code")
);

/**
 * 题目答案预览
 * 将题目答案（questionAnswer）渲染为HTML，供预览区域展示
 */
const renderedAnswer = computed(() =>
  renderMarkdown(questionAnswer.value || "", ".answer-markdown pre code")
);

/**
 * 题目解析预览
 * 将题目解析（questionSolution）渲染为HTML，供预览区域展示
 */
const renderedSolution = computed(() =>
  renderMarkdown(questionSolution.value || "", ".analysis-markdown pre code")
);

// ==================== 数据获取函数 ====================

/**
 * 获取分类列表
 * 从服务器获取题库分类数据（包含一级分类和二级分类的嵌套结构）
 */
async function fetchCategories() {
  try {
    const res = await axios.get(
      `${SERVER_IP}questionBank/getCateGory`
    );
    // 兼容 { data: [...] } 或直接返回数组两种结构
    firstCategories.value = Array.isArray(res.data)
      ? res.data
      : res.data.data || [];
  } catch (e) {
    // 请求失败时设置为空数组，避免渲染错误
    firstCategories.value = [];
  }
}

// ==================== 分类选择处理 ====================

/**
 * 处理一级分类选择变化
 * 当用户选择一级分类时，清空二级分类的选择状态
 */
function onPrimaryCategoryChange() {
  selectedSecondaryCategoryForQuestion.value = "";
}

// 提交新增题目
async function addQuestion() {
  // 提交前校验：一级分类、二级分类、标题、题目内容均为必填
  if (
    !selectedPrimaryCategoryForQuestion.value ||
    !selectedSecondaryCategoryForQuestion.value ||
    !questionName.value.trim() ||
    !questionText.value.trim() ||
    !questionAnswer.value.trim() ||
    !questionSolution.value.trim() 
  ){
    return;
  }
   
  try {
    // 调用后端新增题目接口
    await axios.post(`${SERVER_IP}questionBank/addQuestion`, {
      questionName: questionName.value,
      questionContent: questionText.value,
      firstCategory: selectedPrimaryCategoryForQuestion.value,
      secondCategory: selectedSecondaryCategoryForQuestion.value,
      answer: questionAnswer.value,
      analysis: questionSolution.value,
    });
    // 将提交成功的题目同步到本地列表（可选）
    questions.value.push({
      id: Date.now(),
      firstCategory: selectedPrimaryCategoryForQuestion.value,
      secondCategory: selectedSecondaryCategoryForQuestion.value,
      questionName: questionName.value,
      questionContent: questionText.value,
      answer: questionAnswer.value,
      analysis: questionSolution.value,
    });
    // 重置表单与分类选择
    questionName.value = "";
    questionText.value = "";
    questionAnswer.value = "";
    questionSolution.value = "";
    selectedPrimaryCategoryForQuestion.value = "";
    selectedSecondaryCategoryForQuestion.value = "";
  } catch (e) {
    console.log("添加题目失败");
  }
}

// 页面挂载后加载分类
onMounted(() => {
  fetchCategories();
});

// 添加题目确认弹窗状态
const addVisible = ref(false);
const addTitle = ref("添加题目");
const addContent = ref("");

function openAddModal() {
  // 提交前校验，确保信息完整再弹窗
  if (
    !selectedPrimaryCategoryForQuestion.value ||
    !selectedSecondaryCategoryForQuestion.value ||
    !questionName.value.trim() ||
    !questionText.value.trim() ||
    !questionAnswer.value.trim() ||
    !questionSolution.value.trim()
  ) {
    return;
  }
  const first = selectedPrimaryCategoryForQuestion.value;
  const second = selectedSecondaryCategoryForQuestion.value;
  const name = questionName.value.trim();
  addTitle.value = "添加题目";
  addContent.value = `你确定要添加 ${first} 下的 ${second} 分类的 ${name} 题目吗？`;
  addVisible.value = true;
}

function onAddCancel() {
  addVisible.value = false;
}

async function onAddConfirm() {
  try {
    await addQuestion();
  } finally {
    addVisible.value = false;
  }
}
</script>

<style scoped>
.question-bank-layout {
  display: flex;
  width: 100%;
  gap: 10px;
}

.question-section {
  width: 50%;
  padding: 30px;
  box-sizing: border-box;
  border: 1px solid #ebeef5;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.preview-section {
  width: 50%;
  padding: 30px;
  box-sizing: border-box;
  border: 1px solid #ebeef5;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.question-section h2,
.preview-section h2 {
  font-size: 20px;
  font-weight: 700;
}

.question-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.preview {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-group {
  width: 100%;
  border: 1px solid #ebeef5;
  font-size: 15px;
  box-sizing: border-box;
  display: flex;
}

.markdown-preview {
  width: 100%;
  overflow-y: scroll;
  border: 1px solid #ebeef5;
  font-size: 15px;
  box-sizing: border-box;
}

textarea {
  height: 200px;
  width: 100%;
  resize: none;
  outline: none;
  border: 0px;
  padding: 10px;
  box-sizing: border-box;
}

.preview-content {
  height: 200px;
  width: 100% !important;
  white-space: normal;
  word-break: break-all;
  padding: 10px;
  box-sizing: border-box;
}

input[type="text"]{
  outline: none;
  width: 100%;
  height: 40px;
  border: none;
  padding: 10px;
  box-sizing: border-box;
}


input[type="text"]:focus,
textarea:focus {
  border-color: #409eff;
}

button[type="submit"]{
  padding: 12px 32px;
  background: #409eff;
  color: #fff;
  border: none;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s;
}

button[type="submit"]:hover{
  background: #337ecc;
}

.category-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 10px;
}

.category-card {
  padding: 5px 12px;
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
</style>
