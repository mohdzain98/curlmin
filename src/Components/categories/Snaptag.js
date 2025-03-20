import React, { useState, useContext, useEffect } from "react";
import Resizer from "react-image-file-resizer";
import "./Styling/qr.css";
import { useMediaQuery } from "react-responsive";
import { userContext } from "../../Context/userContext";
import { Link } from "react-router-dom";
import Share from "../User/data/Share";

const Snaptag = (props) => {
  const { host, showAlert } = props.prop;
  const [url, setUrl] = useState("");
  const [snaptagImage, setSnaptagImage] = useState("");
  const [opval, setOpval] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [respUid, setResUid] = useState("");
  const [share, setShare] = useState(false);
  const context = useContext(userContext);
  const { userIdRef, saveSigmatag, isValidUrl } = context;
  const userId = userIdRef.current === "" ? "default" : userIdRef.current;
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  useEffect(() => {
    document.title = "curlmin | Curltags";
  }, []);

  const resizeImage = (file) => {
    const options = {
      quality: 1,
      maxWidth: 1000,
      maxHeight: 800,
      outputType: "image/png",
    };

    return new Promise((resolve, reject) => {
      Resizer.imageFileResizer(
        file,
        options.maxWidth,
        options.maxHeight,
        options.outputType,
        options.quality * 100,
        0,
        (resizedImage) => resolve(resizedImage),
        "blob"
      );
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      setSelectedFile(file);
    } else {
      showAlert("Please select a PNG or JPEG image", "info");
    }
  };

  const generateSnaptag = async (e) => {
    e.preventDefault();
    if (!url) {
      showAlert("URL required", "danger");
      return;
    }
    const isValid = isValidUrl(url);
    if (!isValid) {
      showAlert("Not a valid url", "danger");
      return;
    }
    setIsLoading(true);
    let formData = "";
    const savest = await saveSigmatag(userId, url);
    if (savest === false) {
      showAlert("Some error Occurred", "danger");
      setIsLoading(false);
      return;
    }
    formData = new FormData();
    formData.append("userId", userId);
    formData.append("url", savest.shortUrl);
    formData.append("name", savest.name);
    formData.append("type", opval);
    setResUid(savest.nuid);
    if (opval === 2) {
      const resizedImage = await resizeImage(selectedFile);
      formData.append("image", resizedImage);
    } else {
      formData.append("image", "");
    }
    try {
      const response = await fetch(`${host}/url/createst`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        showAlert("Failed to generate Curltag", "danger");
      }

      const data = await response.json();
      setSnaptagImage(data.image);
    } catch (err) {
      showAlert("Failed to generate Curltag. Please try again.", "danger");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadSnaptag = () => {
    const link = document.createElement("a");
    link.href = snaptagImage;
    link.download = "snaptag.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOther = () => {
    setSnaptagImage("");
    setUrl("");
    setOpval(1);
    setIsLoading(false);
  };
  return (
    <div className="container-fluid p-0">
      <div className="bg-danger text-white py-5 mb-5">
        <div className="container text-center py-5">
          <h1 className="display-4 fw-bold mb-4">Discover Curltag</h1>
          <p className="fw-semibold" style={{ fontSize: "20px" }}>
            Curltag are the next evolution of QR codes! They allow embedding an
            image within the tag, making them visually appealing and perfect for
            branding.
          </p>
        </div>
      </div>
      <div className="px-3">
        <div
          className="container my-5 shadow p-4 main"
          style={{ borderRadius: "10px" }}
        >
          <div className="row pt-4">
            <div className="col-md-8 d-flex justify-content-center align-items-center flex-column">
              <div className="text-center mb-2">
                <h2 className="text-center fw-bold text-danger">
                  Try Curltag Yourself
                </h2>
                <p className="text-muted">
                  Paste your URL below to create a Curltag, you can also set
                  background image.
                </p>
              </div>
              <form
                className="form-group mb-2 position-relative "
                style={isTabletOrMobile ? { width: "100%" } : { width: "80%" }}
              >
                <input
                  type="url"
                  className="form-control url-input"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <div className="d-flex justify-content-center mt-4 gap-3 flex-row flex-wrap">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      value={opval}
                      onChange={() => setOpval(1)}
                      checked={opval === 1 ? true : false}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="exampleRadios1"
                    >
                      No Background Image
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      value={opval}
                      onChange={() => setOpval(2)}
                      checked={opval === 2 ? true : false}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="exampleRadios2"
                    >
                      Upload Background Image
                    </label>
                  </div>
                </div>
                {opval === 2 && (
                  <div className="my-3 d-flex justify-content-center flex-column">
                    <label
                      htmlFor="formFile"
                      className="form-label text-muted align-self-center"
                      style={{ fontSize: "14px" }}
                    >
                      Choose an image to upload
                    </label>
                    <input
                      className="form-control align-self-center"
                      type="file"
                      id="formFile"
                      accept=".png, .jpg, .jpeg"
                      onChange={handleFileChange}
                      style={
                        isTabletOrMobile ? { width: "90%" } : { width: "50%" }
                      }
                    />
                  </div>
                )}
              </form>
              <center>
                {snaptagImage === "" ? (
                  <button
                    type="submit"
                    className="btn btn-primary mt-3 mb-2"
                    disabled={isLoading}
                    onClick={generateSnaptag}
                  >
                    {isLoading ? (
                      <span>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Generating...
                      </span>
                    ) : (
                      "Generate Curltag"
                    )}
                  </button>
                ) : (
                  <button
                    className="btn btn-secondary mt-4"
                    onClick={handleOther}
                  >
                    Generate Another
                  </button>
                )}
              </center>
              {/* {error && (
                <div className="alert alert-danger mt-3" role="alert">
                  {error}
                </div>
              )} */}
            </div>
            <div
              className={`col-md-4 ${snaptagImage ? "" : "d-none d-lg-flex"}`}
            >
              {snaptagImage ? (
                <div className="text-center mt-4">
                  <img
                    src={snaptagImage}
                    alt="Generated Curltag"
                    className="img-fluid mb-3"
                    style={{ maxWidth: "300px" }}
                  />
                  <div className="mt-3 mb-1 d-flex flex-column justify-content-center align-items-center">
                    <div className="d-flex flex-row align-items-center gap-2">
                      <button
                        className="btn btn-outline-primary"
                        onClick={downloadSnaptag}
                      >
                        Download Curltag
                      </button>
                      <button
                        className="btn btn-outline-success"
                        style={{ width: "100px" }}
                        onClick={() => setShare(!share)}
                      >
                        <i className="fa-solid fa-share-nodes"></i>
                      </button>
                      {share && <Share prop={{ uid: respUid, ep: "ct" }} />}
                    </div>
                    {!localStorage.getItem("token") && (
                      <p
                        className="mt-2 text-muted"
                        style={{ fontSize: "14px" }}
                      >
                        <Link to={`/login?s=curltag&id=${respUid}`}>Login</Link>{" "}
                        or{" "}
                        <Link to={`/signup?s=curltag&id=${respUid}`}>
                          Signup
                        </Link>{" "}
                        to save your Curltag
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <img
                  src={require("../../Assets/snaptag.jpg")}
                  className="img-fluid"
                  alt="Curltag"
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-light">
        <div className="container py-5">
          <h2 className="text-center fw-bold text-danger mb-4">
            Why Choose Curltag?
          </h2>
          <ul className="list-group list-group-flush my-3">
            <li className="list-group-item bg-light">
              🌟 Embeds an image into the QR-like design.
            </li>
            <li className="list-group-item bg-light">
              🎨 Highly customizable for branding.
            </li>
            <li className="list-group-item bg-light">
              📱 Scannable like QR codes, but visually superior.
            </li>
            <li className="list-group-item bg-light">
              🚀 Ideal for promotions and interactive campaigns.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Snaptag;
