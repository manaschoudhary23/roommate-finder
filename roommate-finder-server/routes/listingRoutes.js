const express = require('express');
const router = express.Router();
const Listing = require('../model/listing');
const User = require('../model/user');
const axios = require('axios');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

router.get('/', async (req, res) => {
  try {
    const listings = await Listing.find().sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

router.get('/user/:id', async (req, res) => {
  try {
    const listings = await Listing.find({ owner: req.params.id }).sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user listings' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/nearby/search', async (req, res) => {
  const { lat, lng } = req.query;
  if (!lat || !lng) return res.status(400).json({ error: 'Latitude and longitude required' });

  try {
    const nearbyListings = await Listing.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: 5000
        }
      }
    });
    res.json(nearbyListings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch nearby listings' });
  }
});

router.get('/suggestions/:userId', async (req, res) => {
  const { userId } = req.params;
  const { city, budget, lookingFor, amenities } = req.query;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const amenityArray = amenities ? amenities.split(',').map(a => a.trim().toLowerCase()) : [];

    const filter = {
      owner: { $ne: userId },
      lookingFor: { $in: [user.gender, 'Anyone'] }
    };

    if (amenityArray.length) filter.amenities = { $all: amenityArray };

    const listings = await Listing.find(filter);

    const prompt = `
You are an AI roommate matchmaker. Analyze the following:

User Preferences:
- Preferred city: ${city || user.preferredCity}
- Max Budget: ₹${budget || user.maxBudget}
- Looking for: ${lookingFor}
- Amenities: ${amenities || "No specific preference"}

Listings:
${listings.map(l => `
Title: ${l.title}
City: ${l.city}
Rent: ₹${l.rent}
Type: ${l.type}
Looking for: ${l.lookingFor}
Amenities: ${(l.amenities || []).join(", ")}
Description: ${l.description}
`).join("\n")}

Suggest the best matches with reasons in simple English.
    `;

    const hfResponse = await axios.post(
      'https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta',
      { inputs: prompt },
      { headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` } }
    );

    const aiSuggestions = hfResponse.data[0]?.generated_text || "No suggestions available.";

    res.json({ aiSuggestions, rawListings: listings });

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch AI suggestions' });
  }
});

router.post('/', upload.array('images', 5), async (req, res) => {
  const {
    title, rent, city, description, type,
    userName, userImage, gender, occupancy, lookingFor, amenities,
    latitude, longitude
  } = req.body;

  const userId = req.headers.userid;

  if (!title || !rent || !city || !type || !userId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const imagePaths = req.files.map(file => `/uploads/${file.filename}`);

  try {
    const newListing = new Listing({
      title,
      rent,
      city,
      description,
      type: type.toLowerCase(),
      imageUrl: imagePaths,
      userName,
      userImage,
      gender,
      occupancy,
      lookingFor,
      amenities: amenities ? amenities.split(',').map(a => a.trim()) : [],
      owner: userId,
      location: {
        type: "Point",
        coordinates: [parseFloat(longitude) || 0, parseFloat(latitude) || 0]
      }
    });

    await newListing.save();
    res.status(201).json(newListing);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add listing' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedListing) return res.status(404).json({ message: 'Listing not found' });
    res.json(updatedListing);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update listing' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Listing.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Listing not found' });
    res.json({ message: 'Listing deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete listing' });
  }
});

module.exports = router;
