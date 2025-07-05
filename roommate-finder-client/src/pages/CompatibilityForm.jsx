import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CompatibilityFields from "../components/CompatibilityFields";
import "../styles/CompatibilityForm.css";

export default function CompatibilityForm() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [existingUser, setExistingUser] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
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

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user._id) {
      setExistingUser(true);
    }
  }, []);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSaveForNewUser = async () => {
    setLoading(true);
    const userId = localStorage.getItem("newUserId");

    if (!userId) {
      alert("User ID missing, please register again.");
      navigate("/register");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/user/compatibility/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        alert("Compatibility details saved. Please login.");
        localStorage.removeItem("newUserId");
        navigate("/login");
      } else {
        alert("Error saving data. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Please try later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="compatibility-form">
      <h2>Roommate Compatibility Quiz</h2>

      {/* Step 1: Lifestyle Compatibility */}
      {step === 1 && (
        <div>
          <h3>🛌 A. Lifestyle Compatibility</h3>

          <label>Typical daily routine:</label>
          <select value={form.routine} onChange={(e) => handleChange("routine", e.target.value)}>
            <option value="">Select</option>
            <option>Early bird</option>
            <option>Night owl</option>
            <option>Flexible</option>
          </select>

          <label>Cleanliness of shared spaces:</label>
          <select value={form.cleanliness} onChange={(e) => handleChange("cleanliness", e.target.value)}>
            <option value="">Select</option>
            <option>Very clean</option>
            <option>Moderately clean</option>
            <option>Messy</option>
          </select>

          <label>Smoking preference:</label>
          <select value={form.smoking} onChange={(e) => handleChange("smoking", e.target.value)}>
            <option value="">Select</option>
            <option>Yes</option>
            <option>No</option>
            <option>Okay if outside only</option>
          </select>

          <label>Guest frequency:</label>
          <select value={form.guests} onChange={(e) => handleChange("guests", e.target.value)}>
            <option value="">Select</option>
            <option>Often</option>
            <option>Occasionally</option>
            <option>Rarely</option>
            <option>Never</option>
          </select>

          <label>Dietary preference:</label>
          <select value={form.diet} onChange={(e) => handleChange("diet", e.target.value)}>
            <option value="">Select</option>
            <option>Vegetarian</option>
            <option>Non-vegetarian</option>
            <option>Vegan</option>
            <option>Other</option>
          </select>

          <label>Preferred noise level:</label>
          <select value={form.noiseLevel} onChange={(e) => handleChange("noiseLevel", e.target.value)}>
            <option value="">Select</option>
            <option>Very quiet</option>
            <option>Moderate</option>
            <option>Loud/music friendly</option>
          </select>

          <button
            disabled={
              !form.routine ||
              !form.cleanliness ||
              !form.smoking ||
              !form.guests ||
              !form.diet ||
              !form.noiseLevel
            }
            onClick={nextStep}
          >
            Next
          </button>
        </div>
      )}

      {/* Step 2: Financial & Practical */}
      {step === 2 && (
        <div>
          <h3>💵 B. Financial & Practical</h3>

          <label>Monthly rent budget (₹):</label>
          <input
            type="number"
            value={form.budget}
            onChange={(e) => handleChange("budget", e.target.value)}
          />

          <label>Sharing utilities & groceries:</label>
          <select value={form.shareUtilities} onChange={(e) => handleChange("shareUtilities", e.target.value)}>
            <option value="">Select</option>
            <option>Yes, I’m comfortable</option>
            <option>Only some (e.g., WiFi but not groceries)</option>
            <option>No, I prefer to keep everything separate</option>
          </select>

          <label>Pets:</label>
          <select value={form.pets} onChange={(e) => handleChange("pets", e.target.value)}>
            <option value="">Select</option>
            <option>I have a pet</option>
            <option>I’m okay with pets</option>
            <option>I’m allergic or uncomfortable</option>
          </select>

          <label>Cooking habits:</label>
          <select value={form.cooking} onChange={(e) => handleChange("cooking", e.target.value)}>
            <option value="">Select</option>
            <option>Cook regularly</option>
            <option>Eat out/order food</option>
            <option>Mix of both</option>
          </select>

          <button onClick={prevStep}>Back</button>
          <button
            disabled={!form.budget || !form.shareUtilities || !form.pets || !form.cooking}
            onClick={nextStep}
          >
            Next
          </button>
        </div>
      )}

      {/* Step 3: Personality & Social Fit */}
      {step === 3 && (
        <div>
          <h3>🎯 C. Personality & Social Fit</h3>

          {/* Reusing CompatibilityFields */}
          <CompatibilityFields form={form} onChange={setForm} />

          <button onClick={prevStep}>Back</button>

          {existingUser ? (
            <button className="find-btn" onClick={() => navigate("/roommate-finder", { state: form })}>
              🔍 Find Compatible Roommates
            </button>
          ) : (
            <button disabled={loading} onClick={handleSaveForNewUser}>
              {loading ? "Saving..." : "Save & Go to Login"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
