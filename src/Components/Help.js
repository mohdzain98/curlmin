import React, { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";

const Help = () => {
  //   const [isOpen, setIsOpen] = useState(true);
  const [select, setSelect] = useState("gs");
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  useEffect(() => {
    document.title = "Help Center | Curlmin";
  }, []);

  return (
    <div id="help">
      <div className="container-fluid py-5 d-flex flex-column justify-content-center align-items-center position-relative overflow-hidden">
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background:
              "linear-gradient(135deg, rgba(100,200,255,0.2) 0%, rgba(200,100,255,0.2) 100%)",
            zIndex: -1,
          }}
        >
          {/* Abstract shapes */}
          <div
            className="position-absolute rounded-circle bg-primary opacity-25"
            style={{
              width: "200px",
              height: "200px",
              top: "10%",
              left: "5%",
              transform: "rotate(45deg)",
            }}
          ></div>
          <div
            className="position-absolute rounded-circle bg-warning opacity-25"
            style={{
              width: "300px",
              height: "300px",
              bottom: "10%",
              right: "5%",
              transform: "rotate(-25deg)",
            }}
          ></div>
        </div>

        {/* Main Content */}
        <div className="text-center p-4 my-4">
          <h1 className="display-4 fw-bold text-primary mb-3">Help Center</h1>
        </div>
      </div>
      <div className="container my-5">
        <div className="row">
          <div className="col-md-3 col-xs-12 p-4 border">
            {!isTabletOrMobile ? (
              <div>
                <h5 className="fw-bold">Options</h5>
                <hr />
                <nav className="nav nav-pills flex-column">
                  <ul></ul>
                  <Link
                    className={`nav-link ${select === "gs" ? "active" : ""}`}
                    onClick={() => setSelect("gs")}
                  >
                    Getting Started
                  </Link>
                  <Link
                    className={`nav-link ${select === "qr" ? "active" : ""}`}
                    onClick={() => setSelect("qr")}
                  >
                    Qr Codes
                  </Link>
                  <Link
                    className={`nav-link ${select === "bc" ? "active" : ""}`}
                    onClick={() => setSelect("bc")}
                  >
                    Barcodes and Barcode Scanner
                  </Link>
                  <Link
                    className={`nav-link ${select === "st" ? "active" : ""}`}
                    onClick={() => setSelect("st")}
                  >
                    Curltag
                  </Link>
                  {/* <Link
                    className={`nav-link ${select === "acs" ? "active" : ""}`}
                    onClick={() => setSelect("acs")}
                  >
                    Account and Setting
                  </Link> */}
                </nav>
              </div>
            ) : (
              <select
                className="form-select"
                aria-label="Default select example"
                onChange={(e) => setSelect(e.target.value)}
              >
                <option value="gs" selected>
                  Getting Started
                </option>
                <option value="qr">Qr codes</option>
                <option value="bc">Barcodes and Barcode Scanner</option>
                <option value="st">Curltag</option>
                {/* <option value="acs">Account and Setting</option> */}
              </select>
            )}
          </div>
          <div
            className={`col-md-8 col-xs-12 ${
              isTabletOrMobile ? "mt-4" : "ms-4"
            }`}
          >
            {select === "gs" && (
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Getting Started</h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    How to start with your long url
                  </h6>
                  <p className="card-text">
                    Welcome to Curlmin! Simplify your online interactions by
                    converting lengthy URLs into concise links.
                    <ul className="mt-2">
                      <li>
                        <span className="fw-bold">Shorten Your Links</span> :
                        Paste your long URLs and get easy-to-share shortened
                        links.
                      </li>
                      <li>
                        <span className="fw-bold">Share Your Links</span> :
                        Share easily and efficiently rest we will manage
                      </li>
                    </ul>
                  </p>
                  <p className="text-muted" style={{ fontSize: "16px" }}>
                    When you paste your long URL, we generate a unique code for
                    your respective URL and save it along your url. When you
                    click our shorturl we will redirect to your long url with
                    ease
                  </p>
                </div>
              </div>
            )}
            {select === "qr" && (
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">QR Codes – Share Smarter</h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    Share you Link as a QR
                  </h6>
                  <p className="card-text">
                    Create QR codes effortlessly for your URLs with Curlmin. QR
                    codes make it convenient to share links offline or on print
                    media, letting users scan and access content instantly
                  </p>
                  <ul>
                    <li>High-quality QR code generation.</li>
                    <li>Scan-ready designs for quick access.</li>
                    <li>Download, share, place</li>
                  </ul>
                  <p className="text-muted" style={{ fontSize: "15px" }}>
                    Download using the download button, it will directly save in
                    your browser downloads
                  </p>
                </div>
              </div>
            )}
            {select === "bc" && (
              <div>
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">
                      Barcode Generation – Beyond URLs
                    </h5>
                    <h6 className="card-subtitle mb-2 text-muted">
                      Share you Link as a Barcode
                    </h6>
                    <p className="card-text">
                      Transform your data into barcodes seamlessly. Perfect for
                      product labels, inventory management, and more
                    </p>
                    <ul>
                      <li>Universal compatibility.</li>
                      <li>Easy tracking and management</li>
                      <li>Wide range of formats to suit your needs.</li>
                    </ul>
                    <p className="text-muted" style={{ fontSize: "15px" }}>
                      Generate barcodes in just a few clicks and streamline your
                      workflows. The barcodes generated if barcode scanner as we
                      convert your url into shorturl, then unique code generated
                      for shorturl is converted into barcode so that barcode
                      size remains small.
                      <br />
                      When our scanner detects code from barcode, it directly
                      redirect to our shorturl with that code.
                    </p>
                  </div>
                </div>
                <div className="card mt-4">
                  <div className="card-body">
                    <h5 className="card-title">
                      Barcode Scanner – Decode with Ease
                    </h5>
                    <h6 className="card-subtitle mb-2 text-muted">
                      Scan our barcode with our scanner
                    </h6>
                    <p className="card-text">
                      Quickly scan and decode barcodes using Curlmin's
                      integrated scanner. Use your device’s camera to extract
                      data from barcodes in seconds.
                    </p>
                  </div>
                </div>
              </div>
            )}
            {select === "st" && (
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Curltag</h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    The new form of QR, more attractive and can be used at every
                    place where the QR is used.
                  </h6>
                  <p className="card-text">
                    Create Sigmatags with your images as a background with a
                    scanner.
                  </p>
                </div>
              </div>
            )}
            {select === "acs" && (
              <div className="card mt-4">
                <div className="card-body">
                  <h5 className="card-title">Manage Your Account</h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    Customize your Curlmin experience in the Account and
                    Settings section.
                  </h6>
                  <ul>
                    <li>
                      Account Details: Update your profile, manage passwords,
                      and view usage statistics
                    </li>
                    <li>
                      Settings: Personalize features like default URL expiry,
                      link privacy, and notification preferences.
                    </li>
                    <li>
                      Analytics: Gain insights into your links’ performance with
                      real-time data. Stay in control and make the most of
                      Curlmin.
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
