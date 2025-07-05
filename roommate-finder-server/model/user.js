const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  bio: String,
  avatar: String,
  contact: String,   
  isAdmin: { type: Boolean, default: false },

  compatibility: {
    routine: String,
    cleanliness: String,
    smoking: String,
    guests: String,
    diet: String,
    noiseLevel: String,

    budget: String,
    shareUtilities: String,
    pets: String,
    cooking: String,

    personality: String,
    conflictStyle: String,
    extroversion: String,
    petPeeves: String,
    hobbies: [String],
  }
});

module.exports = mongoose.model('User', UserSchema);
