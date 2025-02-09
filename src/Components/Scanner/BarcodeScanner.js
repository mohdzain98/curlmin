import React, { useEffect, useState, useRef } from "react";
import Scanner from "./Scanner";
import { Link } from "react-router-dom";

const BarcodeScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState([]);
  const pageOpened = useRef(false);
  useEffect(() => {
    if (
      results.length > 0 &&
      results[0].codeResult &&
      results[0].codeResult.code
    ) {
      if (!pageOpened.current) {
        const url = `https://curlm.in/${encodeURIComponent(
          results[0].codeResult.code
        )}`;
        window.open(url, "barcodeWindow");
        pageOpened.current = true;
      }
    }
  }, [results]);

  const handleDetected = (result) => {
    pageOpened.current = false;
    setResults([result]); // Update results with the new detection
    setScanning(!scanning);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center mb-4">
        <Link to="/" className="btn btn-secondary me-3">
          <i className="fa-solid fa-arrow-left"></i>{" "}
        </Link>
        <h5 className="m-0">Barcode Scanner</h5>
      </div>

      {/* Scanner Area */}
      <Scanner onDetected={handleDetected} />
    </div>
  );
};

export default BarcodeScanner;
