/**
 * 文章管理路由模块
 * 提供文章和文章分类的增删改查功能
 * 包含文章内容管理和分类管理
 */

const express = require("express");
const router = express.Router();
const Article = require("../models/article");
const ArticleCategory = require("../models/articleCategory");
const UserArticleLog = require("../models/userArticleLogs");

/**
 * 添加文章接口
 * @route POST /addArticle
 * @description 创建新的文章
 * @param {string} articleName - 文章标题
 * @param {string} articleContent - 文章内容
 * @param {string} articleCategory - 文章分类
 * @returns {Object} 成功返回文章信息，失败返回错误信息
 * @example
 * POST /addArticle
 * Body: { "articleName": "JavaScript基础", "articleContent": "文章内容...", "articleCategory": "编程" }
 */
router.post("/addArticle", async (req, res) => {
  try {
    const { articleName, articleContent, articleCategory } = req.body;
    
    // 创建新文章实例
    const article = new Article({
      articleName,
      articleContent,
      articleCategory,
      count: 0, // 初始访问次数为0
    });
    await article.save();
    res.json({ message: "添加文章成功", data: article });
  } catch (err) {
    res.status(500).json({ message: "添加文章失败", error: err.message });
  }
});

/**
 * 获取所有文章接口
 * @route GET /getArticle
 * @description 获取所有文章数据
 * @returns {Object} 成功返回所有文章数据，失败返回错误信息
 * @example
 * GET /getArticle
 */
router.get("/getArticle", async (req, res) => {
  try {
    // 查询所有文章数据
    const articles = await Article.find();
    res.json({ message: "获取文章成功", data: articles });
  } catch (err) {
    res.status(500).json({ message: "获取文章失败", error: err.message });
  }
});

/**
 * 删除文章接口
 * @route DELETE /deleteArticle
 * @description 删除指定文章，同时清理相关的用户文章日志
 * @param {string} id - 文章ID
 * @returns {Object} 成功返回删除结果和清理的日志数量，失败返回错误信息
 * @example
 * DELETE /deleteArticle
 * Body: { "id": "123" }
 */
router.delete("/deleteArticle", async (req, res) => {
  try {
    const { id } = req.body;

    // 参数验证：检查是否提供了文章ID
    if (!id) {
      return res.status(400).json({ message: "缺少文章id" });
    }

    // 删除文章
    const deletedArticle = await Article.findByIdAndDelete(id);
    if (!deletedArticle) {
      return res.status(404).json({ message: "文章不存在" });
    }

    // 同步清理该文章相关的用户文章日志
    const logDeleteResult = await UserArticleLog.deleteMany({ articleId: id });

    res.json({
      message: "删除文章成功，并清理相关用户文章日志",
      data: deletedArticle,
      logsDeleted: logDeleteResult?.deletedCount || 0,
    });
  } catch (err) {
    res.status(500).json({ message: "删除文章失败", error: err.message });
  }
});

/**
 * 添加文章分类接口
 * @route POST /addArticleCategory
 * @description 创建新的文章分类
 * @param {string} articleCategory - 分类名称
 * @returns {Object} 成功返回分类信息，失败返回错误信息
 * @example
 * POST /addArticleCategory
 * Body: { "articleCategory": "技术分享" }
 */
router.post("/addArticleCategory", async (req, res) => {
  try {
    const { articleCategory } = req.body;
    
    // 创建新分类实例
    const category = new ArticleCategory({ articleCategory });
    await category.save();
    res.json({ message: "添加文章分类成功", data: category });
  } catch (err) {
    res.status(500).json({ message: "添加文章分类失败", error: err.message });
  }
});

/**
 * 获取所有文章分类接口
 * @route GET /getArticleCategory
 * @description 获取所有文章分类数据
 * @returns {Object} 成功返回所有分类数据，失败返回错误信息
 * @example
 * GET /getArticleCategory
 */
router.get("/getArticleCategory", async (req, res) => {
  try {
    // 查询所有文章分类数据
    const categories = await ArticleCategory.find();
    res.json({ message: "获取文章分类成功", data: categories });
  } catch (err) {
    res.status(500).json({ message: "获取文章分类失败", error: err.message });
  }
});

/**
 * 删除文章分类接口
 * @route DELETE /deleteArticleCategory
 * @description 删除指定文章分类，需先确保该分类下没有文章
 * @param {string} id - 分类ID
 * @returns {Object} 成功返回删除结果，失败返回错误信息
 * @example
 * DELETE /deleteArticleCategory
 * Body: { "id": "123" }
 */
router.delete("/deleteArticleCategory", async (req, res) => {
  try {
    const { id } = req.body;

    // 参数验证：检查是否提供了分类ID
    if (!id) {
      return res.status(400).json({ message: "缺少分类id" });
    }

    // 根据分类ID找到该分类以获取分类名称
    const category = await ArticleCategory.findById(id);
    if (!category) {
      return res.status(404).json({ message: "分类不存在" });
    }

    const categoryName = category.articleCategory;

    // 检查该分类下是否仍有文章，确保没有文章才能删除分类
    const articleCount = await Article.countDocuments({ articleCategory: categoryName });
    if (articleCount > 0) {
      return res.status(400).json({
        message:
          `当前分类 \"${categoryName}\" 下仍有 ${articleCount} 篇文章，不允许直接删除，请先删除该分类下所有文章。`,
      });
    }

    // 没有文章，删除该分类
    await ArticleCategory.findByIdAndDelete(id);

    res.json({ message: `分类 \"${categoryName}\" 已删除成功` });
  } catch (err) {
    res.status(500).json({ message: "删除文章分类失败", error: err.message });
  }
});

module.exports = router;
