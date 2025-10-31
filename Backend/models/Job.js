import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  description: String,
  skillsRequired: [String],
});

export default mongoose.model("Job", jobSchema);
