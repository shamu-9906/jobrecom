import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [applications, setApplications] = useState([]);

  // ✅ Redirect if admin not logged in
  useEffect(() => {
    const admin = localStorage.getItem("admin");
    if (!admin) {
      window.location.href = "/admin-login";
    } else {
      fetchApplications();
    }
  }, []);

  // ✅ Fetch applications
  const fetchApplications = async () => {
    try {
      const res = await axios.get("https://jobrecom-backend.onrender.com/api/admin/applications");
      setApplications(res.data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  // ✅ Handle Accept / Reject
  const handleAction = async (id, status) => {
    try {
      await axios.put(`https://jobrecom-backend.onrender.com/api/admin/applications/${id}`, { status });
      fetchApplications(); // refresh list
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };

  // ✅ Handle logout
  const handleLogout = () => {
    localStorage.removeItem("admin");
    window.location.href = "/admin-login";
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
              <p><strong>Phone:</strong> {app.phone || "N/A"}</p>

              {app.jobId && (
                <>
                  <p><strong>Applied Job:</strong> {app.jobId.title}</p>
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
                  Approve
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
