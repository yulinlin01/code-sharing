const mongoose = require("../mongo");

const questionSchema = new mongoose.Schema(
  {
    count: { type: Number, default: 0 }
  },
  { 
    collection: "questions",
    strict: false 
  }
);

module.exports = mongoose.model("Question", questionSchema);
