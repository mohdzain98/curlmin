import React, { useContext, useState, useEffect, useRef } from "react";
import { userContext, userAccContext } from "../../../Context/userContext";
import { Link } from "react-router-dom";
import "./userstyle.css";

const Bcs = (props) => {
  const { showAlert } = props.prop;
  // const [loading, setLoading] = useState(false);
  const [bc, setBc] = useState({ id: "", name: "", path: "" });
  const context = useContext(userContext);
  const accontext = useContext(userAccContext);
  const { barcodes, fetchBarcodes, getDelete, fetchCounts, loading } =
    accontext;
  const { userIdRef } = context;
  const userId = userIdRef.current;
  const [deloader, setDeloader] = useState(false);
  const ref = useRef();

  useEffect(() => {
    // setLoading(true);
    const storedUserId = localStorage.getItem("curlmin-userId");
    async function fetch() {
      userIdRef.current = storedUserId;
      await fetchBarcodes(storedUserId);
    }
    fetch();
    // eslint-disable-next-line
  }, []);

  if (loading.bc) {
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
      const res = await getDelete("deletebc", bc.id, userId, bc.path);
      if (res.success) {
        showAlert("URL deleted successfully", "success");
        fetchBarcodes(userId);
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

  const downloadBarcode = (file) => {
    const link = document.createElement("a");
    link.href = `${process.env.PUBLIC_URL}/UserAssets/barcodes/${file}`;
    link.download = file;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const extractDomainName = (url) => {
    // eslint-disable-next-line
    const match = url.match(/https?:\/\/(www\.)?([^\.]+)/);
    return match ? match[2] : null;
  };
  return (
    <div className="py-4">
      <div className="row">
        {barcodes.length > 0 ? (
          barcodes.map((bc) => (
            <div key={bc.uid} className="col-md-4 col-xs-12 mb-4">
              <div className="card shadow-sm h-100">
                <div className="p-3">
                  <img
                    src={`${process.env.PUBLIC_URL}/UserAssets/barcodes/${bc.filePath}`}
                    alt="barcode"
                    className="card-img-top img-fluid border shadow-sm"
                    style={{ width: "100%", height: "150px" }}
                    onError={(e) =>
                      (e.target.src = require("../../../Assets/barcode.png"))
                    }
                  ></img>
                </div>
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-center">
                    {extractDomainName(bc.longUrl)}
                    <Link to={bc.longUrl} target="_blank" rel="noopener">
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
                      {bc.uid}
                    </p>
                  </h5>
                  <Link
                    className="mb-2"
                    to={bc.longUrl}
                    target="blank"
                    rel="noopener"
                    style={{ textDecoration: "none", width: "100%" }}
                  >
                    <textarea
                      readOnly
                      className="form-control"
                      wrap="soft"
                      rows="4"
                      style={{ fontSize: "12px" }}
                      value={bc.longUrl}
                    ></textarea>
                  </Link>
                  <div className="foot mt-auto">
                    <button
                      className="btn btn-default"
                      onClick={() => downloadBarcode(bc.filePath)}
                    >
                      <i
                        className="fa-solid fa-download fa-sm"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Download This Barcode"
                      ></i>
                    </button>
                    <button
                      className="btn btn-default"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                      onClick={() =>
                        setBc({
                          id: bc.uid,
                          name: extractDomainName(bc.longUrl),
                          path: bc.filePath,
                        })
                      }
                    >
                      <i
                        className="fa-solid fa-trash fa-sm"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Delete This Barcode"
                      ></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center">
            <p className="text-center">No Barcode Found.</p>
            <p className="text-muted" style={{ marginTop: "-1.5%" }}>
              Start Creating Barcodes <Link to="/barcode">Now</Link>
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
            <div class="modal-body">{`Are you sure you want to delete ${bc.name}-${bc.id}`}</div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-outline-secondary btn-sm"
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

export default Bcs;
