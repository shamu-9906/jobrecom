import express from "express";
import Application from "../models/Application.js";

const router = express.Router();

// ✅ Fetch all applications
router.get("/applications", async (req, res) => {
  try {
    const applications = await Application.find().populate("jobId");
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ Update application status
router.put("/applications/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const updatedApp = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(updatedApp);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
