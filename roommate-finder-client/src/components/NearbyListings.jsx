import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function NearbyListings() {
  const [listings, setListings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetch(`http://localhost:5000/api/nearby?lat=${position.coords.latitude}&lng=${position.coords.longitude}`)
          .then(res => res.json())
          .then(setListings)
          .catch(() => setError("Failed to fetch nearby listings"));
      },
      () => setError("Location access denied")
    );
  }, []);

  return (
    <div>
      <h2>Listings Near You</h2>
      {error && <p>{error}</p>}
      {listings.length === 0 ? (
        <p>No nearby listings found.</p>
      ) : (
        listings.map((l) => (
          <div key={l._id} style={{ border: "1px solid #ddd", margin: "10px 0", padding: "10px" }}>
            <h4>{l.title}</h4>
            <p>City: {l.city}</p>
            <p>Rent: ₹{l.rent}</p>
            <Link to={`/listing/${l._id}`}>View Details</Link>
          </div>
        ))
      )}
    </div>
  );
}
