import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SkillForm from "./components/SkillForm.jsx";
import JobList from "./components/JobList.jsx";
import Signup from "./components/Signup.jsx";
import Login from "./components/Login.jsx";
import Navbar from "./components/Navbar.jsx";
import { API_URL } from "./api";

function App() {
  const [jobs, setJobs] = useState([]);

  const fetchJobs = async (skills) => {
    const response = await fetch(`${API_URL}/jobs/recommend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skills }),
    });
    const data = await response.json();
    setJobs(data);
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        
        <Route path="/skills" element={<SkillForm onSearch={fetchJobs} />} />
        <Route path="/jobs" element={<JobList jobs={jobs} />} />
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
