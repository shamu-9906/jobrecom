import React, { useState } from "react";
import { API_URL } from "../api";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const apiEndpoint = `${API_URL}/api/auth/login`;
      console.log("Sending request to:", apiEndpoint);

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        // ✅ Save token & user email to localStorage
        localStorage.setItem("token", data.token);
        if (data.user && data.user.email) {
          localStorage.setItem("userEmail", data.user.email);
        }

        setMessage("✅ Login successful! Redirecting...");
        setTimeout(() => navigate("/skills"), 2000);
      } else {
        setMessage(`❌ ${data.message || "Login failed. Check credentials."}`);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setMessage("⚠️ Server error. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
            value={formData.email}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            value={formData.password}
            required
          />
          <button type="submit">Login</button>
        </form>
        {message && <p className="login-message">{message}</p>}
      </div>
    </div>
  );
};

export default Login;
