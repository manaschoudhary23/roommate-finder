const express = require('express');
const router = express.Router();

router.post('/generate-description', async (req, res) => {
  const { title, rent, city, type, description, amenities } = req.body;

  if (!title || !rent || !city || !type) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    let amenitiesText = '';
    if (Array.isArray(amenities) && amenities.length > 0) {
      amenitiesText = `Enjoy a hassle-free living experience with essential amenities like ${amenities.join(', ')}.`;
    }

    const generated = `
✨ Discover comfort and convenience with "${title}"!
Located in the heart of ${city}, this ${type} offers the ideal space for students and working professionals alike.
${amenitiesText}
${description ? description : 'This property is designed for a peaceful, friendly, and secure living experience.'}
All this for just ₹${rent}/month. Don't miss out—secure your spot today!
`;

    res.json({ description: generated.trim() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate description' });
  }
});

module.exports = router;
