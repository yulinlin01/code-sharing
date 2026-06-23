const mongoose = require("../mongo");

const articleCategorySchema = new mongoose.Schema(
  {},
  { collection: "articlecategories" },
  { strict: false }
);

module.exports = mongoose.model("ArticleCateGory", articleCategorySchema);
