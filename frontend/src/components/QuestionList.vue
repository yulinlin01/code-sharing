<template>
  <div class="question-list">
    <div class="page-header">
      <div class="header-top">
        <h1 class="page-title">
          {{ route.query.category ? `${route.query.category} 分类题目` : '全部题库' }}
        </h1>
      </div>
      <span class="question-count">
        共 {{ questions.length }} 道题目
      </span>
      <span class="ac">已做</span>
      <span class="noac">未做</span>
    </div>
    <div v-if="!questions || questions.length === 0" class="empty-tip">
      {{ route.query.category ? `暂无 ${route.query.category} 分类的题目` : '暂无题目数据' }}
    </div>
    <div
      v-for="item in questions"
      :key="item._id"
      class="question-item"
      @click="handleQuestionClick(item._id)"
      style="cursor: pointer"
    >
          <div class="info-id"  :style="{ backgroundColor: getQuestionStatusColor(item._id) }">
            {{ formatId(item.questionId) }}
          </div>
          <div class="info-title">
            {{ item.questionName }}
          </div>
          <div class="first-category">
            {{ item.firstCategory }}
          </div>
          <div class="second-category">
            {{ item.secondCategory }}
          </div>
    
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { computed, ref, onMounted, watch } from "vue";
import { useQuestionStore } from "../store/question";
import { useLogStore } from "../store/log";
import { SERVER_URL } from "../tools/ip.js";


const questionStore = useQuestionStore();
const logStore = useLogStore();
const route = useRoute();
const router = useRouter();

// 定义事件
const emit = defineEmits(['question-click']);

// 根据query参数筛选题目
const questions = computed(() => {
  const category = route.query.category;
  if (category) {
    return questionStore.questions.filter(q => q.secondCategory === category);
  }
  return questionStore.questions;
});

function formatId(id) {
  return String(id).padStart(5, "0");
}

// 检查用户是否已经做过该题目
function isQuestionCompleted(questionId) {
  const userId = localStorage.getItem("userId");
  if (!userId) return false;
  
  return logStore.questionLog.some(
    (item) => item.userId === userId && item.questionId === questionId
  );
}

// 获取题目状态对应的背景色
function getQuestionStatusColor(questionId) {
  return isQuestionCompleted(questionId) ? "#8df0cc" : "#f87171";
}


function handleQuestionClick(id) {
  emit('question-click', id);
  router.push({ name: "QuestionDetail", params: { id } });
}

// 获取题目数据
const fetchQuestions = async () => {
  try {
    const res = await fetch(`${SERVER_URL}getQuestion`);
    if (!res.ok) throw new Error("网络请求失败");
    const data = await res.json();
    questionStore.setQuestions(data.data);
  } catch (e) {
    console.error("获取题库失败：", e);
  }
};

// 获取分类数据
const fetchCategories = async () => {
  try {
    const res = await fetch(`${SERVER_URL}getCateGory`);
    if (!res.ok) throw new Error("获取问题分类失败");
    const data = await res.json();
    questionStore.setCategories(data.data);
  } catch (e) {
    console.error("获取问题分类失败：", e);
  }
};

onMounted(async () => {
  await fetchQuestions();
  await fetchCategories();
});

// 监听路由参数变化
watch(() => route.query.category, (newCategory) => {
  console.log('分类筛选变化:', newCategory);
});
</script>

<style scoped>
.question-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 100%;
}

.page-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.header-top {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
}

.back-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  font-size: 14px;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #8df0cc;
  margin: 0;
}

.question-count {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.7);
}

.question-item {
  height: 40px;
  width: 100%;
  border-radius: 0px;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  font-size: 16px;
  color: #fff;
  transition: all 0.2s, transform 0.2s;
  cursor: pointer;
  display: grid;
  grid-template-columns: 10% 60% 10% 10%;
  align-items: center;
  gap: 20px;
}

.question-item:hover {
  opacity: 0.8;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.13);
  transform: translateY(-3px);
}
.info-id{
  height: 80%;
  color : black;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #8df0cc;
  border-radius: 5px;
  font-weight: 600;
}
.info-title{
  color: #fff;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.first-category{
  font-size: 10px;
  border-radius: 10px;
  padding: 5px 15px;
  background: linear-gradient(135deg, rgba(29,78,216,0.3), rgba(236,72,153,0.3));
  color : white;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
}
.second-category{
  font-size: 10px;
  border-radius: 10px;
  padding: 5px 15px;
  background: linear-gradient(135deg, rgba(16,185,129,0.3), rgba(59,130,246,0.3));
  color : white;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
}

.empty-tip {
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  font-size: 16px;
  margin: 32px 0;
}

.ac{
    height: 40px;
    width: 40px;
    padding:1px 5px;
    background-color: #8df0cc;
    font-size: 10px;
    margin-right: 10px;
    border-radius: 5px;
}
.noac{
  height: 40px;
    width: 40px;
    padding:1px 5px;
    font-size: 10px;
    background-color: #f87171;
    border-radius: 5px;
}
</style>
