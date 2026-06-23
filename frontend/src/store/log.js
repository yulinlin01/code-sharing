import { defineStore } from "pinia";
import { ref } from "vue";

export const useLogStore = defineStore("log", () => {
  const articleLog = ref([]);
  const questionLog = ref([]);
  const questionSaveLog = ref([]);

  function setArticleLog(data) {
    articleLog.value = data;
  }

  function setQuestionLog(data) {
    questionLog.value = data;
  }

  return {
    articleLog,
    questionLog,
    setArticleLog,
    setQuestionLog,
  };
}, {
  persist: true
}); 