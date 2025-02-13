import React from "react";
import "./Styling/footer.css";
import Captcha from "../Captcha";
import { Link } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { useMediaQuery } from "react-responsive";

const Footer = () => {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  return (
    <div id="footer">
      <footer className="bg-dark text-white pt-5 pb-3">
        <div className="container">
          {!isTabletOrMobile ? (
            <div className="row pb-4">
              <div className="col-md-4">
                <h3 className="h5 fw-bold mb-3 ">Curlmin</h3>
                <p className="text-muted ">
                  Create short, trackable, and secure links in seconds!
                </p>
                <ul className="list-unstyled">
                  <li style={{ fontWeight: "lighter" }}>
                    <i className="fa-regular fa-copyright fa-sm me-2"></i>
                    curlmin 2025
                  </li>
                  <li style={{ fontWeight: "lighter" }}>Made in India</li>
                </ul>
              </div>
              <div className="col-md-2">
                <h4 className="h6 fw-semibold mb-3">Quick Links</h4>
                <ul className="list-unstyled">
                  <li>
                    <Link
                      to="/"
                      className="text-decoration-none "
                      onClick={() =>
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      }
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <ScrollLink
                      to="qr"
                      smooth={true}
                      duration={50}
                      className="text-decoration-none"
                      style={{ cursor: "pointer" }}
                    >
                      Services
                    </ScrollLink>
                  </li>
                  <li>
                    <Link
                      to="/scanner/barcode"
                      className="text-decoration-none"
                    >
                      Barcode Scanner
                    </Link>
                  </li>
                  {/* <li>
                    <Link to="/" className="text-decoration-none">
                      Pricing
                    </Link>
                  </li> */}
                </ul>
              </div>
              <div className="col-md-2">
                <h4 className="h6 fw-semibold mb-3">Sections</h4>
                {!localStorage.getItem("token") ? (
                  <ul class="list-unstyled">
                    <li>
                      <Link to="/login" className=" text-decoration-none">
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link to="/signup" className=" text-decoration-none">
                        Signup
                      </Link>
                    </li>
                  </ul>
                ) : (
                  <ul class="list-unstyled">
                    <li>
                      <Link
                        to="/account?details"
                        className=" text-decoration-none"
                      >
                        Account
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/urls?dashboard"
                        className=" text-decoration-none"
                      >
                        URLs
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
              <div className="col-md-2">
                <h4 className="h6 fw-semibold mb-3">Support</h4>
                <ul className="list-unstyled">
                  <li>
                    <Link to="/help-center" className=" text-decoration-none">
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link to="/contactus" className=" text-decoration-none">
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/privacy-policy"
                      className=" text-decoration-none"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link to="/faq" className="text-decoration-none">
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="col-md-2">
                <h4 className="h6 fw-bold mb-3">Follow Us</h4>
                <div className="d-flex gap-3">
                  <Link to="/">
                    <i className="fa-brands fa-twitter"></i>
                  </Link>
                  <Link to="/">
                    <i className="fa-brands fa-facebook"></i>
                  </Link>
                  <Link to="/">
                    <i className="fa-brands fa-linkedin"></i>
                  </Link>
                </div>
                <Captcha />
              </div>
            </div>
          ) : (
            <div className="d-flex flex-column">
              <div>
                <h3 className="h5 fw-bold mb-3 ">Curlmin</h3>
                <p className="text-muted ">
                  Create short, trackable, and secure links in seconds!
                </p>
                <ul className="list-unstyled">
                  <li style={{ fontWeight: "lighter" }}>
                    <i className="fa-regular fa-copyright fa-sm me-2"></i>
                    curlmin 2024
                  </li>
                  <li style={{ fontWeight: "lighter" }}>Made in India</li>
                </ul>
              </div>
              <div class="accordion accordion-flush p-1" id="footerAccordion">
                <div class="accordion-item bg-dark">
                  <h2 class="accordion-header" id="flush-headingOne">
                    <button
                      class="accordion-button collapsed text-white bg-dark"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#flush-collapseOne"
                      aria-expanded="false"
                      aria-controls="flush-collapseOne"
                    >
                      Quick Links
                    </button>
                  </h2>
                  <div
                    id="flush-collapseOne"
                    class="accordion-collapse collapse"
                    aria-labelledby="flush-headingOne"
                    data-bs-parent="#accordionFlushExample"
                  >
                    <div class="accordion-body">
                      <ul class="list-unstyled">
                        <li>
                          <Link
                            to="/"
                            onClick={() =>
                              window.scrollTo({ top: 0, behavior: "smooth" })
                            }
                            className=" text-decoration-none"
                          >
                            Home
                          </Link>
                        </li>
                        <li>
                          <ScrollLink
                            to="qr"
                            smooth={true}
                            duration={50}
                            className="text-decoration-none"
                            style={{ cursor: "pointer" }}
                          >
                            Services
                          </ScrollLink>
                        </li>
                        {/* <li>
                          <Link to="/" className=" text-decoration-none">
                            Pricing
                          </Link>
                        </li> */}
                        <li>
                          <Link
                            to="barcode-scanner"
                            className=" text-decoration-none"
                          >
                            Barcode scanner
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="accordion-item bg-dark">
                  <h2 class="accordion-header">
                    <button
                      class="accordion-button collapsed text-white bg-dark"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#productsCollapse"
                      aria-expanded="false"
                      aria-controls="productsCollapse"
                    >
                      Sections
                    </button>
                  </h2>
                  <div
                    id="productsCollapse"
                    class="accordion-collapse collapse"
                    data-bs-parent="#footerAccordion"
                  >
                    <div class="accordion-body">
                      {!localStorage.getItem("token") ? (
                        <ul class="list-unstyled">
                          <li>
                            <Link to="/login" className=" text-decoration-none">
                              Login
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/signup"
                              className=" text-decoration-none"
                            >
                              Signup
                            </Link>
                          </li>
                        </ul>
                      ) : (
                        <ul class="list-unstyled">
                          <li>
                            <Link
                              to="/account?details"
                              className=" text-decoration-none"
                            >
                              Account
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/urls?dashboard"
                              className=" text-decoration-none"
                            >
                              URLs
                            </Link>
                          </li>
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
                <div class="accordion-item bg-dark">
                  <h2 class="accordion-header">
                    <button
                      class="accordion-button collapsed text-white bg-dark"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#resourcesCollapse"
                      aria-expanded="false"
                      aria-controls="resourcesCollapse"
                    >
                      Support
                    </button>
                  </h2>
                  <div
                    id="resourcesCollapse"
                    class="accordion-collapse collapse"
                    data-bs-parent="#footerAccordion"
                  >
                    <div class="accordion-body">
                      <ul class="list-unstyled">
                        <li>
                          <Link
                            to="/help-center"
                            className=" text-decoration-none"
                          >
                            Help Center
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/contactus"
                            className=" text-decoration-none"
                          >
                            Contact Us
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/privacy-policy"
                            className=" text-decoration-none"
                          >
                            Privacy Policy
                          </Link>
                        </li>
                        <li>
                          <Link to="/faq" className=" text-decoration-none">
                            Faq
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="h6 fw-bold mb-3">Follow Us</h4>
                <div className="d-flex gap-3">
                  <Link to="/">
                    <i className="fa-brands fa-twitter"></i>
                  </Link>
                  <Link to="/">
                    <i className="fa-brands fa-facebook"></i>
                  </Link>
                  <Link to="/">
                    <i className="fa-brands fa-linkedin"></i>
                  </Link>
                </div>
                <Captcha />
              </div>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};

export default Footer;
