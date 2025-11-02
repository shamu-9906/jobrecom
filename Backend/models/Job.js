import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  description: String,
  skillsRequired: [String], // ✅ This field name matches your query
});

const Job = mongoose.model("Job", jobSchema);
export default Job;
