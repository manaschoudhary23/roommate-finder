import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/UserProfile.css"; 

export default function UserProfile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`http://localhost:5000/api/profile/${userId}`).then(res => res.json()),
      fetch(`http://localhost:5000/api/listings/user/${userId}`).then(res => res.json())
    ])
      .then(([profileData, listingsData]) => {
        setProfile(profileData);
        setListings(listingsData);
      })
      .catch(err => console.error("Error fetching profile or listings:", err))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <p className="m-4">Loading user profile...</p>;
  if (!profile) return <p className="m-4">User not found.</p>;

  return (
    <div className="user-profile container py-4">
      <h2>{profile.name}'s Profile</h2>
      <div className="profile-header d-flex align-items-center mb-4">
        <img
          src={profile.avatar || "https://via.placeholder.com/100"}
          alt="avatar"
          className="rounded-circle me-3"
          style={{ width: "100px", height: "100px", objectFit: "cover" }}
        />
        <div>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Contact:</strong> {profile.contact || "Not shared"}</p>
          <p><strong>Bio:</strong> {profile.bio || "No bio provided"}</p>
        </div>
      </div>

      <h4>Compatibility Preferences</h4>
      <div className="compatibility-grid mb-4">
        <p><strong>Routine:</strong> {profile.compatibility?.routine}</p>
        <p><strong>Cleanliness:</strong> {profile.compatibility?.cleanliness}</p>
        <p><strong>Smoking:</strong> {profile.compatibility?.smoking}</p>
        <p><strong>Guests:</strong> {profile.compatibility?.guests}</p>
        <p><strong>Diet:</strong> {profile.compatibility?.diet}</p>
        <p><strong>Noise Level:</strong> {profile.compatibility?.noiseLevel}</p>
        <p><strong>Budget:</strong> ₹{profile.compatibility?.budget}</p>
        <p><strong>Share Utilities:</strong> {profile.compatibility?.shareUtilities}</p>
        <p><strong>Pets:</strong> {profile.compatibility?.pets}</p>
        <p><strong>Cooking:</strong> {profile.compatibility?.cooking}</p>
        <p><strong>Personality:</strong> {profile.compatibility?.personality}</p>
        <p><strong>Conflict Style:</strong> {profile.compatibility?.conflictStyle}</p>
        <p><strong>Extroversion:</strong> {profile.compatibility?.extroversion}</p>
        <p><strong>Pet Peeves:</strong> {profile.compatibility?.petPeeves}</p>
        <p><strong>Hobbies:</strong> {profile.compatibility?.hobbies?.join(", ") || "None listed"}</p>
      </div>

      <h4>Properties Listed by {profile.name}</h4>
      {listings.length === 0 ? (
        <p>This user has not listed any properties yet.</p>
      ) : (
        listings.map(listing => (
          <div key={listing._id} className="property-card border rounded p-3 mb-3">
            <h5>{listing.title}</h5>
            <p><strong>City:</strong> {listing.city}</p>
            <p><strong>Type:</strong> {listing.type}</p>
            <p><strong>Rent:</strong> ₹{listing.rent}</p>
            <p><strong>Amenities:</strong> {listing.amenities?.join(", ")}</p>
            <p><strong>Description:</strong> {listing.description}</p>
            {listing.imageUrl && (
              <img
                src={listing.imageUrl}
                alt="Property"
                className="img-fluid mt-2"
                style={{ maxWidth: "300px", borderRadius: "8px" }}
              />
            )}
          </div>
        ))
      )}
    </div>
  );
}
