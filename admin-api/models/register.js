const mongoose = require("../db/index");

const registerSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    registerStatus: { type: Number, default: 0 },
  },
  { collection: "registers" }
);

module.exports = mongoose.model("Register", registerSchema);
