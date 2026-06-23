const mongoose = require("../mongo");

const registerSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  registerStatus: { type: Number, default: 0 },
  registerTime: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Register", registerSchema);
