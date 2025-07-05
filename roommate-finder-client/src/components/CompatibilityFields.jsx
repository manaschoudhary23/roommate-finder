export default function CompatibilityFields({ form, onChange }) {
  const handleInput = (field, value) => {
    onChange(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      <label>Typical daily routine:</label>
      <select value={form.routine} onChange={(e) => handleInput("routine", e.target.value)}>
        <option value="">Select</option>
        <option>Early bird</option>
        <option>Night owl</option>
        <option>Flexible</option>
      </select>

      <label>Cleanliness of shared spaces:</label>
      <select value={form.cleanliness} onChange={(e) => handleInput("cleanliness", e.target.value)}>
        <option value="">Select</option>
        <option>Very clean</option>
        <option>Moderately clean</option>
        <option>Messy</option>
      </select>

      <label>Smoking preference:</label>
      <select value={form.smoking} onChange={(e) => handleInput("smoking", e.target.value)}>
        <option value="">Select</option>
        <option>Yes</option>
        <option>No</option>
        <option>Okay if outside only</option>
      </select>

      <label>Guest frequency:</label>
      <select value={form.guests} onChange={(e) => handleInput("guests", e.target.value)}>
        <option value="">Select</option>
        <option>Often</option>
        <option>Occasionally</option>
        <option>Rarely</option>
        <option>Never</option>
      </select>

      <label>Dietary preference:</label>
      <select value={form.diet} onChange={(e) => handleInput("diet", e.target.value)}>
        <option value="">Select</option>
        <option>Vegetarian</option>
        <option>Non-vegetarian</option>
        <option>Vegan</option>
        <option>Other</option>
      </select>

      <label>Preferred noise level:</label>
      <select value={form.noiseLevel} onChange={(e) => handleInput("noiseLevel", e.target.value)}>
        <option value="">Select</option>
        <option>Very quiet</option>
        <option>Moderate</option>
        <option>Loud/music friendly</option>
      </select>

      <label>Monthly rent budget (₹):</label>
      <input type="number" value={form.budget} onChange={(e) => handleInput("budget", e.target.value)} />

      <label>Sharing utilities & groceries:</label>
      <select value={form.shareUtilities} onChange={(e) => handleInput("shareUtilities", e.target.value)}>
        <option value="">Select</option>
        <option>Yes, I’m comfortable</option>
        <option>Only some (e.g., WiFi but not groceries)</option>
        <option>No, I prefer to keep everything separate</option>
      </select>

      <label>Pets:</label>
      <select value={form.pets} onChange={(e) => handleInput("pets", e.target.value)}>
        <option value="">Select</option>
        <option>I have a pet</option>
        <option>I’m okay with pets</option>
        <option>I’m allergic or uncomfortable</option>
      </select>

      <label>Cooking habits:</label>
      <select value={form.cooking} onChange={(e) => handleInput("cooking", e.target.value)}>
        <option value="">Select</option>
        <option>Cook regularly</option>
        <option>Eat out/order food</option>
        <option>Mix of both</option>
      </select>

      <label>Roommate would describe me as:</label>
      <select value={form.personality} onChange={(e) => handleInput("personality", e.target.value)}>
        <option value="">Select</option>
        <option>Chill & friendly</option>
        <option>Quiet & private</option>
        <option>Organized & rule-oriented</option>
        <option>Social & outgoing</option>
      </select>

      <label>How I handle conflicts:</label>
      <select value={form.conflictStyle} onChange={(e) => handleInput("conflictStyle", e.target.value)}>
        <option value="">Select</option>
        <option>Open discussion</option>
        <option>Text/message communication</option>
        <option>Avoid confrontation</option>
      </select>

      <label>Introvert or Extrovert:</label>
      <select value={form.extroversion} onChange={(e) => handleInput("extroversion", e.target.value)}>
        <option value="">Select</option>
        <option>Very introverted</option>
        <option>Balanced</option>
        <option>Very extroverted</option>
      </select>

      <label>Biggest roommate pet peeves:</label>
      <textarea value={form.petPeeves} onChange={(e) => handleInput("petPeeves", e.target.value)} />

      <label>Hobbies (select multiple):</label>
      <div className="hobby-options">
        {["Gaming", "Watching shows", "Cooking", "Reading", "Gym/yoga", "Partying", "Travel"].map(hobby => (
          <label key={hobby}>
            <input
              type="checkbox"
              checked={form.hobbies.includes(hobby)}
              onChange={() =>
                handleInput("hobbies", form.hobbies.includes(hobby)
                  ? form.hobbies.filter(h => h !== hobby)
                  : [...form.hobbies, hobby]
                )
              }
            />
            {hobby}
          </label>
        ))}
      </div>
    </div>
  );
}
