const express = require("express");
const multer = require("multer");
const fetch = require("node-fetch");
const FormData = require("form-data");
const fs = require("fs");

const app = express();
const upload = multer({ dest: "/tmp" }); // folder sementara (boleh di Vercel)

app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    const form = new FormData();
    form.append("file", fs.createReadStream(req.file.path));

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
    res.status(500).json({ error: err.message });
  }
});

module.exports = app;
