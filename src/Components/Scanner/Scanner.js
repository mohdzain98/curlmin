import React, { useState, useEffect } from "react";
import Quagga from "quagga";
import "./scanner.css";

const Scanner = ({ onDetected }) => {
  const [scannerLinePosition, setScannerLinePosition] = useState(0);
  // Detect callback for Quagga
  const handleDetected = (result) => {
    if (onDetected) {
      onDetected(result);
    }
  };

  useEffect(() => {
    // Initialize Quagga when the component mounts
    Quagga.init(
      {
        inputStream: {
          type: "LiveStream",
          constraints: {
            width: 640,
            height: 320,
            facingMode: "environment",
          },
        },
        locator: {
          halfSample: true,
          patchSize: "large", // x-small, small, medium, large, x-large
          debug: {
            showCanvas: true,
            showPatches: false,
            showFoundPatches: false,
            showSkeleton: false,
            showLabels: false,
            showPatchLabels: false,
            showRemainingPatchLabels: false,
            boxFromPatches: {
              showTransformed: true,
              showTransformedBox: true,
              showBB: true,
            },
          },
        },
        numOfWorkers: 4,
        decoder: {
          readers: ["code_128_reader"],
          debug: {
            drawBoundingBox: true,
            showFrequency: true,
            drawScanline: true,
            showPattern: true,
          },
        },
        locate: true,
      },
      (err) => {
        if (err) {
          console.log("Error initializing Quagga:", err);
          return;
        }
        Quagga.start();
      }
    );

    // Add the detection event listener
    Quagga.onDetected(handleDetected);

    // Cleanup on unmount
    return () => {
      Quagga.offDetected(handleDetected);
      Quagga.stop();
    };
    // eslint-disable-next-line
  }, []); // Empty dependency array ensures this runs only once

  useEffect(() => {
    // Simulate moving scanner line animation
    const interval = setInterval(() => {
      setScannerLinePosition((prev) => (prev >= 80 ? 0 : prev + 2)); // Adjust speed/position
    }, 30);
    return () => clearInterval(interval); // Cleanup interval
  }, []);

  return (
    <div className="scanner-container">
      {/* Quagga renders video here */}
      <div id="interactive" className="viewport">
        {/* Scanner Frame */}
        <div className="scanner-frame">
          <div
            className="scanner-line"
            style={{ top: `${scannerLinePosition}%` }}
          ></div>
        </div>
      </div>
    </div>
    // <div id="interactive" className="viewport" />
  );
};

export default Scanner;
