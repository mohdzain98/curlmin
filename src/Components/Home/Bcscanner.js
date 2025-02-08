import React from "react";
import { useNavigate } from "react-router-dom";

const Bcscanner = () => {
  const navigate = useNavigate();
  return (
    <div id="bcscan">
      {/* <div className="bg-secondary text-white py-5">
        <div className="container px-4 py-5">
          <div className="row align-items-center">
            <div className=".d-none .d-lg-flex col-lg-8">
              <h1 className="display-4">Sigma Barcode Scanner</h1>
              <p className="lead">
                Scan Our barcode with our scanner to redirect to your url.
              </p>
            </div>
            <div className="col-lg-4 col-xs-12">
              <div
                className="box p-4"
                onClick={() => navigate("/scanner/barcode")}
              >
                <i className="fa-solid fa-barcode fa-2xl text-center"></i>
                <h3>Sigma Barcode Scanner</h3>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <div className="barcode-scanner-container py-5 px-4">
        <div className="container py-3">
          <div className="scanner-header">
            <h1>Curlmin Barcode Scanner</h1>
            <p>
              Scan our barcode with curlmin scanner to redirect to your URL
              efficiently.
            </p>
          </div>
          <div className="scanner-button">
            <button onClick={() => navigate("/barcode-scanner")}>
              <span className="barcode-icon">||||</span>
              Curlmin Barcode Scanner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bcscanner;
