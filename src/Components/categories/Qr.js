import React, { useState, useRef, useEffect, useContext } from "react";
import { userContext } from "../../Context/userContext";
import "./Styling/qr.css";
import { Link } from "react-router-dom";

const Qr = (props) => {
  const { host, showAlert } = props.prop;
  const [url, setUrl] = useState("");
  const [loader, setLoader] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [qr, setQr] = useState(false);
  const [respUid, setResUid] = useState("");
  const [isUrl, setIsUrl] = useState(true);
  const [amount, setAmount] = useState("");
  const qrRef = useRef(null);
  const context = useContext(userContext);
  const { userIdRef, isValidUrl } = context;
  const userId = userIdRef.current === "" ? "default" : userIdRef.current;

  useEffect(() => {
    document.title = "curlmin | QR codes";
  }, []);

  useEffect(() => {
    if (qrRef.current && qrCode) {
      const canvas = qrRef.current;
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
      };
      img.src = qrCode;
    }
  }, [qrCode]);

  const isValidUPI = (input) => {
    const upiPattern = /^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/;
    return upiPattern.test(input);
  };

  const generateQRCode = async () => {
    if (!url) {
      const msg = isUrl
        ? "Please enter a valid URL"
        : "Please enter a valid UPI Id";
      showAlert(msg, "danger");
      return;
    }
    const isValid = isValidUrl(url);
    if (isUrl) {
      if (!isValid) {
        showAlert("Not a valid URL", "danger");
        return;
      }
    } else {
      if (!isValidUPI(url)) {
        showAlert("Not a valid UPI", "danger");
        return;
      }
    }
    try {
      setLoader("spinner-border spinner-border-sm ms-2");
      setIsLoading(true);
      setQr(false);
      // await saveQrcode(userId, url);
      const response = await fetch(`${host}/url/createqr`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          url: url,
          amount: amount,
        }),
      });
      if (!response.ok) {
        if (response.status === 400) {
          const reply = await response.json();
          showAlert(reply.error, "info");
        } else {
          showAlert("Server Error Occurred", "danger");
        }
      } else {
        const data = await response.json();
        setQrCode(data.qrCode);
        showAlert(data.msg, "success");
        setResUid(data.uid);
        setQr(true);
      }
    } catch (err) {
      showAlert("Error generating QR code!", "danger");
    } finally {
      setLoader("");
      setIsLoading(false);
    }
  };

  const downloadQRCode = () => {
    const canvas = qrRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "barcode.png";
    link.href = canvas.toDataURL("image/png");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleQr = () => {
    setQr(false);
    setUrl("");
    setAmount("");
    setQrCode("");
    setIsLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!qr) {
      await generateQRCode();
    } else {
      handleQr();
    }
  };

  return (
    <>
      <div className="main-wrapper">
        <div className="hero-section mb-5">
          <div className="container text-center pt-5">
            <h1 className="display-4 fw-bold ">QR Code Generator</h1>
            <p className="lead">
              Transform your URLs/UPI IDs into QR codes instantly
            </p>
          </div>
        </div>
        <div className="container mb-5">
          <div className="qr-container p-4 p-md-5">
            <div className="row justify-content-center">
              <div className="col-md-8 d-flex justify-content-center flex-column">
                <div className="text-center mb-2">
                  <h2 className="h3">Generate Your QR Code</h2>
                  <p className="text-muted">
                    {`Paste your ${
                      isUrl ? "URL" : "UPI ID"
                    } below to create a custom QR code${
                      isUrl ? "" : ", also you can put amount if you need"
                    }`}
                  </p>
                </div>
                <div
                  className="btn-group mb-4"
                  role="group"
                  aria-label="Basic radio toggle button group"
                >
                  <input
                    type="radio"
                    className="btn-check"
                    name="btnradio"
                    id="btnradio1"
                    autoComplete="off"
                    onChange={() => setIsUrl((prev) => !prev)}
                    checked={isUrl}
                  />
                  <label
                    className="btn btn-outline-light text-secondary"
                    htmlFor="btnradio1"
                  >
                    Url QR
                  </label>

                  <input
                    type="radio"
                    className="btn-check"
                    name="btnradio"
                    id="btnradio2"
                    autoComplete="off"
                    onChange={() => setIsUrl((prev) => !prev)}
                    checked={!isUrl}
                  />
                  <label
                    className="btn btn-outline-light text-secondary"
                    htmlFor="btnradio2"
                  >
                    Payment QR
                  </label>
                </div>

                <form className="form-group" onSubmit={handleSubmit}>
                  {isUrl ? (
                    <input
                      type="url"
                      className="form-control url-input"
                      placeholder="https://example.com"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                    />
                  ) : (
                    <div className="d-flex flex-row gap-2">
                      <div className="flex-grow-1">
                        <input
                          type="text"
                          className="form-control url-input"
                          placeholder="example@bank"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          className="form-control url-input"
                          placeholder="Enter Amount"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                        ></input>
                      </div>
                    </div>
                  )}
                  <div className="text-center mt-4">
                    {!qr ? (
                      <button
                        type="submit"
                        className="btn btn-success px-5"
                        disabled={isLoading}
                      >
                        <i className="fa-solid fa-qrcode me-2"></i>
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
                          "Generate QR Code"
                        )}
                      </button>
                    ) : (
                      <button type="submit" className="btn btn-secondary px-5">
                        <i className="fa-solid fa-qrcode me-2"></i>
                        Generate Another
                      </button>
                    )}
                  </div>
                </form>
                {/* QR Code Result */}
                {qrCode && (
                  <div className="text-center mt-4">
                    <canvas ref={qrRef} className="img-fluid"></canvas>
                    <div>
                      <button
                        className="btn btn-outline-primary"
                        onClick={downloadQRCode}
                      >
                        Download QR Code
                      </button>
                    </div>
                    {!localStorage.getItem("token") && (
                      <p
                        className="mt-2 text-muted"
                        style={{ fontSize: "14px" }}
                      >
                        <Link to={`/login?s=qr&id=${respUid}`}>Login</Link> or{" "}
                        <Link to={`/signup?s=qr&id=${respUid}`}>Signup</Link> to
                        to save your QR code
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="row g-4 mt-2">
            <div className="col-md-3 col-xs-12 text-center">
              <div className="feature-card">
                <div className="feature-icon mx-auto">
                  <i className="fa-solid fa-bolt fa-2xs"></i>
                </div>
                <h3 className="h5">Instant Generation</h3>
                <p className="text-muted">
                  Create QR codes in seconds with our fast processing
                </p>
              </div>
            </div>
            <div className="col-md-3 col-xs-12 text-center">
              <div className="feature-card">
                <div className="feature-icon mx-auto">
                  <i class="fa-solid fa-money-check-dollar fa-2xs"></i>
                </div>
                <h3 className="h5">Payment QRs</h3>
                <p className="text-muted">
                  Create Payment QR code for sending to customers with or
                  without fixed amount
                </p>
              </div>
            </div>
            <div className="col-md-3 col-xs-12 text-center">
              <div className="feature-card">
                <div className="feature-icon mx-auto">
                  <i className="fa-solid fa-download fa-2xs"></i>
                </div>
                <h3 className="h5">Easy Download</h3>
                <p className="text-muted">
                  Download your QR codes in high quality PNG format
                </p>
              </div>
            </div>
            <div className="col-md-3 col-xs-12 text-center">
              <div className="feature-card">
                <div className="feature-icon mx-auto">
                  <i className="fa-solid fa-shield-halved fa-2xs"></i>
                </div>
                <h3 className="h5">Secure & Reliable</h3>
                <p className="text-muted">
                  Your data is processed securely and reliably
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Qr;
