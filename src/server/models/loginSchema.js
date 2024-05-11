const mongoose = require("mongoose");

const loginSchema = new mongoose.Schema({
  emailOrUsername: String,
  password: String,
});

module.exports = mongoose.model("Login", loginSchema);
