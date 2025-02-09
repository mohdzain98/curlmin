import React, { useState, useContext, useEffect } from "react";
import "./Styling/home.css";
import { useMediaQuery } from "react-responsive";
import { userContext } from "../../Context/userContext";
import { Link } from "react-router-dom";
import {
  shareOnWhatsApp,
  shareOnFacebook,
  shareOnEmail,
  shareOnLinkedIn,
  shareOnTwitter,
} from "./Share";

const Main2 = (props) => {
  const { showAlert } = props.prop;
  const [url, setUrl] = useState("");
  const [surl, setSurl] = useState(false);
  const [time, setTime] = useState("per");
  const [passval, setPassval] = useState("");
  const [surlval, setSurlval] = useState("");
  const [loader, setLoader] = useState("");
  const [respUid, setResUid] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pass, setPass] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const context = useContext(userContext);
  const { userIdRef, createShortUrl, isValidUrl } = context;
  const userId = userIdRef.current === "" ? "default" : userIdRef.current;

  useEffect(() => {
    document.title = "curlmin | Short, Share and Track your Urls";
  }, []);

  const creationDate = () => {
    const cDate = new Date();

    const pad = (num) => String(num).padStart(2, "0");
    const year = cDate.getFullYear();
    const month = pad(cDate.getMonth() + 1);
    const day = pad(cDate.getDate());
    const hours = pad(cDate.getHours());
    const minutes = pad(cDate.getMinutes());
    const seconds = pad(cDate.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const expiryDate = () => {
    if (!time) {
      showAlert("Time is not defined or empty", "danger");
      return 0;
    }
    if (time === "per") {
      return "9999-12-31 23:53:59";
    } else {
      const selectedOption = time.toString();
      const currentDate = new Date();
      const exdate = new Date(currentDate);

      if (selectedOption.endsWith("d")) {
        const daysToAdd = parseInt(selectedOption.replace("d", ""));
        exdate.setDate(exdate.getDate() + daysToAdd);
      } else if (selectedOption.endsWith("m")) {
        const monthsToAdd = parseInt(selectedOption.replace("m", ""));
        exdate.setMonth(exdate.getMonth() + monthsToAdd);
      } else if (selectedOption.endsWith("min")) {
        const minutesToAdd = parseInt(selectedOption.replace("min", ""));
        exdate.setMinutes(exdate.getMinutes() + minutesToAdd);
      } else {
        const hoursToAdd = parseInt(selectedOption);
        exdate.setHours(exdate.getHours() + hoursToAdd);
      }
      // const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      // const options = {
      //   timeZone: userTimeZone,
      //   year: "numeric",
      //   month: "2-digit",
      //   day: "2-digit",
      //   hour: "2-digit",
      //   minute: "2-digit",
      //   second: "2-digit",
      //   hour12: false,
      // };

      // // const formatter = new Intl.DateTimeFormat("en-GB", options);
      // // const parts = formatter.formatToParts(exdate);

      // // const year = parts.find((p) => p.type === "year").value;
      // // const month = parts.find((p) => p.type === "month").value;
      // // const day = parts.find((p) => p.type === "day").value;
      // // const hours = parts.find((p) => p.type === "hour").value;
      // // const minutes = parts.find((p) => p.type === "minute").value;
      // // const seconds = parts.find((p) => p.type === "second").value;

      const pad = (num) => String(num).padStart(2, "0");
      const year = exdate.getFullYear();
      const month = pad(exdate.getMonth() + 1);
      const day = pad(exdate.getDate());
      const hours = pad(exdate.getHours());
      const minutes = pad(exdate.getMinutes());
      const seconds = pad(exdate.getSeconds());

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) {
      showAlert("Please enter your URL", "danger");
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
      const formattedDate = expiryDate();
      const creationdate = creationDate();
      console.log(creationdate, formattedDate);
      if (!formattedDate) {
        showAlert("Failed to calculate expiry date", "danger");
        return;
      }
      const data = await createShortUrl(
        userId,
        url,
        pass,
        passval,
        creationdate,
        formattedDate
      );
      if (data) {
        showAlert(data.message, "success");
        setSurlval(data.shortUrl);
        setResUid(data.uid);
        setSurl(true);
      }
    } catch (error) {
      showAlert("An error occurred during submission", "danger");
    } finally {
      setLoader("");
      setIsLoading(false);
    }
  };

  const handleSurl = () => {
    setSurl(false);
    setUrl("");
    setPassval("");
    setPass(false);
    setTime("per");
    setIsChecked(false);
    setIsLoading(false);
  };

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(surlval);
      showAlert("copied successfully", "success");
    } catch (error) {
      // console.log(error);
      showAlert("error occurred in copying", "danger");
    }
  };

  return (
    <div
      className="container-fluid d-flex align-items-center"
      style={{
        // background: "linear-gradient(to right, #f8f9fa, #e9ecef)", // Light gradient
        backgroundColor: "#8EC5FC",
        backgroundImage: "linear-gradient(62deg, #8EC5FC 0%, #E0C3FC 100%)",
        padding: "7% 0",
      }}
    >
      <div className="container p-4">
        <div className="row">
          {/* Left Column */}
          <div className="col-md-7 col-xs-12 text-center text-md-start mb-4 mb-md-0">
            <h1 className="fw-bold">Shorten, Share, and Track Your URLs</h1>
            <p className="text-muted">
              Create short, trackable, and secure links in seconds!
            </p>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                className="form-control shadow-lg urlin"
                placeholder="Enter your URL here"
                style={{ borderRadius: "30px", padding: "10px 20px" }}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <i
                className="fa-solid fa-x fa-sm text-secondary"
                style={{
                  position: "absolute",
                  right: "20px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                }}
                onClick={() => setUrl("")} // Clear the input on click
              />
            </div>
            {surl && (
              <div className="d-flex flex-row align-items-center flex-wrap">
                <input
                  type="text"
                  className={`form-control shadow-lg mt-3`}
                  style={{
                    borderRadius: "30px",
                    padding: "10px 20px",
                    width: isTabletOrMobile ? "100%" : "60%",
                  }}
                  value={surlval}
                />
                <div>
                  <button
                    className="btn btn-default copybox"
                    onClick={handleCopy}
                  >
                    <i className="fa-solid fa-copy me-2"></i>Copy
                  </button>
                </div>
                <div>
                  <div className="dropdown">
                    <button
                      className="btn btn-default dropdown-toggle copybox"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="fa-solid fa-share me-2"></i>
                      Share
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <a
                          className="dropdown-item"
                          href="/"
                          onClick={(e) => {
                            e.preventDefault();
                            shareOnWhatsApp(surlval);
                          }}
                        >
                          Whatsapp
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item"
                          href="/"
                          onClick={(e) => {
                            e.preventDefault();
                            shareOnFacebook(surlval);
                          }}
                        >
                          Facebook
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item"
                          href="/"
                          onClick={(e) => {
                            e.preventDefault();
                            shareOnTwitter(surlval);
                          }}
                        >
                          Twitter
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item"
                          href="/"
                          onClick={(e) => {
                            e.preventDefault();
                            shareOnEmail(surlval);
                          }}
                        >
                          Email
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item"
                          href="/"
                          onClick={(e) => {
                            e.preventDefault();
                            shareOnLinkedIn(surlval);
                          }}
                        >
                          Linkedin
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                {!localStorage.getItem("token") && (
                  <p
                    className="ms-3 mt-3 text-muted"
                    style={{ fontSize: "14px" }}
                  >
                    <Link to={`/login?s=url&id=${respUid}`}>Login</Link> or{" "}
                    <Link to={`/signup?s=url&id=${respUid}`}>Signup</Link> to
                    save your Url
                  </p>
                )}
              </div>
            )}
            {!surl ? (
              <button
                className="btn btn-warning shadow-lg mt-4 ms-2"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                <i className="fas fa-link me-2"></i>
                {isLoading ? (
                  <span>
                    Shortening..
                    <span
                      className={`ms-2 ${loader}`}
                      role="status"
                      aria-hidden="true"
                    ></span>
                  </span>
                ) : (
                  "Shorten Url"
                )}
              </button>
            ) : (
              <button
                className="btn btn-secondary shadow-lg mt-4 ms-2"
                onClick={handleSurl}
              >
                <i className="fas fa-link"></i> Shorten Another
              </button>
            )}
          </div>

          {/* Right Column */}
          <div className="col-md-5 col-xs-12 d-flex justify-content-center">
            <div
              className="card p-4 shadow-lg w-100 bg-transparent"
              style={{ maxWidth: "400px" }}
            >
              <h4 className="text-center mb-4">Customize Your URL</h4>

              {/* Active Time Dropdown */}
              <div className="mb-3">
                <label htmlFor="activeTime" className="form-label">
                  <i className="fas fa-clock"></i> Active Time
                </label>
                <select
                  className="form-select shadow-lg"
                  id="activeTime"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  disabled={surl ? true : false}
                >
                  <option value="per">Default Permanent</option>
                  <option value="12">12 Hours</option>
                  <option value="20min">20 Minutes</option>
                  <option value="24">24 Hours</option>
                  <option value="48">48 Hours</option>
                  <option value="7d">7 Days</option>
                  <option value="1m">1 Month </option>
                  <option value="6m">6 Month</option>
                  <option value="12m">12 Month</option>
                </select>
              </div>

              <div className="d-flex align-items-center mb-3">
                <label
                  className="form-check-label me-2"
                  htmlFor="passwordToggle"
                >
                  <i className="fas fa-lock"></i> Password Protect
                </label>
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="passwordToggle"
                  onChange={() => {
                    setPass(!pass);
                    setIsChecked(!isChecked);
                  }}
                  disabled={surl ? true : false}
                  checked={isChecked}
                />
              </div>

              <div
                className={`mb-3 ${pass ? "visible" : "invisible"} input-group`}
                style={{
                  transition: "opacity 0.3s ease, height 0.3s ease",
                  overflow: "hidden",
                }}
              >
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control shadow-lg"
                  placeholder="Enter password"
                  style={{ visibility: pass ? "visible" : "hidden" }}
                  value={passval}
                  onChange={(e) => setPassval(e.target.value)}
                  disabled={surl ? true : false}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main2;
