import React, { useState, useContext, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { userContext } from "../Context/userContext";
import ReCAPTCHA from "react-google-recaptcha";

const Signup = (props) => {
  const { host, showAlert, Logdout, c_sitekey } = props.prop;
  const [showPassword, setShowPassword] = useState(false);
  const [showCpassword, setShowCpassword] = useState(false);
  const [cred, setCred] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });
  const navigate = useNavigate();
  const context = useContext(userContext);
  const { getUser, sendEmail, verifyEmail, verifyCaptcha, updateUserId } =
    context;
  const [loader, setLoader] = useState("");
  const [mloader, setMloader] = useState(false);
  const [rsloader, setRsloader] = useState(false);
  const [captcha, setCaptcha] = useState(true);
  const [disable, setDisable] = useState(false);
  const captchaRef = useRef(null);
  const otpModal = useRef(null);
  const modalClose = useRef(null);
  const [otp, setOtp] = useState("");
  const [rotp, setRotp] = useState({ msg: "", bg: "" });
  const [valid, setValid] = useState("invisible");
  const [cdown, setCdown] = useState(60);
  const [rsbtn, setRsbtn] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [searchParams, setSearchParams] = useState({ s: "", id: "" });

  useEffect(() => {
    document.title = "curlmin | signup";
    if (localStorage.getItem("token")) {
      navigate("/");
    } else {
      setLoading(false);
    }
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

  const googleSignup = async (gtoken) => {
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${gtoken}`,
      {
        headers: {
          Authorization: `Bearer ${gtoken}`,
          Accept: "application/json",
        },
      }
    );
    const data = await response.json();
    handleSubmit(data.name, data.email, data.id, data.id);
  };

  const signup = useGoogleLogin({
    onSuccess: (codeResponse) => {
      googleSignup(codeResponse.access_token);
    },
    onError: (error) =>
      showAlert(`${error} - Kindly Signup Manually`, "danger"),
  });

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-item-center my-2">
        <span className="spinner-border"></span>
      </div>
    );
  }

  const verifyUser = async (e) => {
    e.preventDefault();
    setLoader("spinner-border");
    setDisable(true);
    const { name, email, password, cpassword } = cred;
    try {
      if (password !== cpassword) {
        showAlert("Password and Confirm password does not match", "danger");
        setLoader("");
        setDisable(false);
      } else {
        const token = captchaRef.current.getValue();
        const reply = await verifyCaptcha(token);
        // const reply = { stat: true };
        if (reply.stat) {
          const check = await fetch(`${host}/auth/existuser`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: email }),
          });
          if (check.status === 500) {
            showAlert("Some Error Occurred", "danger");
            setLoader("");
          } else {
            const checkr = await check.json();
            if (checkr.success) {
              showAlert("Email Already exist kindly Login", "primary");
              setLoader("");
              setDisable(false);
            } else {
              const reply = await sendEmail(name, email, "signup");
              // const reply = { success: true, uid: "000" };
              if (reply.success) {
                localStorage.setItem("otpID", reply.uid);
                otpModal.current.click();
                setLoader("");
                let timeLeft = 60; // 60 seconds
                const countdown = setInterval(() => {
                  timeLeft--;
                  setCdown(timeLeft);
                  if (timeLeft <= 0) {
                    clearInterval(countdown);
                    setRsbtn(true);
                  }
                }, 1000); // 1000 milliseconds = 1 second
              } else {
                showAlert("Error Sending OTP, Try after some time", "danger");
                setLoader("");
                setDisable(false);
              }
            }
          }
        } else {
          showAlert(reply.msg, "danger");
        }
      }
      captchaRef.current.reset();
      setCaptcha(false);
    } catch (error) {
      showAlert("some error has occurred", "danger");
      setLoader("");
      setDisable(false);
    }
  };

  const onChangeModal = (e) => {
    setOtp(e.target.value);
  };

  const displayrotpmess = (message, bg) => {
    setRotp({ msg: message, bg: bg });
    setTimeout(() => {
      setRotp({ msg: "", bg: "" });
    }, 1000);
  };
  const otpResend = async () => {
    const { name, email } = cred;
    setCdown(60);
    setRsloader(true);
    const reply = await sendEmail(name, email);
    // const reply = { success: true, uid: "000" };
    if (reply.success) {
      displayrotpmess("OTP resend successfully", "green");
      localStorage.setItem("otpID", reply.uid);
      setRsbtn(false);
      let timeLeft = 60; // 60 seconds
      const countdown = setInterval(() => {
        timeLeft--;
        setCdown(timeLeft);
        if (timeLeft <= 0) {
          clearInterval(countdown);
          setRsbtn(true);
          setRsloader(false);
        }
      }, 1000); // 1000 milliseconds = 1 second
    } else {
      displayrotpmess("Error sending OTP, please try after sometime", "red");
      setRsloader(false);
    }
  };

  const handleVer = async () => {
    const uid = localStorage.getItem("otpID");
    setMloader(true);
    const resp = await verifyEmail(uid, otp);
    if (resp.success) {
      modalClose.current.click();
      showAlert("OTP verified Successully", "primary");
      handleSubmit(cred.name, cred.email, cred.password, cred.cpassword);
      setMloader(false);
    } else {
      setValid("visible");
      setTimeout(() => {
        setValid("invisible");
      }, "2000");
      setMloader(false);
    }
  };

  const handleSubmit = async (name, email, password, cpassword) => {
    setLoader("spinner-border spinner-border-sm");
    try {
      const response = await fetch(`${host}/auth/createuser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name, email: email, password: password }),
      });
      if (response.status === 500) {
        showAlert("Internal Server Error Occurred", "danger");
        setLoader("");
        setDisable(false);
        setCred({ name: "", email: "", password: "", cpassword: "" });
      } else {
        const json = await response.json();
        if (json.success) {
          if (searchParams.s !== "") {
            console.log("inside searchparams if", searchParams, json.userId);
            await updateUserId(searchParams.s, json.userId, searchParams.id);
          }
          //save the token and redirect
          setLoader("");
          setDisable(false);
          localStorage.setItem("token", json.authToken);
          navigate("/");
          showAlert("Account Created Successfully", "success");
          getUser();
          Logdout();
        } else {
          showAlert("Account Already Exist, Kindly Login", "danger");
          setLoader("");
          setCred({ name: "", email: "", password: "", cpassword: "" });
        }
      }
    } catch (error) {
      showAlert("We are sorry from our end some error occurred", "danger");
    } finally {
      setLoader("");
      setDisable(false);
    }
  };

  const onChange = (e) => {
    setCred({ ...cred, [e.target.name]: e.target.value });
  };

  const captchaChange = () => {
    setCaptcha(true);
  };
  return (
    <div id="signup" className="mb-1">
      <div className="d-flex align-items-stretch shadow-lg">
        <div className="col-12 col-lg-6 d-flex align-items-center bg-white">
          <div className="container p-4">
            <div className="w-100 p-md-5">
              <div className="mb-4">
                <h2 className="fw-bold mb-2">Sign Up</h2>
                <p className="text-muted">Create Your Curlmin Account</p>
              </div>

              <form onSubmit={verifyUser}>
                {/* Email Input */}
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="form-label small fw-semibold"
                  >
                    Full Name
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="fa-solid fa-user"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control bg-light text-dark"
                      id="name"
                      name="name"
                      placeholder="Enter your full name"
                      value={cred.name}
                      onChange={onChange}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="form-label small fw-semibold"
                  >
                    Email Address
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="fa-solid fa-envelope"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control bg-light text-dark"
                      id="email"
                      name="email"
                      placeholder="name@example.com"
                      value={cred.email}
                      onChange={onChange}
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="form-label small fw-semibold"
                  >
                    Password
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="fa-solid fa-lock"></i>
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control bg-light text-dark"
                      id="password"
                      name="password"
                      placeholder="Enter your password"
                      value={cred.password}
                      onChange={onChange}
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
                <div className="mb-2">
                  <label
                    htmlFor="password"
                    className="form-label small fw-semibold"
                  >
                    Confirm Password
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="fa-solid fa-lock"></i>
                    </span>
                    <input
                      type={showCpassword ? "text" : "password"}
                      className="form-control bg-light text-dark"
                      id="cpassword"
                      name="cpassword"
                      placeholder="Enter your password"
                      onChange={onChange}
                      value={cred.cpassword}
                    />
                    <button
                      type="button"
                      className="input-group-text bg-light border-start-0"
                      onClick={() => setShowCpassword(!showCpassword)}
                    >
                      {showCpassword ? (
                        <i className="fa-solid fa-eye-slash"></i>
                      ) : (
                        <i className="fa-solid fa-eye"></i>
                      )}
                    </button>
                  </div>
                </div>

                <div className="d-flex justify-content-center align-items-center my-4">
                  <ReCAPTCHA
                    sitekey={c_sitekey}
                    ref={captchaRef}
                    onChange={captchaChange}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn btn-primary btn-sm w-100 py-2 mb-4 d-flex align-items-center justify-content-center"
                  disabled={
                    cred.name === "" ||
                    cred.email === "" ||
                    cred.password === "" ||
                    cred.cpassword === "" ||
                    captcha === false ||
                    disable
                  }
                >
                  {" "}
                  Sign Up
                </button>
                <div className="d-flex justify-content-center my-2">
                  <div className={loader} role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
                {/* Sign Up Link */}
                <p className="text-center mb-4 text-muted fw-bold">
                  Already have an account?{" "}
                  <Link
                    to={
                      searchParams.s !== ""
                        ? `/login?s=${searchParams.s}&id=${searchParams.id}`
                        : "/login"
                    }
                    className="text-decoration-none text-primary "
                  >
                    Sign In
                  </Link>
                </p>

                {/* Social Login */}
                <div className="mb-4">
                  <div className="d-flex align-items-center mb-3">
                    <hr className="flex-grow-1" />
                    <span className="mx-3 text-muted small">
                      Or continue with
                    </span>
                    <hr className="flex-grow-1" />
                  </div>

                  <div className="row g-3">
                    <div className="col">
                      <button
                        className="btn btn-outline-light border w-100 d-flex align-items-center justify-content-center gap-2 text-dark"
                        onClick={signup}
                      >
                        <img
                          src="https://cdn.cdnlogo.com/logos/g/35/google-icon.svg"
                          alt="Google"
                          style={{ width: "18px" }}
                        />
                        Google
                      </button>
                    </div>
                  </div>
                </div>

                {/* Terms and Privacy */}
                <div className="text-center">
                  <small className="text-muted">
                    By continuing, you agree to our{" "}
                    <Link to="/terms" className="text-decoration-none">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy-policy" className="text-decoration-none">
                      Privacy Policy
                    </Link>
                  </small>
                </div>
              </form>
            </div>
            <button
              type="button"
              className="btn btn-primary invisible"
              data-bs-toggle="modal"
              data-bs-target="#otpModal"
              ref={otpModal}
            >
              Launch demo modal
            </button>

            <div
              className="modal fade"
              data-bs-backdrop="static"
              data-bs-keyboard="false"
              id="otpModal"
              tabIndex="-1"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">
                      Kindly Verify Your Email:{" "}
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="mb-3">
                        <label htmlFor="otp" className="form-label">
                          Enter OTP
                        </label>
                        <p
                          style={{ fontSize: "14px", marginTop: "-2%" }}
                          className="text-muted"
                        >
                          {`OTP is send on your ${cred.email} email`}
                        </p>
                        <input
                          type="number"
                          className="form-control"
                          id="otp"
                          value={otp}
                          name="otp"
                          placeholder="OTP"
                          onChange={onChangeModal}
                        />
                      </div>
                    </form>
                    <div className="d-flex gap-2 flex-row">
                      <p className={valid} style={{ color: "red" }}>
                        Invalid OTP, check again
                      </p>
                      {rotp.msg && (
                        <p style={{ color: rotp.bg, marginLeft: "auto" }}>
                          {rotp.msg}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="modal-footer">
                    {rsbtn ? (
                      <button
                        className="btn btn-sm btn-outline-success me-2"
                        disabled={rsloader}
                        onClick={otpResend}
                      >
                        Resend OTP
                        {rsloader && (
                          <span
                            className="spinner-border spinner-border-sm ms-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                        )}
                      </button>
                    ) : (
                      <p className="me-2">{`Resend OTP in ${cdown}`}</p>
                    )}
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary me-2"
                      data-bs-dismiss="modal"
                      ref={modalClose}
                      onClick={() => setDisable(false)}
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={handleVer}
                      disabled={mloader || otp === ""}
                    >
                      Verify
                      {mloader && (
                        <span className="spinner-border spinner-border-sm ms-2"></span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="d-none d-lg-flex col-lg-6 bg-primary position-relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #FF8A5C, #FF4E50)",
            color: "white",
          }}
        >
          <div
            className="position-absolute d-flex flex-column justify-content-start text-white p-5"
            style={{ marginTop: "15%" }}
          >
            <div className="px-4">
              <div className="text-center">
                <h1 className="fw-bold mb-4">Welcome to Curlmin</h1>
                <p className="mb-4">
                  Start shortening, sharing, and managing your links with ease.
                  Enhance your productivity and track your links effortlessly.
                </p>
              </div>
              <div className="text-center mb-4">
                <h1 className="fw-bold mb-4">Why Curlmin?</h1>
                <p>
                  Join thousands of users who rely on Curlmin for shortening,
                  tracking, and managing their links. Stay organized and secure
                  with ease.
                </p>
              </div>
              <div className="d-flex gap-2 mb-4 justify-content-center flex-wrap">
                {/* <div className="d-flex align-items-center">
                  <p>
                    <i className="fa-solid fa-image fa-lg me-2"></i>Share Images
                    via Link
                  </p>
                </div> */}
                <div className="d-flex align-items-center">
                  <p>
                    <i className="fas fa-lock fa-lg me-2"></i>Password
                    Protection
                  </p>
                </div>
                <div className="d-flex align-items-center">
                  <p>
                    <i className="fas fa-clock fa-lg me-2"></i>Time to Live
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
