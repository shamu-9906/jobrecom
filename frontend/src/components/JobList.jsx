import React from "react";
import { useNavigate } from "react-router-dom";
import "./JobList.css";

function JobList({ jobs }) {
  const navigate = useNavigate();

  const handleRetry = () => {
    navigate("/skills");
  };

  return (
    <div className="job-list-container">
      <h2>Recommended Jobs</h2>

      {jobs.length === 0 ? (
        <div className="no-jobs">
          <p>No jobs found. Try different skills.</p>
          <button className="retry-btn" onClick={handleRetry}>
            🔁 Retry
          </button>
        </div>
      ) : (
        <ul>
          {jobs.map((job, index) => (
            <li key={index}>
              <h3>{job.title}</h3>
              <p><strong>Company:</strong> {job.company}</p>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Description:</strong> {job.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default JobList;
