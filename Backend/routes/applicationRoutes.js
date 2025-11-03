import express from "express";
import multer from "multer";
import Application from "../models/Application.js";

const router = express.Router();

// ⚙️ File upload setup
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// 🧠 Route 1: Submit a new job application
router.post("/submit", upload.single("resume"), async (req, res) => {
  try {
    const newApp = new Application({
      jobId: req.body.jobId,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      resumeUrl: `/uploads/${req.file.filename}`,
    });

    await newApp.save();
    res.json({ message: "✅ Application submitted successfully!" });
  } catch (err) {
    console.error("Error in /submit:", err);
    res.status(500).json({ error: err.message });
  }
});

// 🧠 Route 2: Get all applications (Admin view)
router.get("/all", async (req, res) => {
  try {
    const apps = await Application.find().populate("jobId");
    res.json(apps);
  } catch (err) {
    console.error("Error in /all:", err);
    res.status(500).json({ error: err.message });
  }
});

// 🧠 Route 3: Update application status (Accept/Reject)
router.patch("/update/:id", async (req, res) => {
  try {
    const { status } = req.body;
    await Application.findByIdAndUpdate(req.params.id, { status });
    res.json({ message: `✅ Application ${status}` });
  } catch (err) {
    console.error("Error in /update:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
