import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Register.css';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    contact: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const nameRegex = /^[a-zA-Z ]{3,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const contactRegex = /^[0-9]{10}$/;

    if (!nameRegex.test(form.name)) {
      alert("Name should contain at least 3 letters and no special characters.");
      return false;
    }

    if (!emailRegex.test(form.email)) {
      alert("Please enter a valid email address.");
      return false;
    }

    if (!contactRegex.test(form.contact)) {
      alert("Contact number must be exactly 10 digits.");
      return false;
    }

    if (form.password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return false;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          contact: form.contact,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Registration successful! Please complete your Compatibility Preferences.');
        localStorage.setItem('newUserId', data._id);
        navigate('/compatibility');
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Something went wrong');
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="register-form">
        
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label>Contact No. :</label>
        <input
          type="text"
          name="contact"
          value={form.contact}
          onChange={handleChange}
          required
        />

        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <label>Confirm Password:</label>
        <input
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        <button type="submit">Register</button>
      </form>
    </div>
  );
}
