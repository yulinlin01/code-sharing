/**
 * 题库管理路由模块
 * 提供题目分类和题目的增删改查功能
 * 包含一级分类、二级分类和题目的完整管理
 */

const express = require("express");
const router = express.Router();
const Category = require("../models/category");
const Question = require("../models/question");
const UserQuestionLog = require("../models/userQuestionLogs");

/**
 * 添加一级分类接口
 * @route POST /addFirstCategory
 * @description 创建新的一级分类，children数组初始为空
 * @param {string} firstCategory - 一级分类名称
 * @returns {Object} 成功返回分类信息，失败返回错误信息
 * @example
 * POST /addFirstCategory
 * Body: { "firstCategory": "编程语言" }
 */
router.post("/addFirstCategory", async (req, res) => {
  try {
    const { firstCategory } = req.body;
    
    // 参数验证：检查是否提供了一级分类名称
    if (!firstCategory) {
      return res.status(400).json({ message: "缺少firstCategory参数" });
    }

    // 检查一级分类是否已存在，避免重复创建
    const existingCategory = await Category.findOne({ firstCategory });
    if (existingCategory) {
      return res.status(400).json({ message: "该一级分类已存在" });
    }

    // 创建新的一级分类，children数组初始为空
    const category = new Category({
      firstCategory,
      children: [],
    });
    await category.save();
    
    return res.json({ 
      message: "添加一级分类成功", 
      data: category 
    });
  } catch (err) {
    res.status(500).json({ message: "添加一级分类失败", error: err.message });
  }
});

/**
 * 添加二级分类接口
 * @route POST /addSecondCategory
 * @description 在指定的一级分类下添加二级分类
 * @param {string} firstCategory - 一级分类名称
 * @param {string} secondCategory - 二级分类名称
 * @returns {Object} 成功返回更新后的分类信息，失败返回错误信息
 * @example
 * POST /addSecondCategory
 * Body: { "firstCategory": "编程语言", "secondCategory": "JavaScript" }
 */
router.post("/addSecondCategory", async (req, res) => {
  try {
    const { firstCategory, secondCategory } = req.body;
    console.log(firstCategory)
    
    // 参数验证：检查是否提供了必要参数
    if (!firstCategory || !secondCategory) {
      return res.status(400).json({ message: "缺少firstCategory或secondCategory参数" });
    }

    // 查找指定的一级分类
    const category = await Category.findOne({ firstCategory });
    if (!category) {
      return res.status(404).json({ message: "一级分类不存在" });
    }

    // 检查二级分类是否已存在，避免重复添加
    const exists = category.children.some(
      (child) => child.secondCategory === secondCategory
    );
    if (exists) {
      return res.status(400).json({ message: "该二级分类已存在" });
    }

    // 将二级分类添加到一级分类的children数组中
    category.children.push({ secondCategory });
    await category.save();
    
    return res.json({ 
      message: "添加二级分类成功", 
      data: category 
    });
  } catch (err) {
    res.status(500).json({ message: "添加二级分类失败", error: err.message });
  }
});

/**
 * 获取所有分类接口
 * @route GET /getCateGory
 * @description 获取所有一级分类及其下的二级分类
 * @returns {Object} 成功返回所有分类数据，失败返回错误信息
 * @example
 * GET /getCateGory
 */
router.get("/getCateGory", async (req, res) => {
  try {
    // 查询所有分类数据
    const categories = await Category.find();
    res.json({ message: "获取分类成功", data: categories });
  } catch (err) {
    res.status(500).json({ message: "获取分类失败", error: err.message });
  }
});

/**
 * 删除分类接口
 * @route DELETE /deleteSecondCategory
 * @description 删除分类，支持两种模式：
 * 1. 仅提供firstCategoryId：删除整个一级分类
 * 2. 提供firstCategoryId和secondCategoryId：删除指定二级分类（需先删除该分类下的所有题目）
 * @param {string} firstCategoryId - 一级分类ID（必需）
 * @param {string} secondCategoryId - 二级分类ID（可选）
 * @returns {Object} 成功返回删除结果，失败返回错误信息
 * @example
 * DELETE /deleteSecondCategory
 * Body: { "firstCategoryId": "123", "secondCategoryId": "456" }
 */
router.delete("/deleteSecondCategory", async (req, res) => {
  try {
    const { firstCategoryId, secondCategoryId } = req.body;
    console.log(firstCategoryId, secondCategoryId)
    
    // 参数验证：firstCategoryId是必需的
    if (!firstCategoryId) {
      return res
        .status(400)
        .json({ message: "缺少firstCategoryId" });
    }

    // 模式1：仅有firstCategoryId时，直接删除该一级分类在category集合中的数据
    if (firstCategoryId && !secondCategoryId) {
      const parentCategory = await Category.findById(firstCategoryId);
      if (!parentCategory) {
        return res.status(404).json({ message: "一级分类不存在" });
      }
      await Category.findByIdAndDelete(firstCategoryId);
      return res.json({ message: `删除一级分类${parentCategory.firstCategory}成功` });
    }

    // 模式2：同时提供firstCategoryId与secondCategoryId时，按原逻辑校验后删除二级分类
    if (!secondCategoryId) {
      return res
        .status(400)
        .json({ message: "缺少secondCategoryId" });
    }

    // 查找一级分类
    const parentCategory = await Category.findById(firstCategoryId);
    if (!parentCategory) {
      return res.status(404).json({ message: "一级分类不存在" });
    }

    // 查找对应的二级分类
    const child = parentCategory.children.find(
      (c) => String(c._id) === String(secondCategoryId)
    );
    if (!child) {
      return res.status(404).json({ message: "二级分类不存在" });
    }

    const firstCategoryName = parentCategory.firstCategory;
    const secondCategoryName = child.secondCategory;

    // 统计该一级+二级分类下的题目数量，确保没有题目才能删除
    const questionCount = await Question.countDocuments({
      firstCategory: firstCategoryName,
      secondCategory: secondCategoryName,
    });

    if (questionCount > 0) {
      return res.status(400).json({
        message:
          `该${firstCategoryName}下的${secondCategoryName}中有题目，不能直接删除，请先删除${secondCategoryName}分类下的所有题目`,
      });
    }

    // 无题目，允许删除该二级分类（不删除一级分类）
    parentCategory.children = parentCategory.children.filter(
      (c) => String(c._id) !== String(secondCategoryId)
    );
    await parentCategory.save();

    return res.json({ message: `删除二级分类${secondCategoryName}成功`, data: parentCategory });
  } catch (err) {
    res.status(500).json({ message: "删除二级分类失败", error: err.message });
  }
});



/**
 * 添加题目接口
 * @route POST /addQuestion
 * @description 创建新的题目，自动生成questionId
 * @param {string} questionName - 题目名称
 * @param {string} questionContent - 题目内容
 * @param {string} firstCategory - 一级分类名称
 * @param {string} secondCategory - 二级分类名称
 * @param {string} answer - 答案
 * @param {string} analysis - 解析
 * @returns {Object} 成功返回题目信息，失败返回错误信息
 * @example
 * POST /addQuestion
 * Body: { "questionName": "JavaScript基础", "questionContent": "什么是闭包？", ... }
 */
router.post("/addQuestion", async (req, res) => {
  try {
    const {
      questionName,
      questionContent,
      firstCategory,
      secondCategory,
      answer,
      analysis,
    } = req.body;
    
    // 查询当前最大questionId，为新题目分配唯一ID
    const lastQuestion = await Question.findOne().sort({ questionId: -1 });
    const questionId = lastQuestion ? lastQuestion.questionId + 1 : 1;
    
    // 创建新题目实例
    const question = new Question({
      questionName,
      questionContent,
      firstCategory,
      secondCategory,
      answer,
      analysis,
      count: 0, // 初始访问次数为0
      questionId,
    });
    await question.save();
    res.json({ message: "添加题目成功", data: question });
  } catch (err) {
    res.status(500).json({ message: "添加题目失败", error: err.message });
  }
});

/**
 * 获取所有题目接口
 * @route GET /getQuestion
 * @description 获取所有题目数据
 * @returns {Object} 成功返回所有题目数据，失败返回错误信息
 * @example
 * GET /getQuestion
 */
router.get("/getQuestion", async (req, res) => {
  try {
    // 查询所有题目数据
    const questions = await Question.find();
    res.json({ message: "获取题目成功", data: questions });
  } catch (err) {
    res.status(500).json({ message: "获取题目失败", error: err.message });
  }
});

/**
 * 删除题目接口
 * @route DELETE /deleteQuestion
 * @description 删除指定题目，同时清理相关的用户题目日志
 * @param {string} id - 题目ID
 * @returns {Object} 成功返回删除结果和清理的日志数量，失败返回错误信息
 * @example
 * DELETE /deleteQuestion
 * Body: { "id": "123" }
 */
router.delete("/deleteQuestion", async (req, res) => {
  try {
    const { id } = req.body;

    // 参数验证：检查是否提供了题目ID
    if (!id) {
      return res.status(400).json({ message: "缺少题目id" });
    }

    // 删除题目
    const deletedQuestion = await Question.findByIdAndDelete(id);
    if (!deletedQuestion) {
      return res.status(404).json({ message: "题目不存在" });
    }

    // 清理该题目相关的用户题目日志
    const logsResult = await UserQuestionLog.deleteMany({ questionId: id });

    res.json({
      message: "删除题目成功，并清理相关用户题目日志",
      data: deletedQuestion,
      logsDeleted: logsResult?.deletedCount || 0,
    });
  } catch (err) {
    res.status(500).json({ message: "删除题目失败", error: err.message });
  }
});

module.exports = router;
