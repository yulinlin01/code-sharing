import { defineStore } from "pinia";
import { ref } from "vue";

export const useArticleStore = defineStore("article", () => {
  const articles = ref([]);
  const filterArticle = ref([]);

  function setArticles(data) {
    articles.value = data;
    filterArticle.value = data;
  }

  function setFilterArticle(data) {
    filterArticle.value = data;
  }

  function getArticleById(id) {
    return articles.value.find((a) => a._id === id);
  }

  return {
    articles,
    filterArticle,
    setArticles,
    setFilterArticle,
    getArticleById,
  };
}, {
  persist: true
});
