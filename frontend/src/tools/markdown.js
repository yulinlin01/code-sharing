import { marked } from "marked";
import hljs from "highlight.js";
import "highlight.js/styles/tokyo-night-dark.css";

// 配置marked选项
marked.setOptions({
  highlight: function (code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
    return hljs.highlightAuto(code).value;
  },
});

/**
 * 渲染markdown内容为HTML
 * @param {string} content - markdown内容
 * @param {string} selector - CSS选择器，用于高亮代码块
 * @returns {string} 渲染后的HTML
 */
export function renderMarkdown(content, selector = ".markdown-content pre code") {
  const html = marked.parse(content || "");
  
  // 使用setTimeout确保DOM完全更新后再应用高亮
  setTimeout(() => {
    document.querySelectorAll(selector).forEach((el) => {
      if (!el.dataset.highlighted) {
        el.classList.add("hljs");
        hljs.highlightElement(el);
        el.dataset.highlighted = "yes";
      }
    });
  }, 0);
  
  return html;
}

/**
 * 渲染文章内容的markdown
 * @param {string} content - 文章内容
 * @returns {string} 渲染后的HTML
 */
export function renderArticleMarkdown(content) {
  return renderMarkdown(content);
}

/**
 * 渲染题目内容的markdown
 * @param {string} content - 题目内容
 * @returns {string} 渲染后的HTML
 */
export function renderQuestionMarkdown(content) {
  return renderMarkdown(content, ".desc-markdown pre code");
}

/**
 * 渲染答案和分析的markdown
 * @param {string} content - 答案或分析内容
 * @returns {string} 渲染后的HTML
 */
export function renderAnswerMarkdown(content) {
  return renderMarkdown(content, ".desc-markdown pre code");
}

/**
 * 手动触发代码高亮
 * @param {string} selector - CSS选择器
 */
export function highlightCode(selector = ".markdown-content pre code") {
  document.querySelectorAll(selector).forEach((el) => {
    if (!el.dataset.highlighted) {
      el.classList.add("hljs");
      hljs.highlightElement(el);
      el.dataset.highlighted = "yes";
    }
  });
}
