import React, { useState } from "react";
import "./Styling/home.css";

const Main = () => {
  const [url, setUrl] = useState("");
  const [surl, setSurl] = useState(false);
  const [time, setTime] = useState(12);
  const [pass, setPass] = useState(false);
  const [passval, setPassval] = useState("");

  const handleSubmit = () => {
    console.log("Shortening URL:", url);
    console.log("Active time:", time);
    console.log("Password protect:", passval);
    setSurl(true);
  };

  return (
    <div className="hero-section-alt" style={{ marginTop: "3px" }}>
      <div className="container text-center text-white">
        <h1 className="display-4 fw-bold">
          Shorten, Share, and Track Your URLs
        </h1>
        <p className="lead">
          Create short, trackable, and secure links in seconds!
        </p>

        <div className="mt-4">
          <div className="row">
            <div className="col-md-8 text-center text-md-start mb-4 mb-md-0 px-4">
              <input
                type="text"
                className="form-control shadow-sm"
                placeholder="Enter your URL here"
                style={{
                  width: "90%",
                  borderRadius: "30px",
                  padding: "10px 20px",
                }}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <div className="col-md-4 d-flex justify-content-center text-white">
              <div
                className="card p-4 shadow-sm bg-transparent"
                style={{ maxWidth: "400px" }}
              >
                <h4 className="text-center mb-4">Customize Your URL</h4>

                {/* Password Protect Toggle */}
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
                    onChange={() => setPass(!pass)}
                  />
                </div>

                {/* Conditional Password Field */}
                {pass && (
                  <div className="mb-3">
                    <input
                      type="password"
                      className="form-control shadow-sm"
                      placeholder="Enter password"
                    />
                  </div>
                )}

                {/* Active Time Dropdown */}
                <div className="mb-3">
                  <label htmlFor="activeTime" className="form-label">
                    <i className="fas fa-clock"></i> Active Time
                  </label>
                  <select className="form-select shadow-sm" id="activeTime">
                    <option value="24">Default 24 Hours</option>
                    <option value="48">48 Hours</option>
                    <option value="7d">7 Days</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div
            className="d-flex justify-content-center"
            style={{ marginTop: "30px" }}
          >
            {!surl ? (
              <button
                className="btn btn-warning btn-lg mx-2 shadow-sm"
                onClick={handleSubmit}
              >
                Shorten URL
              </button>
            ) : (
              <button
                className="btn btn-secondary btn-lg mx-2 shadow-sm"
                onClick={() => setSurl(false)}
              >
                Shorten Another
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
