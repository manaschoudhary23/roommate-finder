const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  listingId: String,
  sender: String,
  receiver: String,
  message: String,
  timestamp: Number,
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Chat', ChatSchema);
