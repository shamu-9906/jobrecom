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

// 🧠 Route 2: Recommend jobs based on skills (fixed)
router.post("/recommend", async (req, res) => {
  try {
    const { skills } = req.body; // e.g., "css" or ["React", "Node.js"]

    if (!skills || skills.length === 0) {
      return res.status(400).json({ message: "No skills provided" });
    }

    // Support both string and array input
    const skillQuery = Array.isArray(skills) ? skills.join("|") : skills;

    // ✅ Match jobs that contain any of the skills (case-insensitive)
    const jobs = await Job.find({
      skillsRequired: { $regex: skillQuery, $options: "i" },
    });

    if (jobs.length === 0) {
      return res.status(404).json({ message: "No jobs found for given skills" });
    }

    res.json(jobs);
  } catch (err) {
    console.error("Error in /recommend:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
