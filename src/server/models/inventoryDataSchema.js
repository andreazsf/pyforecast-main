const mongoose = require("mongoose");

const inventoryDataSchema = new mongoose.Schema({
  id: Number,
  inventory_name: String,
  product_name: String,
  quantity_sold: Number,
  total_sales: Number,
  date: String,
});

module.exports = mongoose.model("Inventory", inventoryDataSchema);
