const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  id: Number,
  prefix: String,
  first_name: String,
  last_name: String,
  email_address: String,
  username: String,
  password: String,
  user_type: { type: String, enum: ["Admin", "Staff"] },
});

module.exports = mongoose.model("Account", accountSchema);
