const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  amount: { type: Number, default: null },
  merchant: { type: String, unique: true },
  description: { type: String },
  paid: {type: Boolean, default: false}
});

module.exports = mongoose.model("payment", paymentSchema);