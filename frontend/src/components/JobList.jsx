import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./JobList.css";

function JobList() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ Fetch all jobs
        const jobsRes = await axios.get("https://jobrecom-backend.onrender.com/api/jobs");
        setJobs(jobsRes.data);

        // ✅ Fetch user applications
        if (userEmail) {
          const appsRes = await axios.get(
            `https://jobrecom-backend.onrender.com/api/applications/user/${userEmail}`
          );
          setApplications(appsRes.data);
        }
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userEmail]);

  const handleApply = (jobId) => {
    navigate(`/apply/${jobId}`);
  };

  if (loading) return <p>Loading jobs...</p>;

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
          {jobs.map((job) => {
            const applied = applications.find(
              (a) => a.jobId?._id === job._id
            );

            return (
              <div key={job._id} className="job-card">
                <h3>{job.title}</h3>
                <p><strong>Company:</strong> {job.company}</p>
                <p><strong>Location:</strong> {job.location}</p>
                <p><strong>Description:</strong> {job.description}</p>

                {applied ? (
                  <p className={`status ${applied.status.toLowerCase()}`}>
                    ✅ Applied ({applied.status})
                  </p>
                ) : (
                  <button
                    className="apply-btn"
                    onClick={() => handleApply(job._id)}
                  >
                    Apply
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default JobList;
