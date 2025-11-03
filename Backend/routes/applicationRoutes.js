// 📩 Apply for a job
router.post("/apply", async (req, res) => {
  try {
    const { jobId, name, email, phone } = req.body;
    console.log("Incoming application:", req.body);

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
    console.error("❌ Error submitting application:", err);
    res.status(500).json({ error: "Error submitting application" });
  }
});
