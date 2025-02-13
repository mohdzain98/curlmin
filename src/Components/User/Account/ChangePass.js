import React, { useRef, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userContext, userAccContext } from "../../../Context/userContext";

const ChangePass = (props) => {
  const { showAlert } = props.prop;
  const [passval, setPassval] = useState({ cpass: "", npass: "", cmpass: "" });
  const [cLoader, setCloader] = useState({ bool: false, val: 0 });
  const [otpLoader, setOtpLoader] = useState(false);
  const [otpval, setOtpval] = useState("");
  const [otpmsg, setOtpmsg] = useState(false);
  const [modalmsg, setModalmsg] = useState(false);
  const [forgot, setForgot] = useState(false);
  const [showPassword, setShowPassword] = useState({
    cpass: false,
    npass: false,
    cmpass: false,
  });
  const accontext = useContext(userAccContext);
  const context = useContext(userContext);
  const { checkPass } = accontext;
  const { user, userIdRef, updatePassword, sendEmail, verifyEmail } = context;
  const userId = userIdRef.current;
  const ref = useRef(null);
  const modalClose = useRef(null);
  const navigate = useNavigate();
  // const location = useLocation();

  // useEffect(() => {
  //   const params = new URLSearchParams(location.search);
  //   const p = params.get("p");
  //   if (params.has("p") && p === "nf") {
  //     setForgot(true);
  //   }
  //   // eslint-disable-next-line
  // }, [location.search]);

  const onChange = (e) => {
    setPassval({ ...passval, [e.target.id]: e.target.value });
  };

  const onShowpassChange = (field) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const matchNCpass = (npass, cmpass) => {
    if (npass !== cmpass) {
      showAlert("New Password and Confirm Password Does not Match", "info");
      setCloader({ bool: false, val: 10 });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCloader({ bool: true, val: 10 });
    if (!matchNCpass(passval.npass, passval.cmpass)) {
      return;
    }
    const checkpass = await checkPass(userId, passval.cpass);
    if (checkpass.success) {
      setCloader({ bool: true, val: 40 });
      const reply = await updatePassword(userId, passval.npass);
      setCloader({ bool: true, val: 80 });
      if (reply.success) {
        showAlert("Password Changed Successfully", "success");
        setPassval({ cpass: "", npass: "", cmpass: "" });
        setForgot(false);
        navigate("/account?details");
      } else {
        showAlert(
          "Password was not changed, kindly try again after some time",
          "danger"
        );
      }
    } else {
      showAlert("Current Password is incorrect", "danger");
    }
    setCloader({ bool: false, val: 100 });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setCloader({ bool: true, val: 40 });
    if (!matchNCpass(passval.npass, passval.cmpass)) {
      return;
    }
    const reply = await updatePassword(userId, passval.npass);
    setCloader({ bool: true, val: 80 });
    if (reply.success) {
      showAlert("Password Changed Successfully", "success");
      setPassval({ cpass: "", npass: "", cmpass: "" });
      navigate("/account?details");
    } else {
      showAlert(
        "Password was not changed, kindly try again after some time",
        "danger"
      );
    }
    setCloader({ bool: false, val: 100 });
  };

  const handleOTP = async (e) => {
    e.preventDefault();
    setOtpmsg(true);
    const emailReply = await sendEmail(user.name, user.email, "forgot");
    if (emailReply.success) {
      localStorage.setItem("curlmin-otp-id", emailReply.uid);
      ref.current.click();
    } else {
      showAlert("Unable to send OTP at this moment", "info");
    }
    setOtpmsg(false);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setOtpLoader(true);
    const otpUid = localStorage.getItem("curlmin-otp-id");
    const verifyOtp = await verifyEmail(otpUid, otpval);
    if (verifyOtp.success) {
      setForgot(true);
      modalClose.current.click();
      showAlert("OTP verified Successfully", "success");
      setOtpval("");
      localStorage.removeItem("curlmin-otp-id");
    } else {
      setModalmsg(true);
      setTimeout(() => {
        setModalmsg(false);
      }, [1500]);
    }
    setOtpLoader(false);
  };

  return (
    <div>
      <div className="card">
        <div className="card-body p-4">
          <div className="card-title text-center">Change Your Password</div>
          {!forgot ? (
            <form>
              <div class="mb-3">
                <label for="cpass" class="form-label">
                  Current Password
                </label>
                <div className="input-group">
                  <input
                    type={showPassword.cpass ? "text" : "password"}
                    class="form-control"
                    id="cpass"
                    value={passval.cpass}
                    onChange={onChange}
                  />
                  <button
                    type="button"
                    className="input-group-text bg-light border-start-0"
                    onClick={() => onShowpassChange("cpass")}
                  >
                    {showPassword.cpass ? (
                      <i className="fa-solid fa-eye-slash"></i>
                    ) : (
                      <i className="fa-solid fa-eye"></i>
                    )}
                  </button>
                </div>
                <div id="emailHelp" class="form-text ms-1">
                  <Link style={{ textDecoration: "none" }} onClick={handleOTP}>
                    Forgot?{" "}
                    <p
                      className="text-muted text-dark d-inline ms-1"
                      style={{ fontSize: "13px" }}
                    >
                      {otpmsg ? "Sending OTP to your email.." : ""}
                    </p>
                  </Link>
                </div>
              </div>
              <div class="mb-3">
                <label for="npass" class="form-label">
                  New Password
                </label>
                <div className="input-group">
                  <input
                    type={showPassword.npass ? "text" : "password"}
                    class="form-control"
                    id="npass"
                    value={passval.npass}
                    onChange={onChange}
                  />
                  <button
                    type="button"
                    className="input-group-text bg-light border-start-0"
                    onClick={() => onShowpassChange("npass")}
                  >
                    {showPassword.npass ? (
                      <i className="fa-solid fa-eye-slash"></i>
                    ) : (
                      <i className="fa-solid fa-eye"></i>
                    )}
                  </button>
                </div>
              </div>
              <div class="mb-3">
                <label for="cmpass" class="form-label">
                  Confirm Password
                </label>
                <div className="input-group">
                  <input
                    type={showPassword.cmpass ? "text" : "password"}
                    class="form-control"
                    id="cmpass"
                    value={passval.cmpass}
                    onChange={onChange}
                  />
                  <button
                    type="button"
                    className="input-group-text bg-light border-start-0"
                    onClick={() => onShowpassChange("cmpass")}
                  >
                    {showPassword.cmpass ? (
                      <i className="fa-solid fa-eye-slash"></i>
                    ) : (
                      <i className="fa-solid fa-eye"></i>
                    )}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                class="btn btn-outline-primary px-4 btn-sm"
                onClick={handleSubmit}
                disabled={
                  passval.cpass === "" ||
                  passval.npass === "" ||
                  passval.cmpass === "" ||
                  cLoader.bool
                }
              >
                {cLoader.bool ? (
                  <div>
                    Changing...
                    <div class="progress mt-1" style={{ height: "5px" }}>
                      <div
                        class="progress-bar progress-bar-striped"
                        role="progressbar"
                        aria-label="Example 1px high"
                        style={{ width: `${cLoader.val}%` }}
                        aria-valuenow="25"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>
                ) : (
                  "Submit"
                )}
              </button>
              <button
                className="btn btn-outline-success btn-sm ms-2 px-3"
                disabled={
                  (passval.cpass === "" &&
                    passval.npass === "" &&
                    passval.cmpass === "") ||
                  cLoader.bool
                }
                onClick={(e) => {
                  e.preventDefault();
                  setPassval({ cpass: "", npass: "", cmpass: "" });
                }}
              >
                clear
              </button>
            </form>
          ) : (
            <form>
              <div class="mb-3">
                <label for="npass" class="form-label">
                  New Password
                </label>
                <div className="input-group">
                  <input
                    type={showPassword.npass ? "text" : "password"}
                    class="form-control"
                    id="npass"
                    value={passval.npass}
                    onChange={onChange}
                  />
                  <button
                    type="button"
                    className="input-group-text bg-light border-start-0"
                    onClick={() => onShowpassChange("npass")}
                  >
                    {showPassword.npass ? (
                      <i className="fa-solid fa-eye-slash"></i>
                    ) : (
                      <i className="fa-solid fa-eye"></i>
                    )}
                  </button>
                </div>
              </div>
              <div class="mb-4">
                <label for="cmpass" class="form-label">
                  Confirm Password
                </label>
                <div className="input-group">
                  <input
                    type={showPassword.cmpass ? "text" : "password"}
                    class="form-control"
                    id="cmpass"
                    value={passval.cmpass}
                    onChange={onChange}
                  />
                  <button
                    type="button"
                    className="input-group-text bg-light border-start-0"
                    onClick={() => onShowpassChange("cmpass")}
                  >
                    {showPassword.cmpass ? (
                      <i className="fa-solid fa-eye-slash"></i>
                    ) : (
                      <i className="fa-solid fa-eye"></i>
                    )}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                class="btn btn-outline-primary px-4 btn-sm"
                onClick={handleUpdate}
                disabled={
                  passval.npass === "" || passval.cmpass === "" || cLoader.bool
                }
              >
                {cLoader.bool ? (
                  <div>
                    Changing...
                    <div class="progress mt-1" style={{ height: "5px" }}>
                      <div
                        class="progress-bar progress-bar-striped"
                        role="progressbar"
                        aria-label="Example 1px high"
                        style={{ width: `${cLoader.val}%` }}
                        aria-valuenow="25"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>
                ) : (
                  "Submit"
                )}
              </button>
              <button
                className="btn btn-outline-success btn-sm ms-2 px-3"
                disabled={
                  (passval.npass === "" && passval.cmpass === "") ||
                  cLoader.bool
                }
                onClick={(e) => {
                  e.preventDefault();
                  setPassval({ cpass: "", npass: "", cmpass: "" });
                }}
              >
                clear
              </button>
              <button
                className="btn btn-outline-secondary float-end btn-sm px-3 ms-2"
                data-toggle="tooltip"
                data-placement="top"
                title="Go Back to previous tab"
                onClick={() => setForgot(false)}
              >
                <i className="fa-solid fa-arrow-left fa-sm me-2"></i>
                back
              </button>
            </form>
          )}
        </div>
      </div>
      <button
        type="button"
        class="btn btn-primary invisible"
        data-bs-toggle="modal"
        data-bs-target="#staticBackdrop"
        ref={ref}
      >
        Launch OTP Modal
      </button>
      <div
        class="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="staticBackdropLabel">
                Enter OTP
              </h1>
            </div>
            <div class="modal-body">
              <p>
                OTP send to <small className="text-muted">{user.email}</small>
              </p>
              <input
                type="number"
                class="form-control"
                id="otp"
                aria-describedby="emailHelp"
                placeholder="Enter OTP here"
                value={otpval}
                onChange={(e) => setOtpval(e.target.value)}
              />
              {modalmsg ? (
                <p
                  className="mt-1"
                  style={{
                    color: "red",
                    marginBottom: "0px",
                    fontSize: "14px",
                  }}
                >
                  Wrong OTP, Kindly check
                </p>
              ) : (
                ""
              )}
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-outline-secondary btn-sm"
                data-bs-dismiss="modal"
                ref={modalClose}
              >
                Close
              </button>
              <button
                type="button"
                class="btn btn-primary px-4 btn-sm"
                onClick={handleVerify}
                disabled={otpLoader || otpval === "" || otpval.length < 6}
              >
                {otpLoader ? (
                  <span>
                    Verifying...{" "}
                    <span className="spinner-border spinner-border-sm ms-1"></span>
                  </span>
                ) : (
                  "Verify"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePass;
