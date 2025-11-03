import React, { useEffect, useState } from "react";
import axios from "axios";
import "./JobList.css";

const JobsList = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const user = JSON.parse(localStorage.getItem("user")); // assuming user info saved on login

  // Fetch all jobs
  useEffect(() => {
    fetchJobs();
    if (user?.email) fetchUserApplications();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get("https://jobrecom-backend.onrender.com/api/jobs");
      setJobs(res.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const fetchUserApplications = async () => {
    try {
      const res = await axios.get(
        `https://jobrecom-backend.onrender.com/api/applications/user/${user.email}`
      );
      setApplications(res.data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  // Check if user already applied for a job
  const getApplicationStatus = (jobId) => {
    const application = applications.find(app => app.jobId?._id === jobId);
    return application ? application.status : null;
  };

  const handleApply = async (job) => {
    const alreadyApplied = getApplicationStatus(job._id);
    if (alreadyApplied) {
      alert(`You already applied for this job! (Status: ${alreadyApplied})`);
      return;
    }

    const name = user?.name;
    const email = user?.email;
    const phone = user?.phone;

    try {
      const res = await axios.post("https://jobrecom-backend.onrender.com/api/applications/apply", {
        jobId: job._id,
        name,
        email,
        phone,
      });
      alert(res.data.message);
      fetchUserApplications(); // refresh status
    } catch (err) {
      console.error("Error submitting application:", err);
      alert("Failed to submit application. Please try again.");
    }
  };

  return (
    <div className="job-list">
      <h2>Recommended Jobs</h2>
      <div className="jobs-grid">
        {jobs.map((job) => {
          const status = getApplicationStatus(job._id);
          return (
            <div className="job-card" key={job._id}>
              <h3>{job.title}</h3>
              <p><strong>Company:</strong> {job.company}</p>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Description:</strong> {job.description}</p>

              {status ? (
                <button className={`applied-btn ${status.toLowerCase()}`} disabled>
                  Applied ({status})
                </button>
              ) : (
                <button className="apply-btn" onClick={() => handleApply(job)}>
                  Apply
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default JobsList;
