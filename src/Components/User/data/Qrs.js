import React, { useContext, useState, useEffect, useRef } from "react";
import { userContext, userAccContext } from "../../../Context/userContext";
import { Link } from "react-router-dom";
import "./userstyle.css";

const Qrs = (props) => {
  const { showAlert } = props.prop;
  // const [loading, setLoading] = useState(false);
  const [qr, setQr] = useState({ id: "", name: "", path: "" });
  const context = useContext(userContext);
  const accontext = useContext(userAccContext);
  const { qrcodes, fetchQRcodes, getDelete, fetchCounts, loading } = accontext;
  const { userIdRef } = context;
  const userId = userIdRef.current;
  const [deloader, setDeloader] = useState(false);
  const ref = useRef();

  useEffect(() => {
    // setLoading(true);
    const storedUserId = localStorage.getItem("curlmin-userId");
    async function fetch() {
      userIdRef.current = storedUserId;
      await fetchQRcodes(storedUserId);
    }
    // .then(() => setLoading(false));
    fetch();
    // eslint-disable-next-line
  }, []);

  // useEffect(() => {
  //   if (userId) {
  //     setLoading(true);
  //     async function fetch() {
  //       await fetchQRcodes(userId);
  //     }
  //     fetch();
  //   }
  //   setLoading(false);
  //   // eslint-disable-next-line
  // }, [userId]);

  if (loading.qr) {
    return (
      <div className="text-center">
        <span className="spinner-grow"></span>
      </div>
    );
  }
  const handleDelete = async (e) => {
    e.preventDefault();
    setDeloader(true);
    try {
      const res = await getDelete("deleteqr", qr.id, userId, qr.path);
      if (res.success) {
        showAlert("URL deleted successfully", "success");
        fetchQRcodes(userId);
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

  const downloadQRCode = (file) => {
    const link = document.createElement("a");
    link.href = `${process.env.PUBLIC_URL}/UserAssets/qrcodes/${file}`;
    link.download = file;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const extractDomainName = (url) => {
    // eslint-disable-next-line
    const match = url.match(/https?:\/\/(www\.)?([^\.]+)/);
    if (match) {
      return match ? match[2] : null;
    } else {
      const match = url.match(/pa=([^&]+)/);
      return match ? match[1] : null;
    }
  };

  return (
    <div className="py-4">
      <div className="row">
        {qrcodes.length > 0 ? (
          qrcodes.map((qr) => (
            <div key={qr.uid} className="col-md-4 mb-4">
              <div className="card shadow-sm h-100">
                <div className="card-body d-flex flex-column">
                  <div className="d-flex flex-row gap-2">
                    <img
                      src={`/UserAssets/qrcodes/${qr.filePath}`}
                      alt="qr"
                      className="img-fluid border p-1 rounded shadow-sm"
                      style={{ width: "100px", height: "100px" }}
                      onError={(e) =>
                        (e.target.src = require("../../../Assets/qrcode.png"))
                      }
                    />
                    <Link
                      to={
                        qr.longUrl.includes("upi")
                          ? "/urls?qrcodes"
                          : qr.longUrl
                      }
                      target={qr.longUrl.includes("upi") ? "_self" : "_blank"}
                      rel="noopener"
                      style={{ textDecoration: "none", width: "100%" }}
                    >
                      <textarea
                        readOnly
                        className="form-control"
                        wrap="soft"
                        rows="4"
                        style={{ fontSize: "12px", height: "100px" }}
                        value={
                          qr.longUrl.includes("upi")
                            ? extractDomainName(qr.longUrl)
                            : qr.longUrl
                        }
                      ></textarea>
                    </Link>
                  </div>
                  <div className="border rounded mb-1 mt-3">
                    <h5 className="card-title text-center mt-2">
                      {extractDomainName(qr.longUrl)}
                      <Link
                        to={
                          qr.longUrl.includes("upi")
                            ? "/urls?qrcodes"
                            : qr.longUrl
                        }
                        target={qr.longUrl.includes("upi") ? "_self" : "_blank"}
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
                        {qr.uid}
                      </p>
                    </h5>
                  </div>
                  <div className="foot mt-auto">
                    <button
                      className="btn btn-default"
                      onClick={() => downloadQRCode(qr.filePath)}
                    >
                      <i
                        className="fa-solid fa-download fa-sm"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Download This QR"
                      ></i>
                    </button>
                    <button
                      className="btn btn-default"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                      onClick={() =>
                        setQr({
                          id: qr.uid,
                          name: extractDomainName(qr.longUrl),
                          path: qr.filePath,
                        })
                      }
                    >
                      <i
                        className="fa-solid fa-trash fa-sm"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Delete This QR"
                      ></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center">
            <p className="text-center">No QR Found.</p>
            <p className="text-muted" style={{ marginTop: "-1.5%" }}>
              Start Creating QR codes <Link to="/qrcode">Now</Link>
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
            <div class="modal-body">{`Are you sure you want to delete ${qr.name}-${qr.id}`}</div>
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

export default Qrs;
