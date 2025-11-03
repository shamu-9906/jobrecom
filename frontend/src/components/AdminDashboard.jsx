import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [applications, setApplications] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await axios.get("https://jobrecom-backend.onrender.com/api/applications");
      setApplications(res.data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  const handleDecision = async (id, status) => {
    try {
      await axios.put(`https://jobrecom-backend.onrender.com/api/applications/${id}`, { status });
      alert(`Application ${status} successfully!`);
      fetchApplications();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    window.location.href = "/admin-login";
  };

  return (
    <div className="admin-dashboard">
      {/* ✅ Header */}
      <header className="admin-header">
        <h2>Admin Dashboard</h2>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {/* ✅ Applications Table */}
      <div className="applications-container">
        <h3>Job Applications</h3>
        {applications.length === 0 ? (
          <p className="no-applications">No applications found.</p>
        ) : (
          <table className="applications-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Resume</th>
                <th>Job Title</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id}>
                  <td>{app.name}</td>
                  <td>{app.email}</td>
                  <td>{app.phone}</td>
                  <td>
                    <button
                      className="view-resume-btn"
                      onClick={() =>
                        setSelectedResume(
                          `https://jobrecom-backend.onrender.com/uploads/${app.resume}`
                        )
                      }
                    >
                      View Resume
                    </button>
                  </td>
                  <td>{app.jobTitle || "N/A"}</td>
                  <td className={`status ${app.status}`}>{app.status}</td>
                  <td>
                    <button
                      className="approve-btn"
                      onClick={() => handleDecision(app._id, "approved")}
                    >
                      Approve
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => handleDecision(app._id, "rejected")}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ✅ Resume Preview Modal */}
      {selectedResume && (
        <div className="resume-modal-overlay" onClick={() => setSelectedResume(null)}>
          <div className="resume-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Resume Preview</h3>
            <iframe
              src={selectedResume}
              title="Resume Preview"
              width="100%"
              height="500px"
              style={{ borderRadius: "8px", border: "1px solid #ccc" }}
            />
            <button className="close-modal-btn" onClick={() => setSelectedResume(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
