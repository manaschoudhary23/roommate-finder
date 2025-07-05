import { useEffect, useState, useContext } from "react";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";
import { Button, Nav } from "react-bootstrap";
import "../styles/Profile.css";
import CompatibilityFields from "../components/CompatibilityFields";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [bio, setBio] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [contact, setContact] = useState("");
  const [compatibility, setCompatibility] = useState({
    routine: "",
    cleanliness: "",
    smoking: "",
    guests: "",
    diet: "",
    noiseLevel: "",
    budget: "",
    shareUtilities: "",
    pets: "",
    cooking: "",
    personality: "",
    conflictStyle: "",
    extroversion: "",
    petPeeves: "",
    hobbies: [],
  });

  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [rent, setRent] = useState("");
  const [amenities, setAmenities] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState([]);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    fetch("http://localhost:5000/api/profile", {
      headers: { userid: user._id },
    })
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setBio(data.bio || "");
        setName(data.name || "");
        setAvatar(data.avatar || "");
        setContact(data.contact || "");
        if (data.compatibility) {
          setCompatibility({
            routine: data.compatibility.routine || "",
            cleanliness: data.compatibility.cleanliness || "",
            smoking: data.compatibility.smoking || "",
            guests: data.compatibility.guests || "",
            diet: data.compatibility.diet || "",
            noiseLevel: data.compatibility.noiseLevel || "",
            budget: data.compatibility.budget || "",
            shareUtilities: data.compatibility.shareUtilities || "",
            pets: data.compatibility.pets || "",
            cooking: data.compatibility.cooking || "",
            personality: data.compatibility.personality || "",
            conflictStyle: data.compatibility.conflictStyle || "",
            extroversion: data.compatibility.extroversion || "",
            petPeeves: data.compatibility.petPeeves || "",
            hobbies: data.compatibility.hobbies || [],
          });
        }
      })
      .catch((err) => console.error("Error fetching profile:", err));

    fetch(`http://localhost:5000/api/listings/user/${user._id}`)
      .then((res) => res.json())
      .then(setListings)
      .catch((err) => console.error("Error fetching listings:", err));

    fetch(`http://localhost:5000/api/bookings/owner/${user._id}`)
      .then((res) => res.json())
      .then(setBookings)
      .catch((err) => console.error("Error fetching bookings:", err));
  }, [user]);

  const updateProfile = () => {
    fetch("http://localhost:5000/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json", userid: user._id },
      body: JSON.stringify({
        bio,
        name,
        avatar,
        contact,
        compatibility,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Profile updated!");
        setProfile(data);
      })
      .catch((err) => console.error("Error updating profile:", err));
  };

  const addListing = () => {
    if (
      !title ||
      !city ||
      !type ||
      !rent ||
      !description ||
      !amenities ||
      !latitude ||
      !longitude
    ) {
      return alert("Please fill all required fields and detect location.");
    }

    fetch("http://localhost:5000/api/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json", userid: user._id },
      body: JSON.stringify({
        title,
        city,
        type,
        rent,
        amenities: amenities.split(",").map((a) => a.trim()),
        description,
        imageUrl,
        userName: name || profile?.name,
        userImage: avatar || profile?.avatar,
        gender: profile?.gender || "Other",
        occupancy: "Private",
        lookingFor: "Anyone",
        latitude,
        longitude,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) return alert(data.error);
        alert("Listing added!");
        setListings((prev) => [...prev, data]);
        setTitle("");
        setCity("");
        setType("");
        setRent("");
        setAmenities("");
        setDescription("");
        setImageUrl([]);
        setLatitude("");
        setLongitude("");
      })
      .catch((err) => console.error("Error adding listing:", err));
  };

  const deleteListing = (id) => {
    if (!window.confirm("Are you sure to delete this listing?")) return;

    fetch(`http://localhost:5000/api/listings/${id}`, {
      method: "DELETE",
      headers: { userid: user._id },
    })
      .then((res) => res.json())
      .then(() => {
        alert("Listing deleted!");
        setListings((prev) => prev.filter((l) => l._id !== id));
      })
      .catch((err) => console.error("Error deleting listing:", err));
  };

  const handleBookingResponse = (bookingId, status) => {
    fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
      .then((res) => res.json())
      .then((updated) => {
        setBookings((prev) =>
          prev.map((b) => (b._id === updated._id ? updated : b))
        );
        alert(`Booking ${status}`);
      })
      .catch((err) => console.error("Error updating booking:", err));
  };

  const generateDescription = () => {
    if (!title || !city || !type || !rent) {
      return alert(
        "Please enter Title, City, Type, Rent before generating description."
      );
    }

    setLoadingAI(true);
    fetch("http://localhost:5000/api/ai/generate-description", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        rent,
        city,
        type,
        amenities: amenities.split(",").map((a) => a.trim()),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.description) setDescription(data.description);
        else alert("AI could not generate description");
      })
      .catch((err) => console.error("Error:", err))
      .finally(() => setLoadingAI(false));
  };

  if (!user) return <p className="m-4">Please login to view your profile.</p>;
  if (!profile) return <p className="m-4">Loading profile...</p>;

  return (
    <div className="d-flex">
      <div
        className="d-flex flex-column bg-light p-3"
        style={{ width: "250px", height: "100vh" }}
      >
        <h4>Dashboard</h4>
        <div className="mb-3">
          <label className="form-label">Profile Picture</label>

          <div className="avatar-preview mb-2">
            {avatar ? (
              <img
                src={avatar}
                alt="Avatar"
                className="img-thumbnail"
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
            ) : (
              <div className="avatar-placeholder">No Avatar</div>
            )}
          </div>

          <Button
            className="generate-avatar-btn"
            onClick={() => {
              fetch("http://localhost:5000/api/profile/generate-avatar", {
                method: "POST",
                headers: { userid: user._id },
              })
                .then((res) => res.json())
                .then((data) => {
                  if (data.avatar) {
                    setAvatar(data.avatar);
                    alert("New avatar generated!");
                  }
                })
                .catch((err) => console.error("Error generating avatar:", err));
            }}
          >
            Generate Avatar
          </Button>
        </div>

        <Nav className="flex-column gap-2">
          <Button variant="primary" onClick={() => navigate("/")}>
            Home
          </Button>
          <Button
            variant="outline-secondary"
            onClick={() => navigate("/roommate-finder")}
          >
            Find Roommates
          </Button>
          <Button
            variant="outline-secondary"
            onClick={() =>
              document
                .getElementById("listings-section")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            My Listings
          </Button>
          <Button
            variant="outline-secondary"
            onClick={() =>
              document
                .getElementById("bookings-section")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Booking Requests
          </Button>
          <Button
            variant="danger"
            className="mt-3"
            onClick={() => {
              localStorage.removeItem("user");
              window.location.reload();
            }}
          >
            Logout
          </Button>
        </Nav>
        <div className="mt-auto pt-3 text-muted">
          Logged in as <strong>{name || "User"}</strong>
        </div>
      </div>

      <div className="p-4 flex-grow-1">
        <div className="mb-4" id="profile-section">
          <h3>Update Profile</h3>
          <input
            className="form-control mb-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
          />
          <input
            className="form-control mb-2"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Contact Number"
          />
          <textarea
            className="form-control mb-2"
            rows="3"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Your Bio"
          />

          <div className="compatibility-section">
            <CompatibilityFields
              form={compatibility}
              onChange={setCompatibility}
              isProfile={true}
            />
          </div>

          <Button onClick={updateProfile} className="mt-2">
            Save Profile
          </Button>
        </div>

        <div className="mb-5">
          <h3>Add New Listing</h3>
          <input
            className="form-control mb-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />
          <input
            className="form-control mb-2"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
          />
          <input
            className="form-control mb-2"
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="Type (room/pg/roommate)"
          />
          <input
            className="form-control mb-2"
            value={rent}
            onChange={(e) => setRent(e.target.value)}
            placeholder="Rent (₹)"
          />
          <input
            className="form-control mb-2"
            value={amenities}
            onChange={(e) => setAmenities(e.target.value)}
            placeholder="Amenities (comma-separated)"
          />
          <textarea
            className="form-control mb-2"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />

          <div className="mb-2">
            <label className="form-label">Listing Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              className="form-control"
              onChange={(e) => {
                const files = Array.from(e.target.files);
                const readers = files.map(
                  (file) =>
                    new Promise((resolve) => {
                      const reader = new FileReader();
                      reader.onloadend = () => resolve(reader.result);
                      reader.readAsDataURL(file);
                    })
                );
                Promise.all(readers).then((images) =>
                  setImageUrl((prev) => [...prev, ...images])
                );
              }}
            />
          </div>

          {imageUrl.length > 0 && (
            <div className="mb-2 d-flex flex-wrap">
              {imageUrl.map((img, idx) => (
                <div
                  key={idx}
                  style={{
                    position: "relative",
                    margin: "5px",
                    width: "100px",
                    height: "100px",
                  }}
                >
                  <img
                    key={idx}
                    src={img}
                    alt="Preview"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      margin: "5px",
                    }}
                  />
                  <button
                    onClick={() =>
                      setImageUrl((prev) => prev.filter((_, i) => i !== idx))
                    }
                    style={{
                      position: "absolute",
                      top: "2px",
                      right: "2px",
                      background: "rgba(0,0,0,0.6)",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "20px",
                      height: "20px",
                      cursor: "pointer",
                      fontSize: "12px",
                      lineHeight: "20px",
                      textAlign: "center",
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {imageUrl.length > 0 && (
            <div className="mb-2 d-flex flex-wrap">
              {imageUrl.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt="Preview"
                  style={{ width: "100px", margin: "5px" }}
                />
              ))}
            </div>
          )}

          <input
            className="form-control mb-2"
            value={latitude}
            placeholder="Latitude (auto-detected)"
            readOnly
          />
          <input
            className="form-control mb-2"
            value={longitude}
            placeholder="Longitude (auto-detected)"
            readOnly
          />

          <Button
            variant="secondary"
            className="me-2"
            onClick={() => {
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
      alert(
        `Location detected:\nLatitude: ${position.coords.latitude}\nLongitude: ${position.coords.longitude}\nAccuracy: ${position.coords.accuracy} meters`
      );
    },
    (error) => {
      console.error("Error detecting location:", error);
      alert("Failed to detect location.");
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    }
  );
} else {
  alert("Geolocation is not supported by your browser.");
}

            }}
          >
            Detect My Location
          </Button>

          <Button
            className="me-2"
            onClick={generateDescription}
            disabled={loadingAI}
          >
            {loadingAI ? "Generating..." : "Generate Description with AI"}
          </Button>

          <Button onClick={addListing}>Add Listing</Button>
        </div>

        <div className="mb-5" id="listings-section">
          <h3>Your Listings</h3>
          {listings.length === 0 ? (
            <p>No listings added yet.</p>
          ) : (
            listings.map((l) => (
              <div key={l._id} className="border rounded p-3 mb-3">
                <h4>{l.title}</h4>
                <p>
                  <strong>City:</strong> {l.city}
                </p>
                <p>
                  <strong>Type:</strong> {l.type}
                </p>
                <p>
                  <strong>Rent:</strong> ₹{l.rent}
                </p>
                {l.amenities?.length > 0 && (
                  <p>
                    <strong>Amenities:</strong> {l.amenities.join(", ")}{" "}
                  </p>
                )}
                <Button variant="danger" onClick={() => deleteListing(l._id)}>
                  Delete
                </Button>
              </div>
            ))
          )}
        </div>

        <div id="bookings-section">
          <h3>Booking Requests</h3>
          {bookings.length === 0 ? (
            <p>No booking requests.</p>
          ) : (
            bookings.map((b) => (
              <div key={b._id} className="border rounded p-3 mb-3">
                <p>
                  <strong>Listing:</strong> {b.listing?.title}
                </p>
                <p>
                  <strong>From:</strong>{" "}
                  {b.requester?.name || b.requester?.email}
                </p>
                <p>
                  <strong>Message:</strong> {b.message}
                </p>
                <p>
                  <strong>Status:</strong> {b.status}
                </p>
                {b.status === "pending" && (
                  <div className="d-flex gap-2 mt-2">
                    <Button
                      onClick={() => handleBookingResponse(b._id, "accepted")}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleBookingResponse(b._id, "rejected")}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
