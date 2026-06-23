
const mongoose = require("../mongo");

const articleSchema = new mongoose.Schema(
  {
    count: { type: Number, default: 0 }
  },
  { 
    collection: "articles",
    strict: false 
  }
);

module.exports = mongoose.model("Article", articleSchema);
