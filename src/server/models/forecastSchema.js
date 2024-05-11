const mongoose = require("mongoose");

const forecastSchema = new mongoose.Schema({
  id: Number,
  report_type: String,
  category_name: String,
  date: String,
  range_start: String,
  range_end: String,
  months: Array,
  months_id: Array,
  target: Array,
  mse: Number,
  r_squared: Number,
});

module.exports = mongoose.model("Forecast", forecastSchema);
