const express = require('express');
const router = express.Router();
const User = require('../model/user');

// Update Compatibility Route
router.put('/compatibility/:userId', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { compatibility: req.body },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Compatibility updated', user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update compatibility', error: err });
  }
});

// Search Matches based on form input (independent of own profile)
router.post('/match/search', async (req, res) => {
  try {
    const prefs = req.body;
    const userId = prefs.userId;

    const others = await User.find({
      compatibility: { $exists: true },
      _id:{$ne : userId}
    });

    const matches = others.filter(other => {
      const c2 = other.compatibility;
      let score = 0;

      if (prefs.routine === c2.routine) score++;
      if (prefs.cleanliness === c2.cleanliness) score++;
      if (prefs.guests === c2.guests) score++;
      if (prefs.noiseLevel === c2.noiseLevel) score++;
      if (Math.abs(prefs.budget - c2.budget) <= 10000) score++;
      if (prefs.pets === c2.pets) score++;
      if (prefs.smoking === c2.smoking) score++;
      if (prefs.personality === c2.personality) score++;
      if (prefs.extroversion === c2.extroversion) score++;

      const commonHobbies = prefs.hobbies?.filter(h => c2.hobbies?.includes(h)) || [];
      if (commonHobbies.length >= 2) score++;

      return score >= 3;
    });

    res.json(matches);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch matches', error: err });
  }
});

module.exports = router;
