import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/RoommateFinder.css";

export default function RoommateFinder() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const preferences = location.state;
    const user = JSON.parse(localStorage.getItem("user"));

    if (!preferences || !user?._id) {
      alert("Please fill compatibility preferences first.");
      navigate("/compatibility");
      return;
    }

    fetch("http://localhost:5000/api/user/match/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...preferences, userId: user._id }),
    })
      .then((res) => res.json())
      .then((data) => setMatches(data))
      .catch((err) => console.error("Error fetching matches:", err))
      .finally(() => setLoading(false));
  }, [navigate, location.state]);

  const openUserProfile = (userId) => {
    navigate(`/user-profile/${userId}`);
  };

  if (loading) return <p>Loading matches...</p>;

  return (
    <div className="roommate-finder">
      <h2>🔍 Compatible Roommate Matches</h2>
      {matches.length === 0 ? (
        <p>No matches found. Try changing your preferences.</p>
      ) : (
        matches.map((m) => (
          <div
            key={m._id}
            className="match-card"
            onClick={() => openUserProfile(m._id)}
            style={{ cursor: "pointer" }}
          >
            <img src={m.avatar || "https://via.placeholder.com/80"} alt="avatar" />
            <div>
              <h4>{m.name}</h4>
              <p><strong>Bio:</strong> {m.bio || "No bio provided"}</p>
              <p><strong>Contact:</strong> {m.contact || "Not shared"}</p>
            </div>
          </div>
        ))
      )}
      <button className="back-btn" onClick={() => navigate("/home")}>Back to Home</button>
    </div>
  );
}
