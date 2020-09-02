const mongoose = require("mongoose");

const InventorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  name: {
    type: String,
  },
  itemname: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  appovermatrix: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Inventory = mongoose.model("inventory", InventorySchema);
