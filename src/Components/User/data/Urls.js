import React, { useEffect, useState, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { userContext, userAccContext } from "../../../Context/userContext";
import "./userstyle.css";

const Urls = (props) => {
  const { showAlert } = props.prop;
  const [url, setUrl] = useState({ id: "", name: "" });
  // const [loading, setLoading] = useState(false);
  const [deloader, setDeloader] = useState(false);
  const [showPassword, setShowPassword] = useState("");
  const context = useContext(userContext);
  const accontext = useContext(userAccContext);
  const { fetchCounts, urls, fetchUrls, loading } = accontext;
  const { userIdRef, deleteurl } = context;
  const userId = userIdRef.current;
  const ref = useRef();

  useEffect(() => {
    // setLoading(true);
    const storedUserId = localStorage.getItem("curlmin-userId");
    async function fetch() {
      userIdRef.current = storedUserId;
      await fetchUrls(storedUserId);
    }
    fetch();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (userId) {
      // setLoading(true);
      async function fetch() {
        await fetchUrls(userId);
      }
      fetch();
    }
    // setLoading(false);
    // eslint-disable-next-line
  }, [userId]);

  if (loading.url) {
    return (
      <div className="text-center">
        <span className="spinner-grow"></span>
      </div>
    );
  }

  const formatDateTime = (dateTime, flag) => {
    const currentDate = new Date();
    const givenDate = new Date(dateTime);

    if (flag && givenDate < currentDate) {
      return "Expired";
    }
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      //   second: "2-digit",
      hour12: false,
    };
    return givenDate.toLocaleString("en-US", options);
  };
  const formatExpiry = (date) => {
    const dates = new Date(date);
    const manual = dates.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "UTC",
    });
    return manual;
  };

  const extractDomainName = (url) => {
    // eslint-disable-next-line
    const match = url.match(/https?:\/\/(www\.)?([^\.]+)/);
    return match ? match[2] : null;
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    setDeloader(true);
    try {
      const res = await deleteurl(url.id, userId);
      if (res.success) {
        showAlert("URL deleted successfully", "success");
        fetchUrls(userId);
        fetchCounts(userId);
      } else {
        showAlert(res.msg, "danger");
      }
    } catch (error) {
      console.log(error);
      showAlert("Error accessing server", "danger");
    } finally {
      setDeloader(false);
      ref.current.click();
    }
  };

  return (
    <div className="py-4">
      <div className="row">
        {urls.length > 0 ? (
          urls.map((url) => (
            <div key={url.uid} className="col-md-4 mb-4">
              <div className="card shadow-sm h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title mb-1">
                    {extractDomainName(url.longUrl)}
                    <Link
                      to={`https://curlm.in/${url.uid}`}
                      target="_blank"
                      rel="noopener"
                    >
                      <i
                        className="fas fa-external-link-alt fa-xs ms-2"
                        style={{
                          color: "blue",
                        }}
                      ></i>
                    </Link>
                    <p
                      className="text-primary mt-1"
                      style={{ fontSize: "12px" }}
                    >
                      {url.uid}
                    </p>
                  </h5>
                  <div className="mb-3">
                    <Link
                      to={url.longUrl}
                      style={{ textDecoration: "none" }}
                      target="_blank"
                      rel="noopener"
                    >
                      <textarea
                        readOnly
                        className="form-control"
                        wrap="soft"
                        rows="4"
                        style={{ fontSize: "12px" }}
                        value={url.longUrl}
                      ></textarea>
                    </Link>
                  </div>
                  <div className="d-flex flex-row align-items-center">
                    <p className="ms-2">
                      password{" "}
                      {url.pass === true ? (
                        <i
                          className="fa-regular fa-circle-check fa-sm"
                          style={{ color: "green" }}
                        ></i>
                      ) : (
                        <i
                          className="fa-regular fa-circle-xmark fa-sm"
                          style={{ color: "red" }}
                        ></i>
                      )}
                    </p>
                    {url.pass === true && (
                      <p
                        className="btn btn-default btn-sm ms-auto me-2"
                        onClick={() => setShowPassword(url.uid)}
                        style={{ border: "none", boxShadow: "none" }}
                      >
                        {showPassword === url.uid ? url.passval : ""}
                        {showPassword === url.uid ? (
                          <i
                            className="fa-solid fa-eye-slash ms-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowPassword("");
                            }}
                          ></i>
                        ) : (
                          <i className="fa-solid fa-eye ms-1"></i>
                        )}
                      </p>
                    )}
                  </div>
                  <div className="d-flex flex-row gap-2">
                    <div className="p-2 border rounded flex-fill">
                      <p
                        className="text-muted"
                        style={{ fontSize: "12px", marginBottom: "0px" }}
                      >
                        Created at
                      </p>
                      <p style={{ fontSize: "13px" }}>
                        {formatDateTime(url.creationDate, false)}
                      </p>
                    </div>
                    <div className="p-2 border rounded flex-fill">
                      <p
                        className="text-muted"
                        style={{ fontSize: "12px", marginBottom: "0px" }}
                      >
                        Expires at
                      </p>
                      <p style={{ fontSize: "13px" }}>
                        {formatDateTime(url.expiryDate, true) ===
                        "Dec 31, 9999, 23:59"
                          ? "Permanent"
                          : formatExpiry(url.expiryDate)}
                      </p>
                    </div>
                  </div>
                  <div className="foot mt-auto">
                    <button
                      className="btn btn-default"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                      onClick={() =>
                        setUrl({
                          id: url.uid,
                          name: extractDomainName(url.longUrl) || url.uid,
                        })
                      }
                      style={{ border: "none" }}
                    >
                      <i
                        className="fa-solid fa-trash"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Delete This Url"
                      ></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center">
            <p className="text-center">No Url Found.</p>
            <p className="text-muted" style={{ marginTop: "-1.5%" }}>
              Start Creating Url <Link to="/">Now</Link>
            </p>
          </div>
        )}
      </div>
      <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-body">{`Are you sure you want to delete ${url.name}-${url.id}`}</div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary btn-sm"
                data-bs-dismiss="modal"
                ref={ref}
              >
                Close
              </button>
              <button
                type="button"
                class="btn btn-danger btn-sm"
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
    </div>
  );
};

export default Urls;
