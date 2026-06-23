const express = require("express");
const app = express();
const PORT = 3030;
const cors = require("cors");
const jwt = require("jsonwebtoken");
app.use(
  cors({
    origin: "http://www.furui.work", // 或你的前端域名
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// 路由引入
const questionBankRouter = require("./routes/questionBank");
const articleRouter = require("./routes/article");
const linksRouter = require("./routes/links");
const registerRouter = require("./routes/register");
// JWT密钥（生产环境中应该从环境变量中获取）
const JWT_SECRET = "your-secret-key-here-1231231231231231231231231231231231";

// 登录接口
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  
  // 验证用户名和密码
  if (username === "weishubin" && password === "123456") {
    // 生成JWT令牌，过期时间为2小时
    const token = jwt.sign(
      { 
        username: username,
        userId: 1 // 可以添加更多用户信息
      },
      JWT_SECRET,
      { 
        expiresIn: '1h' // 1分钟过期
      }
    );
    
    res.json({
      success: true,
      message: "登录成功",
      data: {
        username: username,
        token: token,
        expiresIn: '2h'
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: "用户名或密码错误"
    });
  }
});

// 验证token接口
app.post("/check", (req, res) => {
  const { token } = req.body;
  
  if (!token) {
    return res.status(201).json({
      success: false,
      message: "缺少token参数"
    });
  }
  
  try {
    // 验证JWT令牌
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // 令牌有效，返回200状态码
    res.json({
      success: true,
      message: "token有效",
      data: {
        username: decoded.username,
        userId: decoded.userId,
        exp: decoded.exp
      }
    });
  } catch (error) {
    // 令牌无效或过期，返回201状态码
    res.json({
      success: false,
      message: "token无效或已过期",
      error: error.message
    });
  }
});

app.use("/questionBank", questionBankRouter);
app.use("/article", articleRouter);
app.use("/links", linksRouter);
app.use("/register", registerRouter);

app.listen(PORT, () => {
  console.log(`技术分享平台后台服务器已启动，监听端口 ${PORT}`);
});
