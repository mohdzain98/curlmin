import React, { useState, useRef, useEffect, useContext } from "react";
import "./Styling/qr.css";
import { userContext } from "../../Context/userContext";
import { Link } from "react-router-dom";
import Share from "../User/data/Share";

const Barcode = (props) => {
  const { host, showAlert } = props.prop;
  const [url, setUrl] = useState("");
  const barcodeRef = useRef(null);
  const [loader, setLoader] = useState("");
  const [barcode, setBarcode] = useState("");
  const [bc, setBc] = useState(false);
  const [opval, setOpval] = useState(2);
  const [respUid, setResUid] = useState("");
  const [share, setShare] = useState(false);
  const context = useContext(userContext);
  const [isLoading, setIsLoading] = useState(false);
  const { userIdRef, saveBarcode, isValidUrl } = context;
  const userId = userIdRef.current === "" ? "default" : userIdRef.current;

  useEffect(() => {
    document.title = "curlmin | Barcodes";
  }, []);

  useEffect(() => {
    if (barcodeRef.current && barcode) {
      const canvas = barcodeRef.current;
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
      };
      img.src = barcode;
    }
  }, [barcode]);

  const generateBarcode = async () => {
    if (!url) {
      showAlert("Valid URL required", "danger");
      return;
    }
    const isValid = isValidUrl(url);
    if (!isValid) {
      showAlert("Not a valid url", "danger");
      return;
    }
    try {
      setLoader("spinner-border spinner-border-sm ms-2");
      setIsLoading(true);
      const savebc = await saveBarcode(userId, url);
      const response = await fetch(`${host}/url/create-barcode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          data: opval === 1 ? savebc.shortUrl : savebc.nuid,
          name: savebc.name,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setBarcode(result.image);
        setResUid(savebc.nuid);
        setBc(true);
      } else {
        showAlert(result.error, "danger");
      }
    } catch (error) {
      showAlert("Error generating barcode:", "danger");
    } finally {
      setLoader("");
      setIsLoading(false);
    }
  };

  const downloadBarcode = () => {
    const canvas = barcodeRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "barcode.png";
    link.href = canvas.toDataURL("image/png");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBc = () => {
    setBc(false);
    setUrl("");
    setBarcode("");
    setOpval(2);
    setIsLoading(false);
  };

  return (
    <div className="container-fluid p-0">
      {/* Hero Section */}
      <div className="bg-primary text-white py-5 mb-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold">URL to Barcode Generator</h1>
              <p className="lead">
                Transform your website links into scannable barcodes for
                seamless physical-to-digital connections
              </p>
            </div>
            <div className="d-none d-lg-flex col-lg-4">
              <img
                src={require("../../Assets/barcode.png")}
                alt="Barcode Scanner"
                className="img-fluid rounded shadow"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mb-5">
        <div className="row justify-content-center mb-5 bc-container">
          <div className="col-md-8">
            <div className="text-center mb-4">
              <h2 className="h3">Generate Your Barcode</h2>
              <p className="text-muted">
                Paste your URL below to create a custom Barcode
              </p>
            </div>

            <form className="form-group mb-4 position-relative">
              <input
                type="url"
                className="form-control url-input"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </form>

            <div className="text-center">
              {!bc ? (
                <button
                  type="button"
                  className="btn btn-success px-5"
                  onClick={generateBarcode}
                  disabled={isLoading}
                >
                  <i className="fa-solid fa-barcode me-2"></i>
                  {isLoading ? (
                    <span>
                      Generating..
                      <span
                        className={`ms-2 ${loader}`}
                        role="status"
                        aria-hidden="true"
                      ></span>
                    </span>
                  ) : (
                    "Generate Barcode"
                  )}
                </button>
              ) : (
                <div>
                  <button className="btn btn-secondary px-5" onClick={handleBc}>
                    <i className="fa-solid fa-barcode me-2"></i>
                    Generate Another
                  </button>
                </div>
              )}
            </div>

            {/* Barcode Result */}
            {barcode && (
              <div className="d-flex flex-column gap-2 mt-4">
                <div
                  className="text-center p-2"
                  style={{ border: "solid 1px" }}
                >
                  <canvas ref={barcodeRef} className="img-fluid"></canvas>
                </div>
                <div className="mt-3 mb-1 d-flex flex-column justify-content-center align-items-center">
                  <div className="d-flex flex-row gap-2">
                    <button
                      className="btn btn-outline-primary"
                      onClick={downloadBarcode}
                    >
                      Download Barcode
                    </button>
                    <button
                      className="btn btn-outline-success"
                      style={{ width: "100px" }}
                      onClick={() => setShare(!share)}
                    >
                      <i className="fa-solid fa-share-nodes"></i>
                    </button>
                    {share && <Share prop={{ uid: respUid, ep: "bc" }} />}
                  </div>
                  {!localStorage.getItem("token") && (
                    <p className="mt-2 text-muted" style={{ fontSize: "14px" }}>
                      <Link to={`/login?s=barcode&id=${respUid}`}>Login</Link>{" "}
                      or{" "}
                      <Link to={`/signup?s=barcode&id=${respUid}`}>Signup</Link>{" "}
                      to save your QR code
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Feature Cards */}
        <div className="row mb-5">
          <div className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h3 className="card-title h5">
                  <i className="bi bi-box-seam text-primary"></i>
                  Product Packaging
                </h3>
                <p className="card-text text-muted">
                  Print barcodes on product boxes to directly link customers to
                  product pages, manuals, or registration forms.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h3 className="card-title h5">
                  <i className="bi bi-phone text-primary"></i>
                  Mobile-Friendly
                </h3>
                <p className="card-text text-muted">
                  Easily scannable with our curlmin barcode scanner for instant
                  website access.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h3 className="card-title h5">
                  <i className="bi bi-shield-check text-primary"></i>
                  Professional Quality
                </h3>
                <p className="card-text text-muted">
                  Generate high-resolution barcodes suitable for commercial
                  printing and professional applications.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Barcode;
