import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  resumeUrl: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    default: "Pending",
  },
}, { timestamps: true });

export default mongoose.model("Application", applicationSchema);
