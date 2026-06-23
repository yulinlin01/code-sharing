const mongoose = require("mongoose");

const DB_URL = "mongodb://127.0.0.1:27017/code_share_admin_api";

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("数据库链接成功");
  })
  .catch((err) => {
    console.log("数据库链接失败", err);
  });

module.exports = mongoose;
