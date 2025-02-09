const express = require("express");
const router = express.Router();
const fs = require("fs");
const URL = require("../models/Url");
const Subc = require("../models/Subc");
const Sust = require("../models/Sust");
const Cmqr = require("../models/Cmqr");
const { nanoid } = require("nanoid");
const QRCode = require("qrcode");
const bwipjs = require("bwip-js");
const { loadImage } = require("canvas");
const multer = require("multer");
const { gsnap, gsnap2 } = require("../functions/Functions");
const eventEmitter = require("../eventEmitter");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/createurl", async (req, res) => {
  const {
    userId,
    longUrl,
    pass,
    passval,
    creationDate,
    expiryDate,
    isPermanent,
  } = req.body;
  // Validate input
  if (!longUrl) {
    return res.status(400).json({ error: "longUrl is required." });
  }

  try {
    // Generate a unique alias
    const uid = nanoid(6);

    // Save to the database
    const newUrl = await URL.create({
      userId,
      uid,
      longUrl,
      pass,
      passval,
      creationDate,
      expiryDate,
      isPermanent,
    });
    if (userId) {
      eventEmitter.emit("updateCount", { userId, type: "url" });
    }
    // Construct the short URL
    const shortUrl = `https://curlm.in/${uid}`;

    res.status(200).json({
      message: "URL shortened successfully!",
      shortUrl,
      uid,
      longUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/createqr", async (req, res) => {
  let { userId, url, amount } = req.body;
  const uid = nanoid(6);
  const name = `${uid}_${Date.now()}.png`;
  const filePath = `../public/UserAssets/qrcodes/${name}`;
  try {
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }
    if (url.includes("@")) {
      if (amount < 0 || amount > 100000) {
        return res
          .status(400)
          .json({ error: "Enter valid amount between range 1 to 100000" });
      }
      url =
        amount === ""
          ? `upi://pay?pa=${url}&pn=Payment&cu=INR`
          : `upi://pay?pa=${url}&pn=Payment&am=${amount}&cu=INR`;
    }
    // Generate QR code as base64
    const qrCode = await QRCode.toDataURL(url, {
      width: 300,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });
    await QRCode.toFile(filePath, url);
    const nuid = "qr" + uid;
    const newBc = await Cmqr.create({
      userId: userId,
      uid: nuid,
      longUrl: url,
      filePath: name,
    });
    const shortUrl = `https://curlm.in/${uid}`;

    if (userId) {
      eventEmitter.emit("updateCount", { userId, type: "qr" });
    }
    res.json({ shortUrl, nuid, qrCode, msg: "QR Code Generated Successfully" });
  } catch (error) {
    console.error("Error generating QR code:", error);
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting file during cleanup:", err.message);
        } else {
          console.log("Temporary QR code file removed.");
        }
      });
    }
    res.status(500).json({ error: "Failed to generate QR code" });
  }
});

router.post("/create-barcode", async (req, res) => {
  const { userId, data, path } = req.body;
  const filePath = `../public/UserAssets/barcodes/${path}`;

  if (!data) {
    return res
      .status(400)
      .json({ error: "URL is required to generate a barcode." });
  }

  try {
    // const code = nanoid(6);
    // Generate barcode
    bwipjs.toBuffer(
      {
        bcid: "code128",
        text: data,
        scale: 3,
        height: 15,
        includetext: true,
        textxalign: "center",
        textsize: 10,
        backgroundcolor: "ffffff",
        includetext: true,
        paddingwidth: 15,
        paddingheight: 15,
      },
      (err, png) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Failed to generate barcode." });
        }
        const base64Data = png.toString("base64");
        fs.writeFileSync(filePath, base64Data, { encoding: "base64" });

        if (userId) {
          eventEmitter.emit("updateCount", { userId, type: "barcode" });
        }
        res.json({ image: `data:image/png;base64,${png.toString("base64")}` });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error while generating barcode." });
  }
});

router.post("/save-qrcode", async (req, res) => {
  const { userId, longUrl } = req.body;
  if (!longUrl) {
    return res.status(500).json({ error: "url not found in the request" });
  }

  try {
    const uid = nanoid(6);
    const nuid = "qr" + uid;
    const newBc = await Cmqr.create({
      userId: userId,
      uid: nuid,
      longUrl: longUrl,
    });
    const shortUrl = `https://curlm.in/${uid}`;

    if (userId) {
      eventEmitter.emit("updateCount", { userId, type: "qr" });
    }

    res.status(200).json({
      message: "URL shortened successfully!",
      shortUrl,
      nuid,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "unable to perform certain actions" });
  }
});

router.post("/save-barcode", async (req, res) => {
  const { userId, longUrl } = req.body;
  if (!longUrl) {
    return res.status(500).json({ error: "url not found in the request" });
  }

  try {
    const uid = nanoid(6);
    const nuid = "bc" + uid;
    const name = `${uid}_${Date.now()}.png`;
    const newBc = await Subc.create({
      userId: userId,
      uid: nuid,
      longUrl: longUrl,
      filePath: name,
    });
    const shortUrl = `https://surls.in/${nuid}`;

    res.status(200).json({
      message: "URL shortened successfully!",
      shortUrl,
      nuid,
      name,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "unable to perform certain actions" });
  }
});

router.post("/save-sigmatag", async (req, res) => {
  const { userId, longUrl } = req.body;
  if (!longUrl) {
    return res.status(500).json({ error: "url not found in the request" });
  }

  try {
    const uid = nanoid(6);
    const nuid = "st" + uid;
    const name = `${uid}_${Date.now()}.png`;
    const newBc = await Sust.create({
      userId: userId,
      uid: nuid,
      longUrl: longUrl,
      filePath: name,
    });
    const shortUrl = `https://surls.in/${nuid}`;

    res.status(200).json({
      message: "URL shortened successfully!",
      shortUrl,
      nuid,
      name,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "unable to perform certain actions" });
  }
});

router.post("/createst", upload.single("image"), async (req, res) => {
  try {
    const userId = req.body.userId;
    const image = req.file;
    const url = req.body.url;
    const type = req.body.type;
    const name = req.body.name;
    // const filePath = `./UserAssets/curltags/${name}`;
    const filePath = `../public/UserAssets/curltags/${name}`;

    if (type === 1 && !url) {
      return res.status(400).send("URL is required.");
    } else if (type === 2 && !image && !url) {
      return res.status(400).send("URL and Image both are required");
    }
    let faviconImage = null;
    let usedDefaultIcon = false;
    let snaptagBuffer = null;
    if (type === "2") {
      faviconImage = await loadImage(image.buffer);
      snaptagBuffer = await gsnap2(url, faviconImage);
    } else {
      snaptagBuffer = await gsnap(url);
    }

    const base64Image = `data:image/png;base64,${snaptagBuffer.toString(
      "base64"
    )}`;
    const base64Data = snaptagBuffer.toString("base64");
    fs.writeFileSync(filePath, base64Data, { encoding: "base64" });

    if (userId) {
      eventEmitter.emit("updateCount", { userId, type: "curltag" });
    }

    // Send response
    res.status(200).json({
      image: base64Image,
      usedDefaultIcon,
    });
  } catch (error) {
    console.error("Error generating Snaptag:", error);
    res.status(500).json({ error: "Failed to generate Snaptag" });
  }
});

router.put("/updateuserid", async (req, res) => {
  const { service, userId, uid } = req.body;
  try {
    if (!service || !userId) {
      return res
        .status(400)
        .json({ success: false, msg: "Missing service name or userId" });
    }
    switch (service) {
      case "url":
        const [urlRowsUpdated] = await URL.update(
          { userId },
          { where: { uid } }
        );
        if (urlRowsUpdated === 0) {
          return res.status(404).json({ success: false, msg: "Url not found" });
        }
        eventEmitter.emit("updateCount", { userId, type: "url" });
        break;

      case "qr":
        const [qrRowsUpdated] = await Cmqr.update(
          { userId },
          { where: { uid } }
        );
        if (qrRowsUpdated === 0) {
          return res.status(404).json({ success: false, msg: "QR not found" });
        }
        eventEmitter.emit("updateCount", { userId, type: "qr" });
        break;

      case "barcode":
        const [bcRowsUpdated] = await Subc.update(
          { userId },
          { where: { uid } }
        );
        if (bcRowsUpdated === 0) {
          return res
            .status(404)
            .json({ success: false, msg: "Barcode not found" });
        }
        eventEmitter.emit("updateCount", { userId, type: "barcode" });
        break;

      case "curltag":
        const [ctRowsUpdated] = await Sust.update(
          { userId },
          { where: { uid } }
        );
        if (ctRowsUpdated === 0) {
          return res
            .status(404)
            .json({ success: false, msg: "Curltag not found" });
        }
        eventEmitter.emit("updateCount", { userId, type: "curltag" });
        break;
      default:
        return res
          .status(404)
          .json({ success: false, msg: "Service not found" });
    }
    res.status(200).json({ success: true, msg: "updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
