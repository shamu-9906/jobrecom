import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route ,Navigate} from "react-router-dom";
import SkillForm from "./components/SkillForm.jsx";
import JobList from "./components/JobList.jsx";
import Signup from "./components/Signup.jsx";
import Login from "./components/Login.jsx";
import Navbar from "./components/Navbar.jsx";
import { API_URL } from "./api";
import AdminDashboard from "./components/AdminDashboard"; 
import AdminLogin from "./components/AdminLogin";

function PrivateRoute({ children }) {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  return isAdmin ? children : <Navigate to="/admin-login" />;
}

function App() {
  const [jobs, setJobs] = useState([]);

  const fetchJobs = async (skills) => {
    try {
      const response = await fetch(`${API_URL}/api/jobs/recommend`, {  // ✅ fixed URL
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch job recommendations");
      }

      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/skills" element={<SkillForm onSearch={fetchJobs} />} />
        <Route path="/jobs" element={<JobList jobs={jobs} />} />
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
         {/* 🔐 Admin routes */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
              <AdminDashboard />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
