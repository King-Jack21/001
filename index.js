const express = require("express");
const multer = require("multer");
const fetch = require("node-fetch");
const FormData = require("form-data");

const app = express();
const upload = multer();

app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const form = new FormData();
    form.append("file", req.file.buffer, req.file.originalname);

    const response = await fetch("https://file.io", {
      method: "POST",
      body: form,
    });

    const result = await response.json();

    if (result.success) {
      res.json({ url: result.link });
    } else {
      res.status(500).json({ error: "Upload failed", details: result });
    }
  } catch (err) {
    console.error("Error uploading:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = app;
