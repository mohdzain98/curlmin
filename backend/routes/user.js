const express = require("express");
const router = express.Router();
const fs = require("fs");
const Url = require("../models/Url");
const Cmqr = require("../models/Cmqr");
const Sust = require("../models/Sust");
const Subc = require("../models/Subc");
const User = require("../models/User");
const Images = require("../models/Images");
const UserCounts = require("../models/Urlcount");
const eventEmitter = require("../eventEmitter");
const bcrypt = require("bcryptjs");
const { sequelize } = require("../mysql");
const fpath = process.env.ASSETS_PATH;
const {
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
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

const deleteFromFolder = async (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file during cleanup:", err.message);
        return false;
      } else {
        console.log("Temporary QR code file removed.");
        return true;
      }
    });
  }
};

router.post("/getudata", async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ success: false, msg: "User ID is required" });
  }
  try {
    const data = await UserCounts.findOne({ userId });
    if (data) {
      res.json({ success: true, data });
    } else {
      res.status(400).json({ success: false, msg: "You have no data to show" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Some Error Occured");
  }
});

router.post("/geturls", async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ success: false, msg: "User ID is required" });
  }
  try {
    const urls = await Url.findAll({ where: { userId } });
    if (urls) {
      res.json({ success: true, urls });
    } else {
      res.status(400).json({ success: false, msg: "You have no data to show" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, msg: "Error fetching URLs" });
  }
});

router.post("/getqrcodes", async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ success: false, msg: "User ID is required" });
  }
  try {
    const qrcodes = await Cmqr.findAll({ where: { userId } });
    if (qrcodes) {
      res.json({ success: true, qrcodes });
    } else {
      res.status(400).json({ success: false, msg: "You have no data to show" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, msg: "Error fetching URLs" });
  }
});

router.post("/getcurltags", async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ success: false, msg: "User ID is required" });
  }
  try {
    const curltags = await Sust.findAll({ where: { userId } });
    if (curltags) {
      res.json({ success: true, curltags });
    } else {
      res.status(400).json({ success: false, msg: "You have no data to show" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, msg: "Error fetching URLs" });
  }
});

router.post("/getbarcodes", async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ success: false, msg: "User ID is required" });
  }
  try {
    const barcodes = await Subc.findAll({ where: { userId } });
    if (barcodes) {
      res.json({ success: true, barcodes });
    } else {
      res.status(400).json({ success: false, msg: "You have no data to show" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, msg: "Error fetching URLs" });
  }
});

router.post("/getimages", async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ success: false, msg: "User ID is required" });
  }
  try {
    const images = await Images.findAll({ where: { userId } });
    if (images) {
      const signedImages = await Promise.all(
        images.map(async (image) => {
          const signedUrl = await getSignedUrl(
            s3Client,
            new GetObjectCommand({
              Bucket: BUCKET_NAME,
              Key: image.file_key,
            }),
            { expiresIn: 3600 }
          ); // URL valid for 1 hour

          return { imageKey: image.image_id, signedUrl };
        })
      );
      const mergedImages = images.map((image) => ({
        ...image.dataValues, // Extracts sequelize object values
        signedUrl: signedImages.find((si) => si.imageKey === image.image_id)
          ?.signedUrl,
      }));

      res.json({ success: true, images: mergedImages });
    } else {
      res.status(400).json({ success: false, msg: "You have no data to show" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, msg: "Error fetching Images" });
  }
});

router.delete("/deleteurl/:uid", async (req, res) => {
  const { uid } = req.params;
  const { userId } = req.body;
  try {
    const url = await Url.findOne({ where: { uid } });

    if (!url) {
      return res.status(404).json({ success: false, msg: "URL not found" });
    }
    await Url.destroy({ where: { uid } });

    if (userId) {
      eventEmitter.emit("decrementCount", { userId, type: "url" });
    }
    res.status(200).json({ success: true, msg: "URL deleted successfully" });
  } catch (err) {
    console.error("Error deleting URL:", err);
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
});

router.delete("/deleteqr/:uid", async (req, res) => {
  const { uid } = req.params;
  const { userId, path } = req.body;
  const filePath = `${fpath}/qrcodes/${path}`;

  try {
    const url = await Cmqr.findOne({ where: { uid } });
    if (!url) {
      return res.status(404).json({ success: false, msg: "QR not found" });
    }
    await Cmqr.destroy({ where: { uid } });
    if (userId) {
      eventEmitter.emit("decrementCount", { userId, type: "qr" });
    }
    try {
      await deleteFromFolder(filePath);
    } catch (error) {}
    res.status(200).json({ success: true, msg: "URL deleted successfully" });
  } catch (err) {
    console.error("Error deleting QR:", err);
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
});

router.delete("/deletect/:uid", async (req, res) => {
  const { uid } = req.params;
  const { userId, path } = req.body;
  const filePath = `${fpath}/curltags/${path}`;

  try {
    const url = await Sust.findOne({ where: { uid } });
    if (!url) {
      return res.status(404).json({ success: false, msg: "Curltag not found" });
    }
    await Sust.destroy({ where: { uid } });
    if (userId) {
      eventEmitter.emit("decrementCount", { userId, type: "curltag" });
    }
    try {
      await deleteFromFolder(filePath);
    } catch (error) {
      console.log(error);
    }
    res
      .status(200)
      .json({ success: true, msg: "curltag deleted successfully" });
  } catch (err) {
    console.error("Error deleting QR:", err);
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
});

router.delete("/deletebc/:uid", async (req, res) => {
  const { uid } = req.params;
  const { userId, path } = req.body;
  const filePath = `${fpath}/barcodes/${path}`;

  try {
    const url = await Subc.findOne({ where: { uid } });
    if (!url) {
      return res.status(404).json({ success: false, msg: "Barcode not found" });
    }
    await Subc.destroy({ where: { uid } });
    if (userId) {
      eventEmitter.emit("decrementCount", { userId, type: "barcode" });
    }
    try {
      const del = await deleteFromFolder(filePath);
      if (del) {
        console.log("deleted");
      }
    } catch (error) {
      console.log(error);
    }
    res
      .status(200)
      .json({ success: true, msg: "Barcode deleted successfully" });
  } catch (err) {
    console.error("Error deleting QR:", err);
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
});

router.delete("/deleteimg/:uid", async (req, res) => {
  const { uid } = req.params;
  const { userId } = req.body;

  try {
    const img = await Images.findOne({ where: { image_id: uid } });
    if (!img) {
      return res.status(404).json({ success: false, msg: "Image not found" });
    }
    await Images.destroy({ where: { image_id: uid } });
    if (userId) {
      eventEmitter.emit("decrementCount", { userId, type: "image" });
    }
    const fileKey = img.file_key;

    // Delete the file from S3
    try {
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: BUCKET_NAME,
          Key: fileKey,
        })
      );
    } catch (error) {
      console.log(error);
    }
    res.status(200).json({ success: true, msg: "Image deleted successfully" });
  } catch (err) {
    console.error("Error deleting QR:", err);
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
});

router.put("/updatename/:id", async (req, res) => {
  const { name } = req.body;
  console.log("updating recieved name:", name);
  if (!name) {
    res.status(404).json({ msg: "name not found in the request" });
  }
  try {
    const update = await User.findByIdAndUpdate(
      req.params.id,
      { name: name },
      { new: true }
    );
    if (update) {
      res.json({ success: true, val: update, msg: "updated successfully" });
    } else {
      res.json({ success: false, val: update, msg: "Name not updated" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/checkpass", async (req, res) => {
  const { userId, cpass } = req.body;
  console.log(userId, cpass);

  try {
    if (!userId || !cpass) {
      res
        .status(404)
        .json({ success: false, msg: "Missing userId or password." });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found." });
    }
    const isMatch = await bcrypt.compare(cpass, user.password);
    console.log(user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, msg: "Incorrect Current Password." });
    }

    res.status(200).json({ success: true, msg: "Password is correct." });
  } catch (error) {
    console.error("Error in check-password API:", error);
    res.status(500).send("Internel Server Error");
  }
});

router.delete("/delete-user", async (req, res) => {
  const { userId } = req.body;
  try {
    const deletedUser = await User.findOneAndDelete({ _id: userId });
    if (!deletedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    try {
      const data = await UserCounts.findOne({ userId });
      await UserCounts.findOneAndDelete({ userId: userId });
      await sequelize.transaction(async (t) => {
        if (data.urlCount > 0) {
          await Url.destroy({ where: { userId }, transaction: t });
        }
        if (data.qrCount > 0) {
          const qrs = await Cmqr.findAll({ where: { userId } });
          for (const item of qrs) {
            await deleteFromFolder(`${fpath}/qrcodes/${item.filePath}`);
          }
          await Cmqr.destroy({ where: { userId }, transaction: t });
        }
        if (data.barcodeCount > 0) {
          const bcs = await Subc.findAll({ where: { userId } });
          for (const item of bcs) {
            await deleteFromFolder(`${fpath}/barcodes/${item.filePath}`);
          }
          await Subc.destroy({ where: { userId }, transaction: t });
        }
        if (data.curltagCount > 0) {
          const cts = await Sust.findAll({ where: { userId } });
          for (const item of cts) {
            await deleteFromFolder(`${fpath}/curltags/${item.filePath}`);
          }
          await Sust.destroy({ where: { userId }, transaction: t });
        }
      });
    } catch (error) {}
    res.status(200).json({
      success: true,
      message: "User and associated data deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete user and associated data",
    });
  }
});

module.exports = router;
