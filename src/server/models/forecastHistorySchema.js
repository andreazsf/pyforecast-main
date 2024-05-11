const mongoose = require("mongoose");

const forecastHistorySchema = new mongoose.Schema({
  id: Number,
  report_type: String,
  category_name: String,
  date: String,
  range_start: String,
  range_end: String,
  forecast_dates: Array,
  forecasted_values: Array,
});

module.exports = mongoose.model("ForecastHistories", forecastHistorySchema);
