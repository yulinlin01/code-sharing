const mongoose = require("mongoose");

const mongoURL = "mongodb://localhost:27017/code_share_admin_api"; // 请根据实际情况修改数据库名

mongoose.connect(mongoURL);

module.exports = mongoose;
