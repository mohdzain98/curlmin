const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const URL = require("../models/Url");
const Subc = require("../models/Subc");
const Sust = require("../models/Sust");
const Cmqr = require("../models/Cmqr");
const Image = require("../models/Images");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
const REGION = process.env.AWS_S3_REGION_NAME;
const ACCESS_KEY = process.env.AWS_ACCESS_KEY;
const SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

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

router.get("/img/:imageId", async (req, res) => {
  const { imageId } = req.params;
  try {
    const imData = await Image.findOne({ where: { image_id: imageId } });
    if (imData) {
      const image_key = imData.file_key;
      const params = {
        Bucket: BUCKET_NAME,
        Key: image_key,
      };
      const command = new GetObjectCommand(params);
      const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
      res.json({ success: true, url, imData });
    } else {
      res.status(404).json({ success: false, msg: "Image not found" });
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

router.get("/download", async (req, res) => {
  const { uid, ext } = req.query;
  if (!uid || !ext) {
    return res.status(400).send("Missing uid or extension");
  }

  const file_key = `images/${uid}.${ext}`;
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: file_key,
    });

    const s3Response = await s3Client.send(command);

    // Set headers to prompt download
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file_key.split("/").pop()}"`
    );
    res.setHeader(
      "Content-Type",
      s3Response.ContentType || "application/octet-stream"
    );

    // Pipe S3 stream to client
    s3Response.Body.pipe(res);
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).send("Error downloading the file");
  }
});

module.exports = router;
