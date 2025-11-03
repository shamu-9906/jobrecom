// routes/applicationRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import Application from "../models/Application.js";

const router = express.Router();

// ✅ Configure file upload storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// ✅ File type filter (only PDFs)
const fileFilter = (req, file, cb) => {
  const allowedTypes = [".pdf", ".doc", ".docx"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, DOC, and DOCX files are allowed!"), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB
  fileFilter,
});

// ✅ POST — Submit new job application
router.post("/", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Resume file is required!" });
    }

    const { jobId, name, email, phone } = req.body;

    if (!jobId || !name || !email || !phone) {
      return res
        .status(400)
        .json({ error: "Please fill all required fields!" });
    }

    const newApp = new Application({
      jobId,
      name,
      email,
      phone,
      resumeUrl: `/uploads/${req.file.filename}`,
      status: "Pending",
    });

    await newApp.save();
    res
      .status(201)
      .json({ message: "✅ Application submitted successfully!", newApp });
  } catch (err) {
    console.error("❌ Error submitting application:", err);
    res.status(500).json({ error: "Server error while submitting application" });
  }
});

// ✅ GET — Fetch all applications (for admin)
router.get("/", async (req, res) => {
  try {
    const applications = await Application.find().populate("jobId");
    res.status(200).json(applications);
  } catch (err) {
    console.error("❌ Error fetching applications:", err);
    res.status(500).json({ error: "Server error while fetching applications" });
  }
});

// ✅ PUT — Update application status
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Accepted", "Rejected", "Pending"].includes(status)) {
      return res
        .status(400)
        .json({ error: "Invalid status. Use Accepted, Rejected, or Pending." });
    }

    const updatedApp = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedApp) {
      return res.status(404).json({ error: "Application not found!" });
    }

    res.json({ message: `✅ Application ${status}`, updatedApp });
  } catch (err) {
    console.error("❌ Error updating status:", err);
    res.status(500).json({ error: "Server error while updating status" });
  }
});

export default router;
