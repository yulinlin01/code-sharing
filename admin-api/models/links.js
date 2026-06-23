const mongoose = require("../db/index");

const linksSchema = new mongoose.Schema({
  linksName: { type: String, required: true },
  linksContent: { type: String, required: true },
  linksFunction: { type: String }, // 新增的链接功能字段
});

module.exports = mongoose.model("Links", linksSchema);
