import React, { useEffect, useRef, useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { userContext } from "../Context/userContext";
import { useMediaQuery } from "react-responsive";

const Navbar = (props) => {
  const { Logdin, showAlert } = props.prop;
  const navigate = useNavigate();
  const context = useContext(userContext);
  const { user, getUser, updateUser } = context;
  let ref = useRef(null);
  let serviceref = useRef(null);
  let scanneref = useRef(null);
  let supportref = useRef(null);
  let location = useLocation();
  const [searchParams, setSearchParams] = useState({ s: "", id: "" });
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  useEffect(() => {
    localStorage.getItem("token") && getUser();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const s = params.get("s");
    const id = params.get("id");

    if (s || id) {
      setSearchParams({ s: s, id: id });
      console.log("login", s, id);
    }
  }, [location]);

  const rollNavBack = () => {
    isTabletOrMobile && ref.current.click();
  };

  const handleService = () => {
    serviceref.current.click();
  };
  const handleSupport = () => {
    supportref.current.click();
  };
  const handleScanner = () => {
    scanneref.current.click();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("curlmin-userId");
    navigate("/");
    showAlert("Logged Out", "primary");
    rollNavBack();
    Logdin();
    updateUser();
  };

  const getInitials = (name) => {
    return name
      .trim()
      .split(" ")
      .filter((word) => word)
      .map((word) => word[0].toUpperCase())
      .join("");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary" to="/">
          curlmin
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
          ref={ref}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item me-2">
              <Link
                className={`nav-link ${
                  location.pathname === "/" ? "active" : ""
                }`}
                aria-current="page"
                to="/"
                onClick={rollNavBack}
              >
                Home
              </Link>
            </li>
            <li className="nav-item dropdown me-2">
              <a
                className={`nav-link dropdown-toggle ${
                  location.pathname === "/qrcode" ||
                  location.pathname === "/barcode" ||
                  location.pathname === "/curltag"
                    ? "active"
                    : ""
                }`}
                href="/"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                ref={serviceref}
              >
                Services
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <Link
                    className="dropdown-item"
                    to="/qrcode"
                    onClick={() => {
                      rollNavBack();
                      handleService();
                    }}
                  >
                    QR Code
                  </Link>
                  <Link
                    className="dropdown-item"
                    to="/barcode"
                    onClick={() => {
                      rollNavBack();
                      handleService();
                    }}
                  >
                    Barcode
                  </Link>
                  <Link
                    className="dropdown-item"
                    to="/curltag"
                    onClick={() => {
                      rollNavBack();
                      handleService();
                    }}
                  >
                    Curltag
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav-item dropdown me-2">
              <a
                className={`nav-link dropdown-toggle ${
                  location.pathname === "/barcode-scanner" ? "active" : ""
                }`}
                href="/"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                ref={scanneref}
              >
                Scanners
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <Link
                    className="dropdown-item"
                    to="/barcode-scanner"
                    onClick={() => {
                      rollNavBack();
                      handleScanner();
                    }}
                  >
                    Barcode
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav-item dropdown me-2">
              <a
                className={`nav-link dropdown-toggle ${
                  location.pathname === "/help-center" ||
                  location.pathname === "/contactus"
                    ? "active"
                    : ""
                }`}
                href="/"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                ref={supportref}
              >
                Support
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <Link
                    className="dropdown-item"
                    to="/help-center"
                    onClick={() => {
                      rollNavBack();
                      handleSupport();
                    }}
                  >
                    Help Center
                  </Link>
                  <Link
                    className="dropdown-item"
                    to="/contactus"
                    onClick={() => {
                      rollNavBack();
                      handleSupport();
                    }}
                  >
                    Contactus
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
          {!localStorage.getItem("token") ? (
            <form className="d-flex">
              <Link
                style={{
                  display: `${
                    location.pathname === "/login" ? "none" : "initial"
                  }`,
                }}
                className="btn btn-outline-primary btn-sm mx-1"
                role="button"
                to={
                  searchParams.s !== ""
                    ? `/login?s=${searchParams.s}&id=${searchParams.id}`
                    : "/login"
                }
                onClick={rollNavBack}
              >
                Login
              </Link>
              <Link
                style={{
                  display: `${
                    location.pathname === "/signup" ? "none" : "initial"
                  }`,
                }}
                className="btn btn-primary btn-sm mx-1"
                role="button"
                to={
                  searchParams.s !== ""
                    ? `/signup?s=${searchParams.s}&id=${searchParams.id}`
                    : "/signup"
                }
                onClick={rollNavBack}
              >
                Signup
              </Link>
            </form>
          ) : (
            <div className="dropdown">
              <button
                type="button"
                className="btn btn-secondary dropdown-toggle mx-2 me-2 d-flex flex-row align-items-center"
                data-bs-toggle="dropdown"
                data-bs-display="static"
                aria-expanded="false"
              >
                <i
                  className="fa-solid fa-user me-2"
                  style={{ color: "#FFD43B" }}
                ></i>
                {getInitials(user.name)}
              </button>
              <ul className="dropdown-menu dropdown-menu-lg-end">
                <li style={{ marginBottom: "0px" }}>
                  <h5
                    className="dropdown-item"
                    style={{ marginBottom: "0px", paddingBottom: "0px" }}
                  >
                    {user.name}
                    <p
                      className="text-muted mt-1"
                      style={{ fontSize: "14px", paddingBottom: "0px" }}
                    >
                      {user.email}
                    </p>
                  </h5>
                </li>
                <li>
                  <hr class="dropdown-divider" />
                </li>
                <li className="mb-1">
                  <Link
                    to="/account?details"
                    className="dropdown-item"
                    type="button"
                    onClick={rollNavBack}
                  >
                    <i className="fa-solid fa-house fa-sm me-1"></i> Account
                  </Link>
                </li>
                <li>
                  <Link
                    to="/urls?dashboard"
                    className="dropdown-item"
                    type="button"
                    onClick={rollNavBack}
                  >
                    <i className="fa-solid fa-link fa-sm me-1"></i>URLs
                  </Link>
                </li>
                <li className="d-flex justify-content-center my-3">
                  <button
                    className="btn btn-outline-danger btn-sm px-3"
                    onClick={handleLogout}
                    type="button"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
