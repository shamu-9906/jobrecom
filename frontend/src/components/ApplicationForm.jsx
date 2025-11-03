import React, { useState } from 'react';
import axios from 'axios';
import './ApplicationForm.css';

export default function ApplicationForm({ job, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    resume: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, resume: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('resume', formData.resume);
      data.append('jobId', job._id);

      await axios.post('https://jobrecom-backend.onrender.com/api/applications', data);
      alert('✅ Application submitted successfully!');
      onClose();
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('❌ Failed to submit application. Please try again.');
    }
  };

  return (
    <div className="application-modal">
      <h2>Apply for {job.title}</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          required
        />
        <input
          name="email"
          placeholder="Email"
          type="email"
          onChange={handleChange}
          required
        />
        <input
          name="phone"
          placeholder="Phone"
          type="tel"
          onChange={handleChange}
          required
        />
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          required
        />
        <div className="button-group">
          <button type="submit" className="submit-btn">Submit Application</button>
          <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
