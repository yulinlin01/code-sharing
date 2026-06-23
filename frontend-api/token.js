const jwt = require("jsonwebtoken");

// JWT密钥，实际项目中应该放在环境变量中
const JWT_SECRET =
  "K8#mN9$pQ2@vX7&hL5*wE3!cR6%tY1^uI4(oA0)sD8{fG2}jH7[kZ9]bM4<nC6>qW5";

// 生成token的函数
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
};

// 验证token的函数
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
