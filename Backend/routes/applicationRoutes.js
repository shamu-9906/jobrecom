// Backend/routes/applicationRoutes.js
import express from "express";
import Application from "../models/Application.js";

const router = express.Router();

// 📩 Apply for a job
router.post("/apply", async (req, res) => {
  try {
    const { jobId, name, email, phone } = req.body;

    const application = new Application({
      jobId,
      name,
      email,
      phone,
      status: "Pending",
    });

    await application.save();
    res.status(201).json({ message: "Application submitted successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Error submitting application" });
  }
});

// 👀 Get all applications (Admin view)
router.get("/", async (req, res) => {
  try {
    const applications = await Application.find().populate("jobId");
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: "Error fetching applications" });
  }
});

// ✏️ Update status (Approve / Reject)
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;
    await Application.findByIdAndUpdate(req.params.id, { status });
    res.json({ message: `Application ${status}` });
  } catch (err) {
    res.status(500).json({ error: "Error updating status" });
  }
});

// 👤 User-specific applications
router.get("/user/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const applications = await Application.find({ email }).populate("jobId");
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: "Error fetching user applications" });
  }
});

export default router;
