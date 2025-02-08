const express = require("express");
const router = express.Router();
const URL = require("../models/Url");
const Subc = require("../models/Subc");
const Sust = require("../models/Sust");
const Cmqr = require("../models/Cmqr");

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

router.get("/qr/:alias", async (req, res) => {
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

module.exports = router;
