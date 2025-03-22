import React, { useRef } from "react";
import { Link } from "react-router-dom";
import {
  shareOnWhatsApp,
  shareOnTwitter,
  shareOnLinkedIn,
  shareOnEmail,
} from "../../Home/Share";

const Share = (props) => {
  const { uid, ep, showAlert, page = "user" } = props.prop;
  // const surl = `https://curlm.in/${uid}`;
  const link =
    ep === ""
      ? `https://curlm.in/${uid}`
      : `https://curlm.in/${ep}/${uid.slice(2)}`;
  const toastRef = useRef(null);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      // Show Bootstrap Toast
      if (page === "user") {
        const toast = new window.bootstrap.Toast(toastRef.current);
        toast.show();
      } else {
        showAlert("Copied Successfully", "success");
      }
    });
  };
  return (
    <>
      <div className="border rounded">
        <div className="btn-group">
          <Link
            to={link}
            style={{ color: "black" }}
            target="_blank"
            rel="noreferrer"
          >
            <button className="btn btn-default btn-sm">
              <i className="fa-solid fa-share fa-sm"></i>
            </button>
          </Link>
          <button
            className="btn btn-default btn-sm"
            onClick={() => copyToClipboard(link)}
            id="liveToastBtn"
          >
            <i className="fa-solid fa-link fa-sm"></i>
          </button>
          <button
            className="btn btn-default btn-sm"
            onClick={() => shareOnWhatsApp(link)}
          >
            <i
              className="fa-brands fa-whatsapp fa-sm"
              style={{ color: "green" }}
            ></i>
          </button>
          <button
            className="btn btn-default btn-sm"
            onClick={() => shareOnTwitter(link)}
          >
            <i
              className="fa-brands fa-x-twitter fa-sm"
              style={{ color: "black" }}
            ></i>
          </button>
          <button
            className="btn btn-default btn-sm"
            onClick={() => shareOnLinkedIn(link)}
          >
            <i
              className="fa-brands fa-linkedin fa-sm"
              style={{ color: "blue" }}
            ></i>
          </button>
          <button
            className="btn btn-default btn-sm"
            onClick={() => shareOnEmail(link)}
          >
            <i
              className="fa-solid fa-envelope fa-sm"
              style={{ color: "red" }}
            ></i>
          </button>
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
    </>
  );
};

export default Share;
