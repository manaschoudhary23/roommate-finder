const express = require('express');
const router = express.Router();
const Booking = require('../model/booking');
const Listing = require('../model/listing');

// Create a Booking Request
router.post('/', async (req, res) => {
  const { listingId, message } = req.body;
  const userId = req.headers.userid;

  if (!listingId || !userId) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const listing = await Listing.findById(listingId);
    console.log('Listing fetched:', listing);
    if (!listing) return res.status(404).json({ error: 'Listing not found' });

    const booking = new Booking({
      listing: listingId,
      requester: userId,
      message,
      owner: listing.owner   
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Get Bookings for a Listing Owner
router.get('/owner/:ownerId', async (req, res) => {
  try {
    const bookings = await Booking.find({ owner: req.params.ownerId })
  .populate({
    path: 'listing',
    populate: { path: 'owner' }  
  })
  .populate('requester')
  .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Accept/Reject Booking
router.put('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

module.exports = router;
