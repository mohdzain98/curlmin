import React, { useContext, useState, useEffect, useRef } from "react";
import { userContext, userAccContext } from "../../../Context/userContext";
import { Link } from "react-router-dom";
import "./userstyle.css";
import Share from "./Share";
// import { FiDownload } from "react-icons/fi";
// import { MdOutlineFileDownloadOff } from "react-icons/md";

const Imgs = (props) => {
  const { showAlert, host } = props.prop;
  const [shareImId, setShareImId] = useState(false);
  const [img, setImg] = useState({ id: "" });
  const [showPassword, setShowPassword] = useState(false);
  const context = useContext(userContext);
  const accontext = useContext(userAccContext);
  const {
    images,
    fetchImages,
    fetchCounts,
    loading,
    formatExpiry,
    formatCurrent,
  } = accontext;
  const { userIdRef } = context;
  const userId = userIdRef.current;
  const [deloader, setDeloader] = useState(false);
  const ref = useRef();
  const toastRef = useRef(null);
  const currentDateTime = new Date();

  useEffect(() => {
    // setLoading(true);
    const storedUserId = localStorage.getItem("curlmin-userId");
    async function fetch() {
      userIdRef.current = storedUserId;
      await fetchImages(storedUserId);
    }
    // .then(() => setLoading(false));
    fetch();
    // eslint-disable-next-line
  }, []);

  if (loading.im) {
    return (
      <div className="text-center">
        <span className="spinner-grow"></span>
      </div>
    );
  }

  const handleCopy = (text) => {
    navigator.clipboard.writeText(`https://curlm.in/img/${text}`);
    const toast = new window.bootstrap.Toast(toastRef.current);
    toast.show();
  };
  const handleDelete = async (e) => {
    e.preventDefault();
    setDeloader(true);
    try {
      const resp = await fetch(`${host}/user/deleteimg/${img.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });
      if (resp.status === 500) {
        showAlert("internal server error, try again after some time", "danger");
      } else {
        const res = await resp.json();
        if (res.success) {
          showAlert("Image deleted successfully", "success");
          fetchImages(userId);
          fetchCounts(userId);
        } else {
          showAlert(res.msg, "danger");
        }
      }
    } catch (error) {
      showAlert("Error accessing server", "danger");
    } finally {
      setDeloader(false);
      ref.current.click();
    }
  };
  return (
    <div id="img" className="py-3">
      <div className="row">
        {images.length > 0 ? (
          images.map((img) => (
            <div key={img.image_id} className="col-md-4 col-xs-12 mb-4">
              <div className="card h-100 shadow-sm p-3">
                <div className="d-flex align-items-center">
                  <div className="position-relative flex-grow-1 ">
                    <img
                      src={img.signedUrl}
                      className="card-img-top image-preview"
                      alt="here"
                      height={"200px"}
                      onError={(e) =>
                        (e.target.src = require("../../../Assets/image.png"))
                      }
                    />
                    {img.pass === true && (
                      <div className="position-absolute top-0 end-0 m-2">
                        <span className="badge bg-secondary text-light d-flex align-items-center p-2">
                          <i className="fa-solid fa-lock me-1"></i> Protected
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="card-body d-flex flex-column">
                  <p
                    className="text-muted text-center"
                    style={{ fontSize: "12px" }}
                  >
                    {img.file_key.split("/")[0] +
                      "/" +
                      img.file_key.split(".")[1]}
                  </p>
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className="form-control bg-light text-primary"
                      value={`https://curlm.in/img/${img.image_id}`}
                      style={{ border: "0px", fontSize: "14px" }}
                      readonly
                    />
                    <button
                      className="btn btn-light btn-sm"
                      type="button"
                      onClick={() => handleCopy(img.image_id)}
                    >
                      <i className="fa-regular fa-clipboard"></i>
                    </button>
                    {img.pass === true && (
                      <button
                        className="btn btn-light btn-sm"
                        type="button"
                        onClick={() => setShowPassword(img.image_id)}
                      >
                        {showPassword === img.image_id ? (
                          <i
                            className="fa-solid fa-eye-slash"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowPassword("");
                            }}
                          ></i>
                        ) : (
                          <i className="fa-solid fa-eye"></i>
                        )}
                      </button>
                    )}
                  </div>

                  {img.pass === true && showPassword === img.image_id && (
                    <div className="password-section">
                      <div className="password-text alert alert-warning p-1 text-center">
                        <p style={{ fontSize: "13px" }} className="m-0 p-0">
                          Password: <strong>{img.passval}</strong>
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="d-flex ">
                    <small
                      className="text-muted flex-grow-1"
                      style={{ fontSize: "12px" }}
                    >
                      {formatCurrent(img.createdAt)}
                    </small>
                    <span
                      className="badge text-success pb-1"
                      style={{
                        backgroundColor: img.isPermanent
                          ? "#d1f2eb" // Light Green for Permanent
                          : (() => {
                              const expiryDateTime = formatExpiry(
                                img.expires_at
                              );
                              const timeDiff =
                                expiryDateTime - formatCurrent(currentDateTime);
                              const hoursRemaining = Math.floor(
                                timeDiff / (1000 * 60 * 60)
                              );

                              if (hoursRemaining <= 0) {
                                return "#fadbd8"; // Light Red for Expired
                              } else if (hoursRemaining < 24) {
                                return "#fcf3cf "; // Light Yellow for Expiring Soon
                              } else {
                                return "#d6eaf8"; // Light blue for Active
                              }
                            })(),
                        color: "black",
                      }}
                    >
                      {img.isPermanent
                        ? "Permanent"
                        : (() => {
                            const expiryDateTime = formatExpiry(img.expires_at);
                            const timeDiff =
                              expiryDateTime - formatCurrent(currentDateTime);
                            const hoursRemaining = Math.floor(
                              timeDiff / (1000 * 60 * 60)
                            );
                            if (hoursRemaining <= 0) {
                              return (
                                <span className="text-danger">Expired</span>
                              );
                            } else if (hoursRemaining < 24) {
                              return (
                                <span style={{ color: "#9c640c" }}>
                                  <p className="m-0 p-0">
                                    Expiring in{" "}
                                    <p className="mt-1 mb-0 p-0">
                                      {hoursRemaining} hrs
                                    </p>
                                  </p>
                                </span>
                              );
                            } else {
                              return (
                                <span className="text-primary">Active</span>
                              );
                            }
                          })()}
                    </span>
                  </div>
                </div>
                <div className="foot d-flex justify-content-center mt-2">
                  <div className="d-flex flex-row align-items-center gap-1">
                    <div className="btn-group">
                      <button
                        className="btn btn-light"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                        onClick={() => setImg({ id: img.image_id })}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                      <button
                        className="btn btn-light"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Share This Image"
                        onClick={() =>
                          setShareImId(
                            shareImId === img.image_id ? null : img.image_id
                          )
                        }
                      >
                        <i
                          className={`fa-solid ${
                            shareImId === img.image_id
                              ? "fa-square-share-nodes"
                              : "fa-share-nodes"
                          } `}
                        ></i>
                      </button>
                    </div>
                    {shareImId === img.image_id && (
                      <Share prop={{ uid: img.image_id, ep: "img" }} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center">
            <p className="text-center">No Image Found.</p>
            <p className="text-muted" style={{ marginTop: "-1.5%" }}>
              Start Uploading Image <Link to="/image">Now</Link>
            </p>
          </div>
        )}
      </div>
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">{`Are you sure you want to delete ${img.id}`}</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                data-bs-dismiss="modal"
                ref={ref}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={handleDelete}
                disabled={deloader}
              >
                {deloader ? (
                  <span>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Deleteing..
                  </span>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        ref={toastRef}
        className="toast align-items-center text-bg-primary border position-fixed bottom-0 end-0 m-3"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        style={{ zIndex: "1000" }}
      >
        <div className="d-flex">
          <div className="toast-body">URL Copied to clipboard!</div>
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
      </div>
    </div>
  );
};

export default Imgs;
