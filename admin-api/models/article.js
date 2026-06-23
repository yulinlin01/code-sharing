const mongoose = require("../db/index");

const articleSchema = new mongoose.Schema({
  articleName: { type: String, required: true },
  articleContent: { type: String, required: true },
  articleCreateTime: { type: Date, default: Date.now },
  count: { type: Number, default: 0 },
  articleCategory: { type: String, required: true },
});

module.exports = mongoose.model("Article", articleSchema);
