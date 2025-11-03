import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  name: String,
  email: String,
  phone: String,
  resumeUrl: String,
  status: { type: String, default: "Pending" }
});

export default mongoose.model("Application", applicationSchema);
