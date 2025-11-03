import React, { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [applications, setApplications] = useState([]);

  // Fetch all job applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/applications");
        const data = await res.json();
        setApplications(data);
      } catch (err) {
        console.error("Error fetching applications:", err);
      }
    };
    fetchApplications();
  }, []);

  // Update application status
  const handleStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/applications/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        alert(`Application ${status}`);
        setApplications((prev) =>
          prev.map((app) => (app._id === id ? { ...app, status } : app))
        );
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  // Logout admin
  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    window.location.href = "/admin-login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-pink-100 p-8">
      {/* Header */}
      <div className="bg-gray-900 text-white py-6 px-8 rounded-xl shadow-lg flex justify-between items-center">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white font-semibold"
        >
          Logout
        </button>
      </div>

      {/* Table */}
      <div className="mt-8 bg-white rounded-xl shadow-lg p-6 overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Phone</th>
              <th className="py-3 px-4 text-left">Job</th>
              <th className="py-3 px-4 text-left">Company</th>
              <th className="py-3 px-4 text-left">Location</th>
              <th className="py-3 px-4 text-left">Resume</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.length > 0 ? (
              applications.map((app) => (
                <tr key={app._id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4">{app.email}</td>
                  <td className="py-3 px-4">{app.phone}</td>
                  <td className="py-3 px-4">{app.jobTitle}</td>
                  <td className="py-3 px-4">{app.company}</td>
                  <td className="py-3 px-4">{app.location}</td>
                  <td className="py-3 px-4">
                    <a
                      href={`http://localhost:5000/uploads/${app.resume}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      View Resume
                    </a>
                  </td>
                  <td className="py-3 px-4 font-semibold">{app.status}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleStatus(app._id, "Approved")}
                      className="bg-green-600 text-white px-3 py-1 rounded mr-2 hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatus(app._id, "Rejected")}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="text-center py-6 text-gray-500 font-semibold"
                >
                  No applications found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
