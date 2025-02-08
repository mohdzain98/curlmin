import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const Captcha = () => {
  useEffect(() => {
    // Hide badge
    const style = document.createElement("style");
    style.innerHTML = `
    .grecaptcha-badge {
      visibility: hidden !important;
    }
  `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);
  return (
    <div>
      <p style={{ fontSize: "10px", textAlign: "justify" }} className="mt-2">
        This site is protected by reCAPTCHA and the Google
        <Link
          to="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener"
          className="mx-1"
        >
          Privacy Policy
        </Link>{" "}
        and{" "}
        <Link
          to="https://policies.google.com/terms"
          target="_blank"
          rel="noopener"
          className="me-1"
        >
          Terms of Service
        </Link>{" "}
        apply
      </p>
    </div>
  );
};

export default Captcha;
