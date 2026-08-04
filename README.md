# 🏠 Roommate Finder Platform

A full-stack web application designed to simplify the process of finding compatible roommates and rental accommodations. The platform enables users to discover nearby rental listings, connect with potential roommates, communicate in real time, and receive AI-powered recommendations based on their preferences.

---

## 📌 Overview

Finding the right roommate and rental property can be time-consuming and challenging. This platform streamlines the process by combining intelligent matching, location-based search, real-time communication, and secure user authentication into a single application.

Users can create detailed profiles, browse verified listings, interact with other users through instant messaging, and generate digital roommate agreements.

---

## ✨ Key Features

### 🏠 Rental Listings
- Create and manage rental property listings
- Upload property images
- Add descriptions, pricing, amenities, and location details
- Browse available rental spaces

### 👥 Roommate Matching
- Match users based on:
  - Budget
  - Gender preference
  - Preferred city
  - Lifestyle preferences
  - Amenities

### 🤖 AI-Powered Recommendations
- Integrated with the Hugging Face Inference API
- Suggests suitable roommates based on user profiles
- Recommends relevant rental listings

### 📍 Location-Based Search
- Search nearby properties using geolocation
- Filter listings by city and proximity

### 💬 Real-Time Chat
- Instant messaging between users
- Built using Socket.io and Pusher
- Enables quick communication before finalizing accommodation

### 📄 Digital Roommate Agreement
- Generate roommate agreements digitally
- Simplifies the onboarding process for tenants

### 🔐 Authentication & Security
- JWT-based user authentication
- Secure login and registration
- Protected application routes

### 👤 User Profiles
Each user profile includes:
- Personal information
- Budget
- Preferred city
- Gender
- Amenities
- Lifestyle preferences

---

# 🛠️ Tech Stack

## Frontend

- React.js
- JSX
- CSS

## Backend

- Node.js
- Express.js

## Database

- MongoDB
- Mongoose

## Authentication

- JSON Web Token (JWT)

## AI Integration

- Hugging Face Inference API

## Real-Time Communication

- Socket.io
- Pusher

## File Uploads

- Multer

---

# 🏗️ System Architecture

```
                    React Frontend
                           │
                           │ REST APIs
                           ▼
                  Express.js Backend
                           │
        ┌──────────────────┼─────────────────┐
        │                  │                 │
        ▼                  ▼                 ▼
    MongoDB          JWT Authentication   HuggingFace API
        │
        ▼
  Property Listings
  User Profiles
  Messages
  Preferences

Socket.io + Pusher
       │
       ▼
 Real-Time Chat
```

---

# 📂 Project Structure

```
roommate-finder/
│
├── roommate-finder-client/
│   ├── public/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── assets/
│   └── App.jsx
│
├── roommate-finder-server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── uploads/
│   └── server.js
│
├── .gitignore
├── README.md
└── package.json
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/manaschoudhary23/roommate-finder.git
```

Navigate to the project directory:

```bash
cd roommate-finder
```

---

## Backend Setup

```bash
cd roommate-finder-server

npm install

npm start
```

---

## Frontend Setup

```bash
cd roommate-finder-client

npm install

npm start
```

---

# 🔑 Environment Variables

Create a `.env` file inside the backend directory.

Example:

```env
PORT=5000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_secret_key

HUGGINGFACE_API_KEY=your_api_key

PUSHER_APP_ID=

PUSHER_KEY=

PUSHER_SECRET=

PUSHER_CLUSTER=
```

---

# 🚀 Future Enhancements

- Google Maps integration
- Video calling between roommates
- AI personality compatibility analysis
- Payment gateway integration
- Rental verification system
- Admin dashboard
- Mobile application
- Push notifications
- Saved searches and favorites

---

# 📖 Learning Outcomes

This project demonstrates practical experience in:

- Full-stack web development
- REST API development
- MongoDB database design
- JWT authentication
- Real-time communication using Socket.io
- AI API integration
- File upload handling
- Responsive React application development
- Client-server architecture

---

# 👨‍💻 Author

**Manas Choudhary**

Computer Engineering Graduate

- LinkedIn: www.linkedin.com/in/manas-choudhary-98560b266
- GitHub: https://github.com/manaschoudhary23

---

# 📄 License

This project is intended for educational and portfolio purposes.
