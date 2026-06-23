const mongoose = require("../mongo");

const userSchema = new mongoose.Schema(
  {
    username: { type: String },
    password: { type: String },
  },
  { collection: "users" }
);

module.exports = mongoose.model("User", userSchema);
