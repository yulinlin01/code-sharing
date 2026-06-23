const mongoose = require("../db/index");

const questionSchema = new mongoose.Schema({
  questionName: { type: String, required: true },
  questionContent: { type: String, required: true },
  questionCreateTime: { type: Date, default: Date.now },
  count: { type: Number, default: 0 },
  firstCategory: { type: String, required: true },
  secondCategory: { type: String, required: true },
  questionId: { type: Number, required: true },
  answer: { type: String, required: true },
  analysis: { type: String, required: true },
});

module.exports = mongoose.model("Question", questionSchema);
