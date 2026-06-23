/**
 * 链接管理路由模块
 * 提供工具链接的增删改查功能
 * 用于管理各种有用的工具和资源链接
 */

const express = require("express");
const router = express.Router();
const Links = require("../models/links");

/**
 * 添加链接接口
 * @route POST /addLinks
 * @description 创建新的工具链接
 * @param {string} linksName - 链接名称
 * @param {string} linksContent - 链接地址
 * @param {string} linksFunction - 链接功能描述
 * @returns {Object} 成功返回链接信息，失败返回错误信息
 * @example
 * POST /addLinks
 * Body: { "linksName": "GitHub", "linksContent": "https://github.com", "linksFunction": "代码托管" }
 */
router.post("/addLinks", async (req, res) => {
  console.log("添加链接操作");
  try {
    const { linksName, linksContent, linksFunction } = req.body;
    
    // 创建新链接实例
    const link = new Links({ linksName, linksContent, linksFunction });
    await link.save();
    res.json({ message: "添加链接成功", data: link });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "添加链接失败", error: err.message });
  }
});

/**
 * 获取所有链接接口
 * @route GET /getLinks
 * @description 获取所有工具链接数据
 * @returns {Object} 成功返回所有链接数据，失败返回错误信息
 * @example
 * GET /getLinks
 */
router.get("/getLinks", async (req, res) => {
  try {
    // 查询所有链接数据
    const links = await Links.find();
    res.json({ message: "获取链接成功", data: links });
  } catch (err) {
    res.status(500).json({ message: "获取链接失败", error: err.message });
  }
});

/**
 * 删除链接接口
 * @route DELETE /deleteLinks/:id
 * @description 删除指定链接
 * @param {string} id - 链接ID（URL参数）
 * @returns {Object} 成功返回删除结果，失败返回错误信息
 * @example
 * DELETE /deleteLinks/123
 */
router.delete("/deleteLinks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // 删除指定ID的链接
    const deleted = await Links.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "链接不存在" });
    }
    res.json({ message: "删除链接成功", data: deleted });
  } catch (err) {
    res.status(500).json({ message: "删除链接失败", error: err.message });
  }
});

module.exports = router;
