const mongoose = require("../mongo");

const userQuestionLogSchema = new mongoose.Schema({
  userId: { type: String },
  questionId: { type: String, required: true },
  username: { type: String, required: true },
  questionTime: { type: Date, default: Date.now },
});

module.exports = mongoose.model("userQuestionLog", userQuestionLogSchema);
