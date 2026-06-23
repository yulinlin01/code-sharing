const express = require("express");
const router = express.Router();
const Register = require("../models/register");
const User = require("../models/user");
const UserArticleLog = require("../models/userArticleLog");
const UserQuestionLog = require("../models/userQuestionLog");
const Article = require("../models/article");
const Question = require("../models/question");
const { generateToken, verifyToken } = require("../token");

// 用户注册接口
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // 检查是否缺少必要字段
    if (!username || !password) {
      return res.status(400).json({
        message: "用户名和密码不能为空",
      });
    }

    // 检查用户名是否已存在
    const existingUser = await Register.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        message: "用户名已存在，请选择其他用户名或者联系管理员解决",
      });
    }

    // 创建新用户
    const newUser = new Register({
      username,
      password,
    });

    // 保存到数据库
    await newUser.save();

    res.json({
      message: "注册成功，请通知管理员审核，审核通过即可获取全部权限",
    });
  } catch (error) {
    console.error("注册错误:", error);
    res.status(500).json({
      message: "注册失败，请稍后重试",
    });
  }
});

// 用户登录接口
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // 检查是否缺少必要字段
    if (!username || !password) {
      return res.status(400).json({
        message: "用户名和密码不能为空",
      });
    }

    // 在user.js数据库中查找用户
    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(401).json({
        message: "请确定是否注册或者联系管理员开通权限",
      });
    }

    // 生成token
    const token = generateToken({
      user: user,
    });
    res.json({
      message: "用户登录成功",
      user: user,
      token: token,
    });
  } catch (error) {
    console.error("登录错误:", error);
    res.status(500).json({
      message: "登录失败，请稍后重试",
    });
  }
});

// 用户文章访问记录接口  设置
router.post("/article-log", async (req, res) => {
  try {
    const { articleId, userId ,username } = req.body;

    // 检查是否缺少必要字段
    if (!articleId || !userId) {
      return res.status(400).json({
        message: "文章ID和用户ID不能为空",
      });
    }

    // 根据userId找到用户
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "用户不存在",
      });
    }

    // 更新文章的访问计数（每次访问都增加）
    await Article.findByIdAndUpdate(
      articleId,
      { $inc: { count: 1 } },
      { new: true }
    );

    // 检查是否已经存在相同的访问记录
    const existingLog = await UserArticleLog.findOne({ userId, articleId,username });

    if (existingLog) {
      return res.json({
        message: "您之前看过这个文章哦，再巩固一下吧！",
        articlelog: existingLog,
      });
    }

    // 创建新的访问记录
    const newLog = new UserArticleLog({
      userId: userId,
      articleId: articleId,
      articleTime: new Date(),
      username: username,
    });

    // 保存到userArticleLog集合中
    await newLog.save();

    res.json({
      message: "访问文章信息已保存",
      articlelog: newLog,
    });
  } catch (error) {
    console.error("保存文章访问记录错误:", error);
    res.status(500).json({
      message: "保存文章访问记录失败，请稍后重试",
    });
  }
});

// 获取用户文章访问记录接口
router.get("/get-article-log", async (req, res) => {
  try {
    const logs = await UserArticleLog.find();
    res.json({
      message: "获取成功",
      data: logs,
    });
  } catch (error) {
    console.error("获取文章访问记录错误:", error);
    res.status(500).json({ message: "获取文章访问记录失败，请稍后重试" });
  }
});

// 用户题目访问记录接口 设置
router.post("/question-log", async (req, res) => {
  try {
    const { userId, questionId,username } = req.body;
    if (!userId || !questionId) {
      return res.status(400).json({ message: "用户ID和题目ID不能为空" });
    }
  

    // 更新题目的访问计数（每次访问都增加）
    await Question.findByIdAndUpdate(
      questionId,
      { $inc: { count: 1 } },
      { new: true }
    );

    // 检查是否已经存在相同的访问记录
    const existingLog = await UserQuestionLog.findOne({username, userId, questionId });
    if (existingLog) {
      return res.json({
        message: "您之前看过这个题目，再巩固一下吧！",
        questionlog: existingLog,
      });
    }
    
    // 创建新的访问记录
    const newLog = new UserQuestionLog({
      userId: userId,
      questionId: questionId,
      questionTime: new Date(),
      username: username
    });
    await newLog.save();
    res.json({
      message: "访问的题目信息已保存",
      questionlog: newLog,
    });
  } catch (error) {
    console.error("保存题目访问记录错误:", error);
    res.status(500).json({ message: "保存题目访问记录失败，请稍后重试" });
  }
});

// 获取用户题目访问记录接口
router.get("/get-question-log", async (req, res) => {
  try {
    const logs = await UserQuestionLog.find();
    res.json({
      message: "获取成功",
      data: logs,
    });
  } catch (error) {
    console.error("获取题目访问记录错误:", error);
    res.status(500).json({ message: "获取题目访问记录失败，请稍后重试" });
  }
});


// 测试接口：获取文章和题目信息
router.get("/test-articles", async (req, res) => {
  try {
    const articles = await Article.find().limit(5);
    res.json({
      message: "获取文章成功",
      count: articles.length,
      articles: articles
    });
  } catch (error) {
    console.error("获取文章测试错误:", error);
    res.status(500).json({ message: "获取文章失败", error: error.message });
  }
});

router.get("/test-questions", async (req, res) => {
  try {
    const questions = await Question.find().limit(5);
    res.json({
      message: "获取题目成功", 
      count: questions.length,
      questions: questions
    });
  } catch (error) {
    console.error("获取题目测试错误:", error);
    res.status(500).json({ message: "获取题目失败", error: error.message });
  }
});

// Token验证接口
router.post("/check", async (req, res) => {
  console.log(req.body)
  try {
    const { token } = req.body;
    

    // 检查是否提供了token
    if (!token) {
      return res.status(302).json({
        message: "Token不能为空",
        valid: false
      });
    }

    // 验证token
    const decoded = verifyToken(token);
    
    if (decoded) {
      // Token有效
      res.json({
        message: "Token验证成功",
        valid: true,
        user: decoded.user,
        code : 200
      });
    } else {
      // Token无效
      res.json({
        message: "Token无效或已过期",
        valid: false,
        code : 302
      });
    }
  } catch (error) {
    console.error("Token验证错误:", error);
    res.status(302).json({
      message: "Token验证失败",
      valid: false
    });
  }
});

// 获取所有用户接口
router.get("/getAllUser", async (req, res) => {
  try {
    const users = await User.find();
    res.json({
      message: "获取所有用户成功",
      data: users,
      count: users.length
    });
  } catch (error) {
    console.error("获取所有用户错误:", error);
    res.status(500).json({
      message: "获取所有用户失败，请稍后重试",
      error: error.message
    });
  }
});

module.exports = router;
