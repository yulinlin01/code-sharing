const mongoose = require("../db/index");

const categorySchema = new mongoose.Schema({
  firstCategory: { type: String, required: true }, // 一级分类名称
  children: [
    {
      secondCategory: { type: String, required: true }, // 二级分类名称
    },
  ],
});

module.exports = mongoose.model("Category", categorySchema);
