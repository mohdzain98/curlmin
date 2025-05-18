import React, { useEffect, useState, useContext } from "react";
import { useMediaQuery } from "react-responsive";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { userContext, userAccContext } from "../../../Context/userContext";
import Urls from "./Urls.js";
import Qrs from "./Qrs.js";
import Cts from "./Cts.js";
import Bcs from "./Bcs.js";
import Imgs from "./Imgs.js";

const User = (props) => {
  const { showAlert, host } = props.prop;
  const [activeTab, setActiveTab] = useState("dashboard");
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  // const [searchParams, setSearchParams] = useSearchParams();
  const [searchParams] = useSearchParams();
  const context = useContext(userContext);
  const accontext = useContext(userAccContext);
  const { dbdata, fetchCounts } = accontext;
  const { userIdRef } = context;
  const userId = userIdRef.current;

  useEffect(() => {
    document.title = "User Data | Curlmin";
    const token = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("curlmin-userId");
    if (!token) {
      showAlert("Not Allowed! Kindly Login", "danger");
      navigate("/login");
    } else {
      const isDashboard = searchParams.has("dashboard");
      const isUrl = searchParams.has("urls");
      const isQR = searchParams.has("qrcodes");
      const isBc = searchParams.has("barcodes");
      const isCt = searchParams.has("curltags");
      const isIm = searchParams.has("images");
      const tab = isDashboard
        ? "dashboard"
        : isUrl
        ? "urls"
        : isQR
        ? "qrcodes"
        : isBc
        ? "barcodes"
        : isCt
        ? "curltags"
        : isIm
        ? "images"
        : "unknown";
      setActiveTab(tab);
      userIdRef.current = storedUserId;
      fetchCounts(storedUserId);
      setIsLoading(false);
    }
    // eslint-disable-next-line
  }, [searchParams]);

  useEffect(() => {
    if (userId) {
      fetchCounts(userId);
    }
    // eslint-disable-next-line
  }, [userId]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center">
        <span className="spinner-border p-3"></span>
      </div>
    );
  }
  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    navigate(`/urls?${selectedValue}`);
    setActiveTab(e.target.value);
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          {!isTabletOrMobile ? (
            <nav className="col-md-2 d-md-block bg-light sidebar min-vh-100 nav-pills border-end">
              <div className="position-sticky pt-5">
                <ul className="nav flex-column">
                  <li className="nav-item">
                    <Link
                      to={"/urls?dashboard"}
                      className={`nav-link ${
                        activeTab === "dashboard" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("dashboard")}
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to={"/urls?urls"}
                      className={`nav-link ${
                        activeTab === "urls" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("urls")}
                    >
                      URLs
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to={"/urls?qrcodes"}
                      className={`nav-link ${
                        activeTab === "qrcodes" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("qrcodes")}
                    >
                      Qrcodes
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to={"/urls?barcodes"}
                      className={`nav-link ${
                        activeTab === "barcodes" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("barcodes")}
                    >
                      Barcodes
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to={"/urls?curltags"}
                      className={`nav-link ${
                        activeTab === "curltags" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("curltags")}
                    >
                      Curltag
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to={"/urls?images"}
                      className={`nav-link ${
                        activeTab === "images" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("images")}
                    >
                      Images
                    </Link>
                  </li>
                </ul>
              </div>
            </nav>
          ) : (
            <div className="container px-4 mt-2">
              <select
                className="form-select"
                aria-label="Default select example"
                onChange={handleSelectChange}
                value={activeTab}
              >
                <option value="dashboard">Dashboard</option>
                <option value="urls">Urls</option>
                <option value="qrcodes">Qr codes</option>
                <option value="barcodes">Barcodes</option>
                <option value="curltags">Curltag</option>
                <option value="images">Images</option>
              </select>
            </div>
          )}

          {/* Main Content */}
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <div className="container p-4">
              <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2">{`Curlmin User ${
                  activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
                }`}</h1>
              </div>

              {/* Dashboard Cards */}
              {activeTab === "dashboard" && (
                <>
                  <div className="row">
                    {dbdata.map((element) => {
                      return (
                        <div className="col-md-3">
                          <Link
                            style={{ textDecoration: "none", color: "black" }}
                            to={`/urls?${element.name}`}
                          >
                            <div
                              className="card mb-4 shadow-sm"
                              onClick={() => setActiveTab(element.name)}
                            >
                              <div className="card-body">
                                <h5 className="card-title">
                                  Total{" "}
                                  {element.name.charAt(0).toUpperCase() +
                                    element.name.slice(1)}
                                </h5>
                                <h2 className="card-text">{element.count}</h2>
                              </div>
                            </div>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                  <div className="d-flex justify-content-center aligh-items-center mb-4">
                    <div
                      className="alert alert-success text-center"
                      role="alert"
                      style={{ width: "70%" }}
                    >
                      <i className="fa-solid fa-certificate me-2"></i>
                      Now You can share your QR, Barcodes and curltags with
                      short URLs
                      {/* <span className="badge bg-success ms-2 px-3">New</span> */}
                      <i className="fa-solid fa-certificate ms-2"></i>
                    </div>
                  </div>
                </>
              )}
              {activeTab === "urls" && <Urls prop={{ showAlert }} />}
              {activeTab === "qrcodes" && <Qrs prop={{ showAlert }} />}
              {activeTab === "curltags" && <Cts prop={{ showAlert }} />}
              {activeTab === "barcodes" && <Bcs prop={{ showAlert }} />}
              {activeTab === "images" && <Imgs prop={{ showAlert, host }} />}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default User;
