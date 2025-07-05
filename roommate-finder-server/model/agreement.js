const mongoose = require("mongoose");

const agreementSchema = new mongoose.Schema({
  user1: String,
  user2: String,
  terms: Object,
  pdfUrl: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Agreement", agreementSchema);
