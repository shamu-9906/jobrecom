import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  name: String,
  email: String,
  phone: String,
  resumeUrl: String,
  status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' }
});

export default mongoose.model('Application', ApplicationSchema);
