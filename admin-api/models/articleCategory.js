const mongoose = require("../db/index");

const articleCategorySchema = new mongoose.Schema({
  articleCategory: { type: String, required: true }, // 分类名称
});

module.exports = mongoose.model("ArticleCategory", articleCategorySchema);
