import { defineStore } from "pinia";
import { ref } from "vue";

export const useQuestionStore = defineStore("question", () => {
  const questions = ref([]);
  const categories = ref([]);
  const filteredQuestions = ref([]);

  function setQuestions(data) {
    questions.value = data;
    filteredQuestions.value = data;
  }
  function setCategories(data) {
    categories.value = data;
  }
  function setFilteredQuestions(data) {
    filteredQuestions.value = data;
  }

  return {
    questions,
    categories,
    filteredQuestions,
    setQuestions,
    setCategories,
    setFilteredQuestions,
  };
}, {
  persist: true
});
