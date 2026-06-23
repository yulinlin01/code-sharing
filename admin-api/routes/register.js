/**
 * 用户注册管理路由模块
 * 提供用户注册审核、状态管理和用户删除功能
 * 包含注册用户信息管理和用户数据清理
 */

const express = require("express");
const router = express.Router();
const Register = require("../models/register");
const User = require("../models/user");
const UserArticleLog = require("../models/userArticleLogs");
const UserQuestionLog = require("../models/userQuestionLogs");

/**
 * 获取所有注册用户信息接口
 * @route GET /getRegisterUsers
 * @description 获取所有待审核的注册用户信息
 * @returns {Object} 成功返回所有注册用户数据，失败返回错误信息
 * @example
 * GET /getRegisterUsers
 */
router.get("/getRegisterUsers", async (req, res) => {
  try {
    // 查询所有注册用户数据
    const users = await Register.find();
    res.json({ message: "获取注册用户信息成功", data: users });
  } catch (err) {
    res
      .status(500)
      .json({ message: "获取注册用户信息失败", error: err.message });
  }
});


/**
 * 修改用户注册状态接口
 * @route PUT /updateRegisterStatus
 * @description 更新用户注册状态，审核通过时自动创建用户账户
 * @param {string} username - 用户名
 * @param {string} password - 密码
 * @param {number} registerStatus - 注册状态（1:通过，0:拒绝）
 * @returns {Object} 成功返回更新结果，失败返回错误信息
 * @example
 * PUT /updateRegisterStatus
 * Body: { "username": "test", "password": "123456", "registerStatus": 1 }
 */
router.put("/updateRegisterStatus", async (req, res) => {
  try {
    const { username, password, registerStatus } = req.body;

    // 使用 findOneAndUpdate 方法更新用户状态
    const updatedUser = await Register.findOneAndUpdate(
      { username, password },
      { registerStatus: registerStatus },
      { new: true } // 返回更新后的文档
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "用户不存在或密码错误" });
    }

    // 如果注册状态设置为1（通过），则将用户信息写入到user集合中
    if (registerStatus === 1) {
      // 检查用户是否已经存在于user集合中
      const existingUser = await User.findOne({ username });

      if (!existingUser) {
        // 创建新用户，默认数组为空
        const newUser = new User({
          username,
          password,
        });
        await newUser.save();
      }
    }

    res.json({
      message: "修改用户注册状态成功",
      data: { username, registerStatus },
    });
  } catch (err) {
    console.error("更新失败:", err);
    res
      .status(500)
      .json({ message: "修改用户注册状态失败", error: err.message });
  }
});

/**
 * 删除用户接口
 * @route DELETE /deleteUser
 * @description 删除指定用户，同时清理相关的用户数据（文章日志、题目日志等）
 * @param {string} id - 用户ID
 * @returns {Object} 成功返回删除结果和清理的数据统计，失败返回错误信息
 * @example
 * DELETE /deleteUser
 * Body: { "id": "123" }
 */
router.delete("/deleteUser", async (req, res) => {
  try {
    const { id } = req.body;

    // 首先尝试在User集合中查找并删除用户
    let deletedUser = await User.findByIdAndDelete(id);
    let userToDelete = deletedUser;

    // 如果在User集合中没找到，尝试在Register集合中查找
    if (!deletedUser) {
      const registerUser = await Register.findById(id);
      if (registerUser) {
        // 根据用户名在User集合中查找并删除
        deletedUser = await User.findOneAndDelete({ username: registerUser.username });
        userToDelete = registerUser;
      }
    }

    // 检查用户是否存在
    if (!deletedUser && !userToDelete) {
      return res.status(404).json({ message: "用户不存在" });
    }

    // 从Register数据库中删除该用户信息
    const deletedRegisterUser = await Register.findOneAndDelete({ 
      username: userToDelete.username 
    });

    // 删除用户相关的文章日志记录
    const deletedArticleLogs = await UserArticleLog.deleteMany({ 
      userId: id 
    });

    // 删除用户相关的问题日志记录
    const deletedQuestionLogs = await UserQuestionLog.deleteMany({ 
      userId: id 
    });

    res.json({
      message: "删除用户成功",
      data: { 
        deletedUser: userToDelete.username,
        deletedFromUser: !!deletedUser,
        deletedFromRegister: !!deletedRegisterUser,
        deletedArticleLogs: deletedArticleLogs.deletedCount,
        deletedQuestionLogs: deletedQuestionLogs.deletedCount
      }
    });
  } catch (err) {
    console.error("删除用户失败:", err);
    res
      .status(500)
      .json({ message: "删除用户失败", error: err.message });
  }
});

module.exports = router;
