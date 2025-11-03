import React, { useState } from 'react';
import axios from 'axios';

export default function ApplicationForm({ job, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    resume: null,
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = e => {
    setFormData(prev => ({ ...prev, resume: e.target.files[0] }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('phone', formData.phone);
    data.append('resume', formData.resume);
    data.append('jobId', job._id);

    await axios.post('/api/applications', data);
    alert('Application submitted!');
    onClose();
  };

  return (
    <div className="application-modal">
      <h2>Apply for {job.title}</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Full Name" onChange={handleChange} required />
        <input name="email" placeholder="Email" onChange={handleChange} required />
        <input name="phone" placeholder="Phone" onChange={handleChange} required />
        <input type="file" accept=".pdf" onChange={handleFileChange} required />
        <button type="submit">Submit Application</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
}

