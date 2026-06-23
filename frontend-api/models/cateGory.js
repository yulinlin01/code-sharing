const mongoose = require("../mongo");

const categorySchema = new mongoose.Schema(
  {},
  { collection: "categories" },
  { strict: false }
);

module.exports = mongoose.model("Category", categorySchema);
