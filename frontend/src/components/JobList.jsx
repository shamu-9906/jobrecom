import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./JobList.css";

function JobList() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFormForJob, setShowFormForJob] = useState(null); // 👈 Track which job form is open
  const [formData, setFormData] = useState({ name: "", email: "", resume: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const userEmail = localStorage.getItem("userEmail");
  const skills = location.state?.skills || ""; // skills passed from Skills.jsx

  // ✅ Fetch jobs and user applications
  useEffect(() => {
    const fetchData = async () => {
      try {
        let jobsRes;

        if (skills) {
          jobsRes = await axios.post(
            "https://jobrecom-backend.onrender.com/api/jobs/recommend",
            { skills }
          );
        } else {
          jobsRes = { data: [] };
        }

        setJobs(jobsRes.data);

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

  // ✅ Handle form field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle job application
  const handleSubmit = async (e, jobId) => {
    e.preventDefault();
    try {
      await axios.post("https://jobrecom-backend.onrender.com/api/applications", {
        jobId,
        name: formData.name,
        email: formData.email,
        resume: formData.resume,
      });
      setMessage("✅ Application submitted successfully!");
      setShowFormForJob(null);
      // Optionally refetch applications to update status
      const appsRes = await axios.get(
        `https://jobrecom-backend.onrender.com/api/applications/user/${userEmail}`
      );
      setApplications(appsRes.data);
    } catch (err) {
      console.error("Error applying:", err);
      setMessage("❌ Failed to apply. Try again.");
    }
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
                  <>
                    <button
                      className="apply-btn"
                      onClick={() =>
                        setShowFormForJob(
                          showFormForJob === job._id ? null : job._id
                        )
                      }
                    >
                      {showFormForJob === job._id ? "Cancel" : "Apply"}
                    </button>

                    {/* Inline Apply Form */}
                    {showFormForJob === job._id && (
                      <form
                        className="inline-apply-form"
                        onSubmit={(e) => handleSubmit(e, job._id)}
                      >
                        <input
                          type="text"
                          name="name"
                          placeholder="Your Name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                        <input
                          type="email"
                          name="email"
                          placeholder="Your Email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                        <textarea
                          name="resume"
                          placeholder="Paste your resume text here"
                          value={formData.resume}
                          onChange={handleChange}
                          required
                        ></textarea>
                        <button type="submit">Submit</button>
                      </form>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {message && <p className="apply-message">{message}</p>}
    </div>
  );
}

export default JobList;
