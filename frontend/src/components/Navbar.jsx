import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // ✅ Detect user or admin
  const token = localStorage.getItem("token");
  const userEmail = localStorage.getItem("userEmail");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const handleLogout = () => {
    if (isAdmin) {
      localStorage.removeItem("isAdmin");
      window.location.href = "/admin-login";
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("userEmail");
      navigate("/login");
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h2
          className="navbar-logo"
          onClick={() => navigate(isAdmin ? "/admin" : "/")}
        >
          Job Portal
        </h2>
      </div>

      <div
        className={`navbar-links ${menuOpen ? "active" : ""}`}
        onClick={() => setMenuOpen(false)}
      >
        {/* ✅ Show for Admin */}
        {isAdmin ? (
          <>
            <Link to="/admin" className="nav-link admin-dashboard">
              Admin Dashboard
            </Link>
            <button
              className="logout-btn admin-logout"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : !token ? (
          <>
            <Link to="/signup" className="nav-link">Signup</Link>
            <Link to="/login" className="nav-link">Login</Link>
          </>
        ) : (
          <>
            <Link to="/skills" className="nav-link">Skills</Link>
            <Link to="/jobs" className="nav-link">Jobs</Link>
            <span className="user-email">{userEmail}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>

      <div
        className={`hamburger ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  );
};

export default Navbar;
