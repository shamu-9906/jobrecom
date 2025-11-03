import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    const res = await axios.get("http://localhost:5000/api/admin/applications");
    setApplications(res.data);
  };

  const handleAction = async (id, status) => {
    await axios.put(`http://localhost:5000/api/admin/applications/${id}`, { status });
    fetchApplications();
  };

  const handleLogout = () => {
    // Clear any stored token or session data
    localStorage.removeItem("token");
    window.location.href = "/login"; // redirect to login page
  };

  return (
    <div className="admin-container">
      {/* ✅ Navigation Bar */}
      <nav className="admin-navbar">
        <h1 className="nav-title">RetailSync Admin</h1>
        <div className="nav-actions">
          <span className="welcome-text">Welcome, Admin</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* ✅ Main Content */}
      <h2 className="admin-heading">Applications Management</h2>

      <div className="card-container">
        {applications.length === 0 ? (
          <p className="no-data">No applications found.</p>
        ) : (
          applications.map((app) => (
            <div key={app._id} className="card">
              <h3 className="app-name">{app.name}</h3>
              <p><strong>Email:</strong> {app.email}</p>

              {app.jobId && (
                <>
                  <p><strong>Job Title:</strong> {app.jobId.title}</p>
                  <p><strong>Company:</strong> {app.jobId.company}</p>
                  <p><strong>Location:</strong> {app.jobId.location}</p>
                </>
              )}

              <p>
                <strong>Status:</strong>{" "}
                <span className={`status ${app.status.toLowerCase()}`}>
                  {app.status}
                </span>
              </p>

              <div className="btn-group">
                <button
                  className="btn accept-btn"
                  onClick={() => handleAction(app._id, "Accepted")}
                >
                  Accept
                </button>
                <button
                  className="btn reject-btn"
                  onClick={() => handleAction(app._id, "Rejected")}
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
