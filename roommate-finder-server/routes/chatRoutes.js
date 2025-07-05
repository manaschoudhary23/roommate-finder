const express = require('express');
const router = express.Router();
const Chat = require('../model/chat');
const Pusher = require('pusher');

const pusher = new Pusher({
  appId: '2011624',
  key: 'acb7b84f69ea91ea3d88',
  secret: '1d9e84a1182f2a6d1cda',
  cluster: 'ap2',
  useTLS: true,
});

// Send Message (Save in DB)
router.post('/', async (req, res) => {
  const { listingId, sender, receiver, message } = req.body;
  if (!listingId || !sender || !receiver || !message) {
    return res.status(400).json({ success: false, error: 'Missing fields' });
  }

  const msgData = { listingId, sender, receiver, message, timestamp: Date.now(), isRead: false };

  try {
    const newChat = await Chat.create(msgData);
    await pusher.trigger(`chat-${listingId}`, 'new-message', msgData);
    res.status(200).json({ success: true, message: newChat });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get Chat History
router.get('/:listingId', async (req, res) => {
  try {
    const chats = await Chat.find({ listingId: req.params.listingId }).sort({ timestamp: 1 });
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Inbox (All Conversations Where You Are Involved)
router.get('/inbox/:userName', async (req, res) => {
  const { userName } = req.params;

  try {
    const chats = await Chat.aggregate([
      { 
        $match: { 
          $or: [ { sender: userName }, { receiver: userName } ] 
        } 
      },
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: "$listingId",
          lastMessage: { $first: "$message" },
          timestamp: { $first: "$timestamp" },
          sender: { $first: "$sender" },
          receiver: { $first: "$receiver" },
          listingId: { $first: "$listingId" },
          isRead: { $first: "$isRead" }
        }
      },
      { $sort: { timestamp: -1 } }
    ]);

    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: "Failed to load inbox" });
  }
});

// Mark Message as Read
router.put('/:id/read', async (req, res) => {
  try {
    await Chat.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to mark as read" });
  }
});

module.exports = router;
