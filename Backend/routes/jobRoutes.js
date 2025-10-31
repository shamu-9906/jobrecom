import express from "express";
import Job from "../models/Job.js";

const router = express.Router();

// 🧠 Route 1: Add jobs manually (for testing)
router.post("/add", async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.json({ message: "✅ Job added successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🧠 Route 2: Recommend jobs based on skills
router.post("/recommend", async (req, res) => {
  try {
    const { skills } = req.body; // e.g., ["React", "Node.js"]
    const jobs = await Job.find({ skillsRequired: { $in: skills } });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
