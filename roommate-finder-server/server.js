require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Pusher = require('pusher');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const listingRoutes = require('./routes/listingRoutes');
const profileRoutes = require('./routes/profileRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const aiRoutes = require('./routes/ai');
const chatRoutes = require('./routes/chatRoutes');
const agreementRoutes = require("./routes/agreementRoutes");
const compatibilityRoutes = require('./routes/compatibilityRoutes');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Pusher Initialization
const pusher = new Pusher({
  appId: '2011624',
  key: 'acb7b84f69ea91ea3d88',
  secret: '1d9e84a1182f2a6d1cda',
  cluster: 'ap2',
  useTLS: true,
});

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/agreements', agreementRoutes);
app.use('/api/user', compatibilityRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Health Check Route
app.get('/api/ping', (req, res) => {
  res.send('✅ Roommate Finder Backend is Running');
});

// ✅ Example Route to test Pusher Trigger Manually (Optional)
app.post('/api/pusher-test', (req, res) => {
  const { channel, event, message } = req.body;

  if (!channel || !event || !message) {
    return res.status(400).json({ success: false, error: 'Missing fields' });
  }

  pusher.trigger(channel, event, { message })
    .then(() => res.json({ success: true }))
    .catch(err => res.status(500).json({ success: false, error: err.message }));
});

const server = app.listen(5000, () => console.log('🚀 Backend running at http://localhost:5000'));
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});

io.on('connection', (socket) => {
  console.log('🟢 User connected:', socket.id);

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
  });

  socket.on('sendMessage', ({ roomId, msgData }) => {
    io.to(roomId).emit('receiveMessage', msgData);
  });

  socket.on('disconnect', () => {
    console.log('🔴 User disconnected:', socket.id);
  });
});


// ✅ MongoDB Connection & Server Start
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(5000, () => {
      console.log('🚀 Backend running at http://localhost:5000');
    });
  })
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));
