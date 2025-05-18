const eventEmitter = require("../eventEmitter");
const UserCounts = require("../models/Urlcount");

eventEmitter.on("updateCount", async ({ userId, type }) => {
  try {
    const incrementField =
      type === "url"
        ? { urlCount: 1 }
        : type === "qr"
        ? { qrCount: 1 }
        : type === "barcode"
        ? { barcodeCount: 1 }
        : type === "curltag"
        ? { curltagCount: 1 }
        : type === "image"
        ? { imageCount: 1 }
        : null;

    await UserCounts.updateOne(
      { userId },
      { $inc: incrementField },
      { upsert: true } // Create a document if it doesn't exist
    );

    console.log(`Updated ${type} count for userId: ${userId}`);
  } catch (error) {
    console.error("Error updating MongoDB count:", error);
  }
});

eventEmitter.on("decrementCount", async ({ userId, type }) => {
  try {
    const decrementField =
      type === "url"
        ? { urlCount: -1 }
        : type === "qr"
        ? { qrCount: -1 }
        : type === "barcode"
        ? { barcodeCount: -1 }
        : type === "curltag"
        ? { curltagCount: -1 }
        : type === "image"
        ? { imageCount: -1 }
        : null;

    await UserCounts.updateOne({ userId }, { $inc: decrementField });

    console.log(`Decremented ${type} count for userId: ${userId}`);
  } catch (error) {
    console.error("Error decrementing MongoDB count:", error);
  }
});
