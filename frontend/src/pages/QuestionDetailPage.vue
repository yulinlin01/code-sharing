<template>
  <div class="question-detail-page">
    <Bg></Bg>
    <div class="question-detail-container">
      <div v-if="question">
        <h1 class="question-title">{{ question.questionName }}</h1>
        <span class="time">创建时间：{{ question.questionCreateTime }}</span>
        <span class="count">观看数：{{ question.count }}</span>
        <div class="desc-markdown" v-html="renderQuestionMarkdown(question.questionContent)"></div>
        <div class="question-answer" @click="showAnswer = !showAnswer" style="cursor: pointer; user-select: none">
          <span class="label">{{ showAnswer ? "答案：" : "获取答案" }}</span>
          <div v-if="showAnswer" class="desc-markdown" v-html="renderAnswerMarkdown(question.answer)"></div>
        </div>
        <div class="question-analysis" @click="showAnalysis = !showAnalysis" style="cursor: pointer; user-select: none">
          <span class="label">{{ showAnalysis ? "解析：" : "获取解析" }}</span>
          <div v-if="showAnalysis" class="desc-markdown" v-html="renderAnswerMarkdown(question.analysis)"></div>
        </div>
      </div>
      <div v-else>
        <div class="desc">未找到该题目</div>
      </div>
      <div v-if="showLogMessage" class="log-message">
        {{ logMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
import Bg from '../components/Bg.vue'
import { useRoute } from "vue-router";
import { useQuestionStore } from "../store/question";
import { computed, nextTick, ref, onMounted, onUnmounted, watch } from "vue";
import { renderQuestionMarkdown, renderAnswerMarkdown, highlightCode } from "../tools/markdown.js";
import "../tools/markdown.css";
import { SERVER_URL } from "../tools/ip.js";
const route = useRoute();
const questionStore = useQuestionStore();
const questionId = route.params.id;
const question = computed(() =>
  questionStore.questions.find((q) => q._id === questionId)
);
const showAnswer = ref(false);
const showAnalysis = ref(false);
// 监听题目数据变化，确保题目内容代码高亮
watch(question, () => {
  if (question.value) {
    nextTick(() => {
      highlightCode(".desc-markdown pre code");
    });
  }
}, { immediate: true });
// 监听答案和分析的显示状态，确保代码高亮
watch(showAnswer, () => {
  if (showAnswer.value) {
    nextTick(() => {
      highlightCode(".desc-markdown pre code");
    });
  }
});
watch(showAnalysis, () => {
  if (showAnalysis.value) {
    nextTick(() => {
      highlightCode(".desc-markdown pre code");
    });
  }
});
function showLogWithTimeout(msg) {
  logMessage.value = msg;
  showLogMessage.value = true;
  setTimeout(() => {
    showLogMessage.value = false;
  }, 2000);
}


const showLogMessage = ref(false);
const logMessage = ref("");
let logTimer = null;


// 发送浏览记录到服务器
async function sendQuestionLog() {
  try {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.log("用户未登录，跳过浏览记录");
      return;
    }
    const response = await fetch(`${SERVER_URL}admin/question-log`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        questionId: questionId,
        username: localStorage.getItem("username"),
      }),
    });
    const data = await response.json();
    if (response.ok) {
      showLogWithTimeout(data.message || "浏览记录已保存");
    } else {
      console.error("保存浏览记录失败:", data.message);
    }
  } catch (error) {
    console.error("发送浏览记录请求失败:", error);
  }
}

onMounted(() => {
  logTimer = setTimeout(() => {
    sendQuestionLog();
  }, 3000);
});

onUnmounted(() => {
  if (logTimer) {
    clearTimeout(logTimer);
  }
});
</script>

<style scoped>
.question-detail-page {
  min-height: 100vh;
  padding: 100px 100px;
  width: 100vw;
}

.question-detail-container {
  max-width: 1200px;
  margin: 0 auto;
}

.question-title {
  font-size: 30px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 18px;
}

.time {
  font-size: 15px;
  color: #fff;
  padding: 10px;
  background: linear-gradient(135deg, rgba(16,185,129,0.3), rgba(59,130,246,0.3));
  border-radius: 10px;
margin-right: 10px;
}
.count {
  font-size: 15px;
  color: #fff;
  padding: 10px;
  background: linear-gradient(135deg, rgba(29,78,216,0.3), rgba(236,72,153,0.3));
  border-radius: 10px;
}
.desc {
  font-size: 16px;
  color: #444;
}

.question-answer {
  font-size: 15px;
  color: #1a7f37;
  margin-bottom: 8px;
}

.question-analysis {
  font-size: 15px;
  color: #2d5af1;
  margin-bottom: 12px;
}

.label {
  font-weight: 600;
  color: #fff;
  margin-right: 4px;
}

.log-message {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(135deg, rgba(16,185,129,0.9), rgba(59,130,246,0.9));
  backdrop-filter: blur(10px);
  color: white;
  padding: 16px 24px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  z-index: 1001;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: fadeInScale 0.4s ease-out;
  min-width: 200px;
  text-align: center;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.7);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}
</style>
