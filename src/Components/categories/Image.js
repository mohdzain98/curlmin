import React, { useState, useContext } from "react";
import { FaChartLine } from "react-icons/fa6";
import { RiLockPasswordFill } from "react-icons/ri";
import { userContext } from "../../Context/userContext";

const Image = (props) => {
  const { showAlert } = props.prop;
  const [uploadedImage, setUploadedImage] = useState({
    img: null,
    url: "",
    type: "",
  });
  const [shortLink, setShortLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pass, setPass] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [passval, setPassval] = useState("");
  const [expiry, setExpiry] = useState("9998-12-31 23:59:59");
  const context = useContext(userContext);
  const { userIdRef, getSignedUrl } = context;
  const userId = userIdRef.current === "" ? "default" : userIdRef.current;

  // Handle file selection
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedImage({
        img: file,
        url: URL.createObjectURL(file),
        type: file.type,
      });
    }
  };

  const handleSubmit = async () => {
    if (!uploadedImage.img) {
      showAlert("Upload Image", "info");
      return;
    }
    setIsLoading(true);
    const fileType = uploadedImage.type;
    const isPermanent = true;
    const data = await getSignedUrl(
      userId,
      fileType,
      pass,
      passval,
      expiry,
      isPermanent
    );
    console.log(data);
    if (!data.uploadUrl) {
      showAlert("Some Failure Occurred, try again", "info");
      setIsLoading(false);
      return;
    }
    try {
      const upload_to_s3 = await fetch(data.uploadUrl, {
        method: "PUT",
        body: uploadedImage.img,
        headers: { "Content-Type": fileType },
      });
      if (upload_to_s3.ok) {
        setShortLink(`curlm.in/img/${data.imageId}`);
        showAlert("Image Uploaded Successfully", "success");
      } else {
        showAlert("Error in Uploading File to Server", "danger");
      }
    } catch (error) {
      showAlert("Upload failed", "danger");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOther = () => {
    setShortLink("");
    setUploadedImage({ img: null, url: "", type: "" });
  };

  // Copy link to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortLink);

    // Show toast notification
    const toast = document.getElementById("toast");
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
  };

  return (
    <>
      <div className="container-fluid p-0">
        {/* Hero Section */}
        <div className="bg-success text-white py-5 text-center">
          <div className="container py-5">
            <h1 className="display-4 fw-bold">Share Images Instantly</h1>
            <p className="lead">Upload, shorten, share. It's that simple.</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="container my-5">
          <div className="row">
            {/* Left Column */}
            <div className="col-lg-6 mt-2">
              <div className="card shadow-sm rounded-3 h-100">
                <div className="card-body p-4">
                  <h3 className="card-title mb-4">Upload Your Image</h3>

                  {/* Upload Area */}
                  <div className="upload-area p-4 border border-2 border-dashed rounded-3 mb-4 text-center bg-light">
                    <div className="py-3">
                      <i className="fa-solid fa-cloud-arrow-up fs-1 text-success"></i>
                      <p className="mt-2 mb-3">
                        Drag your image here or click to browse
                      </p>
                      <label className="btn btn-success">
                        {uploadedImage.img ? "File Choosen" : "Choose File"}
                        <input
                          type="file"
                          className="d-none"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="features mt-5">
                    <h5 className="text-center">
                      Why Share Images with Curlmin?
                    </h5>
                    <div className="row gap-3 py-3 d-flex justify-content-center">
                      <div
                        className="col-4 border shadow p-2 rounded-2 text-center"
                        style={{ fontSize: "12px" }}
                      >
                        <i className="fa-solid fa-compress fa-lg text-primary"></i>
                        <br />
                        No Compression
                      </div>
                      <div
                        className="col-4 border shadow p-2 rounded-2 text-center"
                        style={{ fontSize: "12px" }}
                      >
                        <FaChartLine color="#feb236" size={"16px"} />
                        <br />
                        Track Views
                      </div>
                      <div
                        className="col-4 border shadow p-2 rounded-2 text-center"
                        style={{ fontSize: "12px" }}
                      >
                        <i className="fa-solid fa-share text-danger fa-lg"></i>
                        <br />
                        Share on social media
                      </div>
                      <div
                        className="col-4 border shadow p-2 rounded-2 text-center"
                        style={{ fontSize: "12px" }}
                      >
                        <RiLockPasswordFill color="#bd5734" size={"16px"} />
                        <br />
                        Secure image with Password
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="col-lg-6 mt-2">
              <div className="card shadow-sm rounded-3 h-100">
                <div className="card-body p-4 d-flex flex-column">
                  <h3 className="card-title mb-4">
                    Image Preview & Customize Link
                  </h3>

                  {/* Preview Area */}
                  <div
                    className="preview-area mb-4 border rounded-3 bg-light d-flex justify-content-center align-items-center"
                    style={{ minHeight: "200px" }}
                  >
                    {uploadedImage.img ? (
                      <img
                        src={uploadedImage.url}
                        alt="Uploaded preview"
                        className="img-fluid rounded-3 shadow-sm"
                        style={{ maxHeight: "200px" }}
                      />
                    ) : (
                      <div className="text-center text-muted">
                        <i className="fa-solid fa-image fs-1"></i>
                        <p className="mt-2">Your image will appear here</p>
                      </div>
                    )}
                  </div>

                  <div className="d-flex flex-column gap-2 mb-3">
                    <div className="mb-1 mx-2">
                      <label htmlFor="datetime" className="form-label">
                        <i className="fas fa-clock fa-sm text-success me-2"></i>{" "}
                        Select Expiration Date & Time:
                      </label>
                      <input
                        type="datetime-local"
                        id="datetime"
                        className="ms-3"
                        onChange={(e) => setExpiry(e.target.value)}
                      />
                    </div>
                    <div className="d-flex align-items-center mb-1 mx-2">
                      <label
                        className="form-check-label me-2"
                        htmlFor="passwordToggle"
                      >
                        <i className="fas fa-lock fa-sm text-success me-2"></i>{" "}
                        Set Password
                      </label>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="passwordToggle"
                        onChange={() => {
                          setPass(!pass);
                          setIsChecked(!isChecked);
                        }}
                        // disabled={surl ? true : false}
                        checked={isChecked}
                      />
                    </div>
                    {pass && (
                      <div
                        className={`mb-3 input-group`}
                        style={{
                          transition: "opacity 0.3s ease, height 0.3s ease",
                          overflow: "hidden",
                        }}
                      >
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control"
                          placeholder="Enter password"
                          style={{ width: "50%" }}
                          value={passval}
                          onChange={(e) => setPassval(e.target.value)}
                          // disabled={surl ? true : false}
                        />
                        <button
                          type="button"
                          className="input-group-text bg-light border-start-0"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <i className="fa-solid fa-eye-slash"></i>
                          ) : (
                            <i className="fa-solid fa-eye"></i>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Short Link Area */}
                  <div className="short-link-area">
                    {shortLink && (
                      <div className="input-group mb-3">
                        <input
                          type="text"
                          className="form-control border-primary"
                          value={shortLink}
                          readOnly
                        />
                        <button
                          className="btn btn-primary"
                          type="button"
                          onClick={copyToClipboard}
                        >
                          <i className="bi bi-clipboard me-1"></i> Copy
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="foot mt-auto mb-3">
                    {/* <button
                      className="btn btn-success px-4"
                      onClick={handleSubmit}
                      disabled={isLoading}
                    >
                      Submit
                    </button> */}
                    {!shortLink ? (
                      <button
                        className="btn btn-success px-3 mt-2"
                        onClick={handleSubmit}
                        disabled={isLoading}
                      >
                        <i className="fas fa-link me-2"></i>
                        {isLoading ? (
                          <span>
                            Submitting..
                            <span
                              className={`ms-2 spinner-border spinner-border-sm`}
                              role="status"
                              aria-hidden="true"
                            ></span>
                          </span>
                        ) : (
                          "Submit"
                        )}
                      </button>
                    ) : (
                      <button
                        className="btn btn-secondary mt-2"
                        onClick={handleOther}
                      >
                        <i className="fa-solid fa-image"></i> Upload Another
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Toast Notification */}
        <div
          className="position-fixed bottom-0 end-0 p-3"
          style={{ zIndex: 5 }}
        >
          <div
            id="toast"
            className="toast align-items-center text-white bg-success border-0"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="d-flex">
              <div className="toast-body">
                <i className="bi bi-check-circle me-2"></i>
                Link copied to clipboard!
              </div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                data-bs-dismiss="toast"
                aria-label="Close"
              ></button>
            </div>
          </div>
        </div>
      </div>
      {/* How It Works Section */}
      <div className="container-fluid bg-light py-2 px-3">
        <div className="row mt-4 px-5">
          <div className="col-12 text-center mb-4">
            <h2>How It Works</h2>
            <p className="text-muted">
              Share your images in three simple steps
            </p>
          </div>

          <div className="col-md-4 mb-4">
            <div className="h-100">
              <div className="text-center p-4">
                <div
                  className="rounded-circle bg-primary text-white d-inline-flex justify-content-center align-items-center mb-3"
                  style={{ width: "60px", height: "60px" }}
                >
                  <i className="fa-solid fa-upload fs-4"></i>
                </div>
                <h5>Upload</h5>
                <p className="text-muted">
                  Select your image from your device or drag & drop it
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="h-100">
              <div className="text-center p-4">
                <div
                  className="rounded-circle bg-primary text-white d-inline-flex justify-content-center align-items-center mb-3"
                  style={{ width: "60px", height: "60px" }}
                >
                  <i className="fa-solid fa-link fs-4"></i>
                </div>
                <h5>Get Link</h5>
                <p className="text-muted">
                  We'll generate a short, easy-to-share link for your image
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="h-100">
              <div className="text-center p-4">
                <div
                  className="rounded-circle bg-primary text-white d-inline-flex justify-content-center align-items-center mb-3"
                  style={{ width: "60px", height: "60px" }}
                >
                  <i className="fa-solid fa-share fs-4"></i>
                </div>
                <h5>Share</h5>
                <p className="text-muted">
                  Share your link anywhere - social media, email, messages,
                  forms
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Image;
