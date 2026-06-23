const mongoose = require("../mongo");

const linksSchema = new mongoose.Schema(
  {},
  { collection: "links" },
  { strict: false }
);

module.exports = mongoose.model("Links", linksSchema);
