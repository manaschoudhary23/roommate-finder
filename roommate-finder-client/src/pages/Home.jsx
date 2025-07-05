import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

export default function Home() {
  const [listings, setListings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [nearbyMode, setNearbyMode] = useState(false);
  const [userCoords, setUserCoords] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/listings")
      .then((res) => res.json())
      .then((data) => {
        setListings(data);
        setFiltered(data);
      })
      .catch((err) => console.error("Error fetching listings:", err));
  }, []);

  useEffect(() => {
    let results = listings.filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.city.toLowerCase().includes(search.toLowerCase());

      const matchType =
        filterType === "all" || item.type.toLowerCase() === filterType;

      return matchSearch && matchType;
    });

    if (nearbyMode && userCoords) {
      results = results.filter((item) => {
        if (!item.location || !item.location.coordinates) return false;
        const [lng, lat] = item.location.coordinates;

        const distance = getDistanceFromLatLonInKm(
          userCoords.latitude,
          userCoords.longitude,
          lat,
          lng
        );

        return distance <= 5; 
      });
    }

    setFiltered(results);
  }, [search, filterType, listings, nearbyMode, userCoords]);

  const toggleNearby = () => {
    if (nearbyMode) {
      setNearbyMode(false);
      return;
    }

    if (!navigator.geolocation) {
      setError("Geolocation not supported by browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setNearbyMode(true);
      },
      () => setError("Location access denied.")
    );
  };

  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const deg2rad = (deg) => (deg * Math.PI) / 180;

  return (
    <div className="home-container">
      <h2>Find a Room, PG, or Roommate</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by city or title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="filter-buttons">
          <button onClick={() => setFilterType("all")}>All Listings</button>
          <button onClick={() => setFilterType("room")}>Rooms</button>
          <button onClick={() => setFilterType("pg")}>PG</button>
          <button onClick={() => setFilterType("roommate")}>Roommates</button>
          <button onClick={toggleNearby}>
            {nearbyMode ? "Clear Nearby Filter" : "Nearby (5km)"}
          </button>
        </div>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="listing-grid">
        {filtered.length > 0 ? (
          filtered.map((room) => (
            <Link
              to={`/listing/${room._id}`}
              key={room._id}
              className="listing-card"
            >
              {room.userImage && (
                <div className="user-info">
                  <img
                    src={room.userImage}
                    alt={room.userName}
                    className="user-avatar"
                  />
                  <span>{room.userName}</span>
                </div>
              )}
              <h3>{room.title}</h3>
              <p>
                <strong>Rent:</strong> ₹{room.rent}
              </p>
              <p>
                <strong>City:</strong> {room.city}
              </p>
              <p>
                <strong>Type:</strong> {room.type}
              </p>
              <p>{room.description}</p>
            </Link>
          ))
        ) : (
          <p>No listings found.</p>
        )}
      </div>
    </div>
  );
}
