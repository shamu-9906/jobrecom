import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApplicationForm from "./ApplicationForm"; // import the form component
import "./JobList.css";

function JobList({ jobs }) {
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState(null);

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
        <div className="job-grid">
          {jobs.map((job, index) => (
            <div key={index} className="job-card">
              <h3>{job.title}</h3>
              <p><strong>Company:</strong> {job.company}</p>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Description:</strong> {job.description}</p>
              <button
                className="apply-btn"
                onClick={() => setSelectedJob(job)}
              >
                Apply
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedJob && (
        <ApplicationForm
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
}

export default JobList;
