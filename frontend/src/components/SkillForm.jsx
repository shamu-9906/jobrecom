import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SkillForm.css";

function SkillForm({ onSearch }) {
  const [skills, setSkills] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (skills.trim()) {
      const skillList = skills.split(",").map((skill) => skill.trim());
      onSearch(skillList); // fetch job data
      navigate("/jobs"); // redirect to jobs page
    }
  };

  return (
    <form className="skill-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
        placeholder="Enter your skills (comma separated)"
      />
      <button type="submit">Find Jobs</button>
    </form>
  );
}

export default SkillForm;
