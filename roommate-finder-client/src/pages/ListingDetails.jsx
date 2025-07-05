import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../UserContext';
import Chat from './Chat';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import '../styles/ListingDetails.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function ListingDetails() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
    fetch(`http://localhost:5000/api/listings/${id}`)
      .then(res => res.json())
      .then(data => {
        setListing(data);
        window.scrollTo(0, 0); 
      })
      .catch(err => console.error('Error loading listing:', err));
  }, [id]);

  const sendBookingRequest = () => {
    if (!user) return alert('Please login to request booking.');

    fetch('http://localhost:5000/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', userid: user._id },
      body: JSON.stringify({
        listingId: listing._id,
        message: "Interested to book / schedule visit",
      }),
    })
      .then(res => res.json())
      .then(() => alert('Booking request sent!'))
      .catch(err => console.error('Booking error:', err));
  };

  if (!listing) {
    return <div className="loader-overlay"><div className="loader"></div></div>;
  }

  const lat = listing.location?.coordinates?.[1];
  const lng = listing.location?.coordinates?.[0];

  return (
    <div className="details-container">
      <div className="profile-section">
        <img src={listing.userImage || "https://via.placeholder.com/120"} alt="User" className="profile-pic" />
        <h3>{listing.userName || "Unknown User"}</h3>
      </div>

      <div className="info-section">
        <h2>{listing.title}</h2>
        
        <div className="location">
          📍 <strong>Location:</strong> {listing.city}
          {lat && lng && <span> (Lat: {lat}, Lng: {lng})</span>}
        </div>

        <div className="info-grid">
          <div><strong>Gender:</strong> {listing.gender || "N/A"}</div>
          <div><strong>Rent:</strong> ₹{listing.rent}</div>
          <div><strong>Occupancy:</strong> {listing.occupancy || "N/A"}</div>
          <div><strong>Looking For:</strong> {listing.lookingFor || "N/A"}</div>
        </div>

        {listing.imageUrl && (
          <div className="room-image">
            <img src={listing.imageUrl} alt="Room" />
          </div>
        )}

        <p className="desc">{listing.description}</p>

        {lat && lng && (
          <div style={{ height: "300px", width: "100%", marginBottom: "1.5rem", borderRadius: "10px", overflow: "hidden" }}>
            <MapContainer center={[lat, lng]} zoom={15} style={{ height: "100%", width: "100%" }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[lat, lng]}>
                <Popup>{listing.title}</Popup>
              </Marker>
            </MapContainer>
          </div>
        )}

        {user && user._id !== listing.owner && (
          <button className="book-btn" onClick={sendBookingRequest}>Request to Book</button>
        )}

        {user && <Chat roomId={listing._id} receiverName={listing.userName} />}
      </div>
    </div>
  );
}
