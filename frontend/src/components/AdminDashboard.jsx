import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [applications, setApplications] = useState([]);

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
      await axios.put(`https://jobrecom-backend.onrender.com/api/applications/${id}/status`, { status });
      alert(`Application ${status}`);
      fetchApplications();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className="admin-dashboard">
      <h2>📋 Admin Dashboard — Applications</h2>

      <table>
        <thead>
          <tr>
            <th>Applicant</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Job Title</th>
            <th>Resume</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {applications.length === 0 ? (
            <tr>
              <td colSpan="7">No applications found</td>
            </tr>
          ) : (
            applications.map((app) => (
              <tr key={app._id}>
                <td>{app.name}</td>
                <td>{app.email}</td>
                <td>{app.phone}</td>
                <td>{app.jobId?.title || "N/A"}</td>
                <td>
                  <a
                    href={`https://jobrecom-backend.onrender.com${app.resumeUrl}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Resume
                  </a>
                </td>
                <td>{app.status}</td>
                <td>
                  <button onClick={() => updateStatus(app._id, "Accepted")} className="accept">
                    ✅ Accept
                  </button>
                  <button onClick={() => updateStatus(app._id, "Rejected")} className="reject">
                    ❌ Reject
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
