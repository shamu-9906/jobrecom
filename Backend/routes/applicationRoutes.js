// routes/applicationRoutes.js
import express from 'express';
import multer from 'multer';
import Application from '../models/Application.js';

const router = express.Router();

// File upload setup
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// ✅ POST new application
router.post('/', upload.single('resume'), async (req, res) => {
  try {
    const newApp = new Application({
      jobId: req.body.jobId,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      resumeUrl: `/uploads/${req.file.filename}`,
      status: 'Pending',
    });
    await newApp.save();
    res.status(200).json({ message: 'Application submitted successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET all applications (Admin)
router.get('/', async (req, res) => {
  try {
    const apps = await Application.find().populate('jobId');
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ PUT to update application status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body; // "Accepted" or "Rejected"
    await Application.findByIdAndUpdate(req.params.id, { status });
    res.json({ message: `Application ${status}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
