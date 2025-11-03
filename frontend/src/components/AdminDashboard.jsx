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
    <div className="card-container">
  {applications.length === 0 ? (
    <p className="no-data">No applications found.</p>
  ) : (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Job Title</th>
          <th>Company</th>
          <th>Location</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {applications.map((app) => (
          <tr key={app._id}>
            <td>{app.name}</td>
            <td>{app.email}</td>
            <td>{app.phone || "N/A"}</td>
            <td>{app.jobId?.title || "N/A"}</td>
            <td>{app.jobId?.company || "N/A"}</td>
            <td>{app.jobId?.location || "N/A"}</td>
            <td>
              <span className={`status ${app.status.toLowerCase()}`}>
                {app.status}
              </span>
            </td>
            <td>
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
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>

  );
};

export default AdminDashboard;
