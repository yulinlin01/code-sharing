const express = require("express");
const router = express.Router();
const Article = require("../models/article");
const Question = require("../models/question");
const Category = require("../models/cateGory");
const Links = require("../models/links");
const ArticleCateGory = require("../models/articleCategory");
// 获取所有文章
router.get("/getArticle", async (req, res) => {
  try {
    const articles = await Article.find();
    res.json({ success: true, data: articles });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "获取文章失败", error: err.message });
  }
});

// 获取所有文章分类
router.get("/getArticleCategory", async (req, res) => {
  try {
    const articleCategories = await ArticleCateGory.find();
    res.json({ success: true, data: articleCategories });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "获取文章分类失败",
      error: err.message,
    });
  }
});

// 获取所有题目
router.get("/getQuestion", async (req, res) => {
  try {
    const questions = await Question.find();
    res.json({ success: true, data: questions });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "获取题目失败", error: err.message });
  }
});

// 获取所有题库分类
router.get("/getCateGory", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({ success: true, data: categories });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "获取分类失败", error: err.message });
  }
});

// 获取所有友链
router.get("/getLinks", async (req, res) => {
  try {
    const links = await Links.find();
    res.json({ success: true, data: links });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "获取友链失败", error: err.message });
  }
});

module.exports = router;
