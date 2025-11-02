import React, { useState } from "react";
import "./App.css";
import { API_URL } from "./api";
import JobCard from "./components/JobCard";

function App() {
  const [skills, setSkills] = useState("");
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setJobs([]);

    try {
      const response = await fetch(`${API_URL}/api/jobs/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills: skills.split(",").map((s) => s.trim()) }),
      });

      const data = await response.json();

      if (response.ok) {
        setJobs(data);
      } else {
        setError(data.message || "No jobs found.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Try again later.");
    }
  };

  return (
    <div className="App">
      <h1>AI Job Recommendation Portal</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter skills (e.g. React, Node.js)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />
        <button type="submit">Find Jobs</button>
      </form>

      {error && <p className="error">{error}</p>}

      <div className="jobs-container">
        {jobs.map((job, index) => (
          <JobCard key={index} job={job} />
        ))}
      </div>
    </div>
  );
}

export default App;
