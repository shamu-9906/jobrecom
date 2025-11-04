import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./JobList.css";
import Footer from "./Footer"; // ✅ Correct import

function JobList() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    resumeUrl: "",
  });
  const [activeJobId, setActiveJobId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const userEmail = localStorage.getItem("userEmail");
  const skills = location.state?.skills || [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        let jobsRes;
        if (skills.length > 0) {
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

  const handleApplyClick = (jobId) => {
    setActiveJobId(jobId === activeJobId ? null : jobId);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e, jobId) => {
    e.preventDefault();
    try {
      await axios.post("https://jobrecom-backend.onrender.com/api/applications/apply", {
        jobId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        resumeUrl: formData.resumeUrl,
      });

      alert("✅ Application submitted successfully!");
      setFormData({ name: "", email: "", phone: "", resumeUrl: "" });
      setActiveJobId(null);

      const appsRes = await axios.get(
        `https://jobrecom-backend.onrender.com/api/applications/user/${userEmail}`
      );
      setApplications(appsRes.data);
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("❌ Failed to submit application");
    }
  };

  const handleRetry = () => {
    navigate("/skills");
  };

  if (loading) return <p>Loading jobs...</p>;

  return (
    <>
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
              const applied = applications.find((a) => a.jobId?._id === job._id);

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
                        onClick={() => handleApplyClick(job._id)}
                      >
                        {activeJobId === job._id ? "Cancel" : "Apply"}
                      </button>

                      {activeJobId === job._id && (
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
                          <input
                            type="text"
                            name="phone"
                            placeholder="Your Phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                          />
                          <input
                            type="text"
                            name="resumeUrl"
                            placeholder="Resume URL (Google Drive / Link)"
                            value={formData.resumeUrl}
                            onChange={handleChange}
                          />
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
      </div>

      {/* ✅ Add footer correctly */}
      <Footer />
    </>
  );
}

export default JobList;
