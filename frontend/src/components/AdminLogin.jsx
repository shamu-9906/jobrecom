import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await axios.get("https://jobrecom-backend.onrender.com/api/applications");
      setApplications(res.data);
    } catch (err) {
      console.error("Error fetching applications:", err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`https://jobrecom-backend.onrender.com/api/applications/${id}`, { status });
      alert(`Application ${status}`);
      fetchApplications(); // refresh list
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("isAdmin");
            window.location.href = "/admin-login";
          }}
        >
          Logout
        </button>
      </div>

      <table className="applications-table">
        <thead>
          <tr>
            <th>Applicant</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Job</th>
            <th>Resume</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app._id}>
              <td>{app.name}</td>
              <td>{app.email}</td>
              <td>{app.phone}</td>
              <td>{app.jobId?.title || "N/A"}</td>
              <td>
                <a
                  href={`https://jobrecom-backend.onrender.com${app.resumeUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Resume
                </a>
              </td>
              <td>{app.status || "Pending"}</td>
              <td>
                <button onClick={() => updateStatus(app._id, "Approved")} className="approve-btn">
                  Approve
                </button>
                <button onClick={() => updateStatus(app._id, "Rejected")} className="reject-btn">
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
