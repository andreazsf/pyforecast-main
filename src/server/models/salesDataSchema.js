const mongoose = require("mongoose");

const salesDataSchema = new mongoose.Schema({
  id: Number,
  unit_name: String,
  total_sales: Number,
  date: String,
});

module.exports = mongoose.model("Sales", salesDataSchema);
