// const QRCode = require("qrcode");
const { createCanvas, loadImage } = require("canvas");
const bwipjs = require("bwip-js");

const gsnap = async (url) => {
  const canvas = createCanvas(400, 400);
  const ctx = canvas.getContext("2d");

  const checksum =
    Array.from(url).reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360;

  // Set background to white
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, 400, 400);

  // Draw the outer circle
  ctx.beginPath();
  ctx.arc(200, 200, 180, 0, 2 * Math.PI);
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 10;
  ctx.stroke();

  // Draw the segmented outer design
  const segments = 24;
  const angleStep = (2 * Math.PI) / segments;

  for (let i = 0; i < segments; i++) {
    const startAngle = i * angleStep;
    const endAngle = startAngle + angleStep;

    if ((checksum + i) % 3 === 0) {
      ctx.beginPath();
      ctx.arc(200, 200, 180, startAngle, endAngle);
      ctx.arc(200, 200, 120, endAngle, startAngle, true);
      ctx.fillStyle = "#000";
      ctx.fill();
    }
  }

  // Draw the inner circle to separate the outer design from the Data Matrix code
  ctx.beginPath();
  ctx.arc(200, 200, 100, 0, 2 * Math.PI);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 5;
  ctx.stroke();

  // Generate the Data Matrix code
  try {
    const datamatrixBuffer = await new Promise((resolve, reject) => {
      bwipjs.toBuffer(
        {
          bcid: "datamatrix", // Data Matrix barcode
          text: url, // The URL or data to encode
          scale: 3, // Scale factor
          height: 20, // Height in pixels
          width: 20, // Width in pixels
        },
        (err, png) => {
          if (err) {
            reject(err);
          } else {
            resolve(png);
          }
        }
      );
    });

    // Load the Data Matrix code image into the canvas
    const datamatrixImage = await loadImage(datamatrixBuffer);
    ctx.drawImage(datamatrixImage, 150, 150, 100, 100); // Center it in the SnapTag
  } catch (error) {
    console.error("Error generating Data Matrix code:", error);
    return null;
  }

  // Return the canvas as a buffer
  return canvas.toBuffer("image/png");
};

const gsnap2 = async (url, favicon) => {
  const canvas = createCanvas(400, 400);
  const ctx = canvas.getContext("2d");

  const checksum =
    Array.from(url).reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360;

  // Set white background
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, 400, 400);

  // Draw the outer circle
  ctx.beginPath();
  ctx.arc(200, 200, 180, 0, 2 * Math.PI);
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 10;
  ctx.stroke();

  // Draw the segmented outer design
  const segments = 24;
  const angleStep = (2 * Math.PI) / segments;

  for (let i = 0; i < segments; i++) {
    const startAngle = i * angleStep;
    const endAngle = startAngle + angleStep;
    if ((checksum + i) % 3 === 0) {
      ctx.beginPath();
      ctx.arc(200, 200, 180, startAngle, endAngle);
      ctx.arc(200, 200, 120, endAngle, startAngle, true);
      ctx.fillStyle = "#000";
      ctx.fill();
    }
  }
  // Draw the inner circle to separate the outer design from the Data Matrix code
  ctx.beginPath();
  ctx.arc(200, 200, 100, 0, 2 * Math.PI);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 5;
  ctx.stroke();

  try {
    const qrCodeBuffer = await new Promise((resolve, reject) => {
      bwipjs.toBuffer(
        {
          bcid: "datamatrix",
          text: url,
          scale: 3, // Adjust the scale as needed
          includetext: false,
          height: 20, // Height in pixels
          width: 20, // Width in pixels
          backgroundcolor: "", // Background color (white in hex)
          foregroundcolor: "#000",
        },
        (err, png) => {
          if (err) {
            reject(err);
          } else {
            resolve(png);
          }
        }
      );
    });

    // Resize image to fit the inner circle
    const innerCircleSize = 100; // Size of the inner circle
    const iconSize = innerCircleSize * 2; // Size of the image (twice the inner circle size)
    const iconX = (400 - iconSize) / 2; // Center the image horizontally
    const iconY = (400 - iconSize) / 2; // Center the image vertically

    // Draw the image with low opacity
    ctx.globalAlpha = 0.7; // Set opacity (lower for transparency)
    ctx.beginPath();
    ctx.arc(200, 200, innerCircleSize, 0, 2 * Math.PI); // Draw the inner circle
    ctx.clip();
    ctx.drawImage(favicon, iconX, iconY, iconSize, iconSize);
    ctx.globalAlpha = 1.0; // Reset opacity to 1 for subsequent drawing

    // Draw the QR code on top of the image
    const qrImage = await loadImage(qrCodeBuffer);
    ctx.drawImage(qrImage, 150, 150, 100, 100);
  } catch (error) {
    console.error("Error generating Data Matrix code:", error);
    return null;
  }

  // Return the final image as a buffer
  return canvas.toBuffer("image/png");
};

module.exports = {
  gsnap,
  gsnap2,
};
