import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login1';
import Register from './pages/Register';
import Home from './pages/Home';
import Footer from './pages/Footer';
import ListingDetails from './pages/ListingDetails';
import Navbar from './components/Navbar';
import Profile from './pages/Profile';
import CompatibilityForm from './pages/CompatibilityForm'; 
import Inbox from './pages/Inbox';
import Agreement from './pages/AgreementForm';
import RoommateFinder from "./pages/RoommateFinder";
import UserProfile from "./pages/UserProfile";

function Layout({ children }) {
  return (
    <div className="page-container">
      <Navbar />
      <div className="content-wrap">{children}</div>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/home" element={<Layout><Home /></Layout>} />
        <Route path="/login" element={<Layout><Login /></Layout>} />
        <Route path="/register" element={<Layout><Register /></Layout>} />
        <Route path="/listing/:id" element={<Layout><ListingDetails /></Layout>} />
        <Route path="/profile" element={<Layout><Profile /></Layout>} />
        <Route path="/compatibility" element={<Layout><CompatibilityForm /></Layout>} />
        <Route path="/messages/inbox" element={<Layout><Inbox /></Layout>} />
        <Route path="/agreement" element={<Layout><Agreement /></Layout>} />
        <Route path="/roommate-finder" element={<Layout><RoommateFinder /></Layout>} />
        <Route path="/user-profile/:userId" element={<Layout><UserProfile/></Layout>} />
      </Routes>
    </>
  );
}
