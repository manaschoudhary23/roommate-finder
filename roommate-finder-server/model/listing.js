const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  rent: { type: Number, required: true },
  city: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['room', 'pg', 'roommate'], required: true },
  imageUrl: { type: String },            
  userName: { type: String },            
  userImage: { type: String },           
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  occupancy: { type: String, enum: ['Private', 'Shared'] },
  lookingFor: { type: String, enum: ['Male', 'Female', 'Anyone'] },
  amenities: [{ type: String }],         

  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] } // [longitude, latitude]
  }
}, { timestamps: true });

listingSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Listing', listingSchema);
