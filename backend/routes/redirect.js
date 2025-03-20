const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const URL = require("../models/Url");
const Subc = require("../models/Subc");
const Sust = require("../models/Sust");
const Cmqr = require("../models/Cmqr");

const assetDirectories = {
  qr: path.resolve(__dirname, "../../curlmin/build/UserAssets/qrcodes"),
  bc: path.resolve(__dirname, "../../curlmin/build/UserAssets/barcodes"),
  ct: path.resolve(__dirname, "../../curlmin/build/UserAssets/curltags"),
};

router.get("/url/:alias", async (req, res) => {
  const alias = req.params.alias;
  try {
    const urlData = await URL.findOne({ where: { uid: alias } });
    if (urlData) {
      const longUrl = urlData.longUrl;
      res.json({ success: true, urlData, longUrl });
    } else {
      res.status(404).json({ success: false, msg: "URL not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.get("/qrcode/:alias", async (req, res) => {
  const alias = req.params.alias;
  try {
    const qrData = await Cmqr.findOne({ where: { uid: alias } });
    if (qrData) {
      const longUrl = qrData.longUrl;
      res.json({ success: true, longUrl });
    } else {
      res.status(404).json({ success: false, msg: "URL not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.get("/barcode/:alias", async (req, res) => {
  const alias = req.params.alias;
  try {
    const bcData = await Subc.findOne({ where: { uid: alias } });
    if (bcData) {
      const longUrl = bcData.longUrl;
      res.json({ success: true, longUrl });
    } else {
      res.status(404).json({ success: false, msg: "URL not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.get("/curltag/:alias", async (req, res) => {
  const alias = req.params.alias;
  try {
    const ctData = await Sust.findOne({ where: { uid: alias } });
    if (ctData) {
      const longUrl = ctData.longUrl;
      res.json({ success: true, longUrl });
    } else {
      res.status(404).json({ success: false, msg: "URL not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.get("/:type/:id", (req, res) => {
  const { type, id } = req.params;

  // Check if the type is valid
  if (!assetDirectories[type]) {
    return res.status(400).json({ error: "Invalid type" });
  }

  const directory = assetDirectories[type];
  // Read files in the directory
  fs.readdir(directory, (err, files) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Server error" });
    }

    // Find the first matching file
    const file = files.find(
      (file) => file.startsWith(id + "_") && file.endsWith(".png")
    );

    if (file) {
      res.json({ filename: file });
    } else {
      res.status(404).json({ error: "File not found" });
    }
  });
});

module.exports = router;
