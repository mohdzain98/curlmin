import React, { useState, useContext, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Styling/Loginsignup.css";
import { userContext } from "../Context/userContext";
import { useGoogleLogin } from "@react-oauth/google";
import ReCAPTCHA from "react-google-recaptcha";

const Login = (props) => {
  const { host, showAlert, Logdout, c_sitekey } = props.prop;
  const [cred, setCred] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loader, setLoader] = useState(false);
  const context = useContext(userContext);
  const { getUser, verifyCaptcha, updateUserId } = context;
  const [gloader, setGLoader] = useState("");
  const captchaRef = useRef(null);
  const [captcha, setCaptcha] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [searchParams, setSearchParams] = useState({ s: "", id: "" });
  const google_login = process.env.REACT_APP_GOOGLE_USER;

  useEffect(() => {
    document.title = "curlmin | login";
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
    }
  }, [location]);

  const googleLogin = async (a_token) => {
    const response = await fetch(`${google_login}?access_token=${a_token}`, {
      headers: {
        Authorization: `Bearer ${a_token}`,
        Accept: "application/json",
      },
    });
    const data = await response.json();
    const email = await data.email;
    setGLoader("spinner-border spinner-border-sm mt-2");
    const result = await fetch(`${host}/auth/glogin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email }),
    });
    if (result.status === 500) {
      showAlert("Internal Server Error Occurred", "danger");
      setGLoader("");
    } else {
      const json = await result.json();
      if (json.success) {
        if (searchParams.s !== "") {
          await updateUserId(searchParams.s, json.userId, searchParams.id);
        }
        //save the token and redirect
        setGLoader("");
        localStorage.setItem("token", json.authToken);
        navigate("/");
        showAlert("Login Sucessfully", "success");
        getUser();
        Logdout();
      } else {
        showAlert(json.errors, "danger");
        setGLoader("");
      }
    }
  };

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      googleLogin(codeResponse.access_token);
    },
    onError: (error) => showAlert(`${error} Kindly Login Manually`, "danger"),
  });

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-item-center my-2">
        <span className="spinner-border"></span>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    // const tokens = await executeRecaptcha();
    const token = captchaRef.current.getValue();
    if (!token) {
      showAlert("captcha error", "danger");
      setLoader(false);
      return;
    }
    const reply = await verifyCaptcha(token);
    if (!reply) {
      captchaRef.current.reset();
      setCaptcha(false);
      setLoader(false);
      return;
    }
    if (reply.status === 500) {
      showAlert("There is an Error accessing Server", "danger");
    } else {
      if (reply.stat) {
        const response = await fetch(`${host}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: cred.email,
            password: cred.password,
          }),
        });
        if (response.status === 500) {
          showAlert("Internal Server Error Occurred", "danger");
          setLoader(false);
        } else {
          const json = await response.json();
          if (json.success) {
            if (searchParams.s !== "") {
              await updateUserId(searchParams.s, json.userId, searchParams.id);
            }
            //save the token and redirect
            setLoader(false);
            localStorage.setItem("token", json.authToken);
            navigate("/");
            showAlert("Login Sucessfully", "success");
            getUser();
            Logdout();
          } else {
            showAlert(json.errors, "danger");
            setLoader(false);
          }
        }
      } else {
        showAlert(reply.msg, "danger");
        setLoader(false);
      }
      captchaRef.current.reset();
      setCaptcha(false);
    }
  };

  const onChange = (e) => {
    setCred({ ...cred, [e.target.name]: e.target.value });
  };

  const captchaChange = () => {
    setCaptcha(true);
  };

  return (
    <div id="login">
      <div className="d-flex align-items-stretch shadow-lg">
        <div className="d-none d-lg-flex col-lg-6 bg-primary position-relative overflow-hidden">
          <div
            className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center text-white px-5"
            style={{ backgroundColor: "rgba(13, 110, 253, 0.9)" }}
          >
            <div className="px-4">
              <h1 className="display-5 fw-bold mb-4">
                Welcome Back to Curlmin
              </h1>
              <p className="lead mb-4">
                Shorten, share, and track your URLs effortlessly. Take control
                of your links and make sharing smarter and more secure.
              </p>
              <div className="d-flex gap-3 mb-4">
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

        {/* Right Section with Login Form */}
        <div className="col-12 col-lg-5 d-flex align-items-center bg-white justify-content-center">
          <div className="w-100 p-4 p-md-5">
            <div className="mb-4">
              <h2 className="fw-bold mb-2">Sign In</h2>
              <p className="text-muted">
                Please enter your credentials to continue
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Email Input */}
              <div className="mb-4">
                <label htmlFor="email" className="form-label small fw-semibold">
                  Email Address
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <i className="fa-solid fa-envelope"></i>
                  </span>
                  <input
                    type="email"
                    name="email"
                    className="form-control bg-light text-dark"
                    id="email"
                    placeholder="name@example.com"
                    value={cred.email}
                    onChange={onChange}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="mb-2">
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

              {/* Remember Me & Forgot Password */}
              <div className="d-flex justify-content-end align-items-end mb-2">
                <Link
                  to="/forgot-password"
                  className="text-decoration-none fw-bold"
                >
                  Forgot Password?
                </Link>
              </div>
              {/* Submit Button */}
              <div className="d-flex justify-content-center align-items-center my-3">
                <ReCAPTCHA
                  sitekey={c_sitekey}
                  ref={captchaRef}
                  onChange={captchaChange}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-sm w-100 py-2 mb-4 d-flex align-items-center justify-content-center"
                disabled={
                  cred.email === "" ||
                  cred.password === "" ||
                  captcha === false ||
                  loader
                }
              >
                {" "}
                Sign In
                {loader && (
                  <span className="spinner-border spinner-border-sm ms-2"></span>
                )}
              </button>

              {/* Sign Up Link */}
              <p className="text-center mb-4 text-muted fw-bold">
                Don't have an account?{" "}
                <Link
                  to={
                    searchParams.s !== ""
                      ? `/signup?s=${searchParams.s}&id=${searchParams.id}`
                      : "/signup"
                  }
                  className="text-decoration-none text-primary "
                >
                  Sign Up
                </Link>
              </p>
            </form>
            {/* Social Login */}
            <div className="mb-4">
              <div className="d-flex align-items-center mb-3">
                <hr className="flex-grow-1" />
                <span className="mx-3 text-muted small">Or continue with</span>
                <hr className="flex-grow-1" />
              </div>

              <div className="row g-3">
                <div className="col">
                  <button
                    className="btn btn-outline-light border w-100 d-flex align-items-center justify-content-center gap-2 text-dark"
                    onClick={login}
                  >
                    <img
                      src="https://cdn.cdnlogo.com/logos/g/35/google-icon.svg"
                      alt="Google"
                      style={{ width: "18px" }}
                    />
                    Google
                  </button>
                  <center>
                    <span
                      className={gloader}
                      role="status"
                      aria-hidden="true"
                    ></span>
                  </center>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
