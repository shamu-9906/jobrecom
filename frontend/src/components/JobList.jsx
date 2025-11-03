import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./JobList.css";

function JobList() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const userEmail = localStorage.getItem("userEmail");
  const skills = location.state?.skills || ""; // 👈 skills passed from Skills.jsx

  useEffect(() => {
    const fetchData = async () => {
      try {
        let jobsRes;

        // ✅ Fetch jobs based on skills
        if (skills) {
          jobsRes = await axios.post(
            "https://jobrecom-backend.onrender.com/api/jobs/recommend",
            { skills }
          );
        } else {
          jobsRes = { data: [] };
        }

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
  }, [skills, userEmail]);

  const handleApply = (jobId) => {
    navigate(`/apply/${jobId}`);
  };

  const handleRetry = () => {
    navigate("/skills");
  };

  if (loading) return <p>Loading jobs...</p>;

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
