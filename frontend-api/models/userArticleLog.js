const mongoose = require("../mongo");

const userArticleLogSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  articleId: { type: String, required: true },
  username: { type: String, required: true },
  articleTime: { type: Date, default: Date.now },
});

module.exports = mongoose.model("userArticleLog", userArticleLogSchema);
