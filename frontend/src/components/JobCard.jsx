import React from "react";
import "./JobCard.css"; // optional — for styling if you want custom look

function JobCard({ job }) {
  return (
    <div className="job-card">
      <h3>{job.title}</h3>
      <p><strong>Company:</strong> {job.company}</p>
      <p><strong>Location:</strong> {job.location}</p>
      <p><strong>Description:</strong> {job.description}</p>
      {job.skillsRequired && job.skillsRequired.length > 0 && (
        <p>
          <strong>Skills Required:</strong> {job.skillsRequired.join(", ")}
        </p>
      )}
    </div>
  );
}

export default JobCard;
