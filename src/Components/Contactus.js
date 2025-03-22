import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import "./Styling/contact.css";
import { userContext } from "../Context/userContext";

const Contactus = (props) => {
  const { showAlert } = props.prop;
  const [select, setSelect] = useState("message");
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const [msg, setMsg] = useState({ email: "", text: "" });
  const [loader, setLoader] = useState("");
  const [disable, setDisable] = useState(false);
  const context = useContext(userContext);
  const { contact } = context;
  const to = process.env.REACT_APP_TO;

  useEffect(() => {
    document.title = "Contact us | Curlmin";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader("spinner-border spinner-border-sm mx-2");
    setDisable(true);
    const body = `<strong>email</strong>:${msg.email}
            <p>${msg.text}</p>
              `;
    const send = await contact(
      `You got a ${select} from curlmin team`,
      body,
      to
    );
    if (send.success) {
      showAlert("Message sent successfully", "primary");
      setMsg({ email: "", text: "" });
    } else {
      showAlert("There is an error sending Message", "danger");
      setMsg({ email: "", text: "" });
    }
    setDisable(false);
    setLoader("");
  };

  const handleChange = (e) => {
    setMsg({ ...msg, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div id="contact">
        <div className="container-fluid py-5 d-flex flex-column justify-content-center align-items-center position-relative overflow-hidden">
          {/* Abstract Background Elements */}
          <div
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{
              background:
                "linear-gradient(45deg, rgba(50,150,200,0.1) 0%, rgba(150,50,255,0.1) 100%)",
              zIndex: -1,
            }}
          >
            {/* Different abstract shapes */}
            <div
              className="position-absolute"
              style={{
                width: "200px",
                height: "200px",
                top: "12%",
                left: "10%",
                background:
                  "radial-gradient(circle, rgba(100,200,255,0.2) 0%, rgba(200,100,255,0.2) 100%)",
                borderRadius: "50% 0 50% 50%",
                transform: "rotate(45deg)",
                opacity: 0.7,
              }}
            ></div>
            <div
              className="position-absolute rounded-circle bg-primary opacity-25"
              style={{
                width: "100px",
                height: "100px",
                top: "10%",
                left: "2%",
                transform: "rotate(45deg)",
              }}
            ></div>
            <div
              className="position-absolute"
              style={{
                width: "200px",
                height: "200px",
                bottom: "10%",
                right: "5%",
                background:
                  "linear-gradient(225deg, rgba(255,100,100,0.1) 0%, rgba(100,255,100,0.1) 100%)",
                clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                transform: "rotate(-15deg)",
                opacity: 1,
              }}
            ></div>
          </div>
          <div className="mt-4 mb-5 ">
            <h1 className="fw-bold text-center text-success">Contact us</h1>
            <p style={{ textAlign: "center", fontSize: "14px" }}>
              Share with us whatever you feel, its either message, Feedback or
              an Issue
            </p>
          </div>
        </div>
        <div id="contactus" className="container p-4 mt-4">
          {/* <hr className="mb-5" /> */}
          {!isTabletOrMobile ? (
            <ul class="nav nav-tabs">
              <li class="nav-item">
                <Link
                  class={`nav-link ${select === "message" ? "active" : ""}`}
                  aria-current="page"
                  style={{ color: "black" }}
                  onClick={() => setSelect("message")}
                >
                  Send Messsage
                </Link>
              </li>
              <li class="nav-item">
                <Link
                  class={`nav-link ${select === "feedback" ? "active" : ""}`}
                  style={{ color: "black" }}
                  onClick={() => setSelect("feedback")}
                >
                  Feedback
                </Link>
              </li>
              <li class="nav-item">
                <Link
                  class={`nav-link ${select === "issue" ? "active" : ""}`}
                  style={{ color: "black" }}
                  onClick={() => setSelect("issue")}
                >
                  Report an Issue
                </Link>
              </li>
            </ul>
          ) : (
            <select
              class="form-select"
              aria-label="Default select example"
              onChange={(e) => setSelect(e.target.value)}
            >
              <option value="message" selected>
                Send Message
              </option>
              <option value="feedback">Feedback</option>
              <option value="issue">Report an Issue</option>
            </select>
          )}
        </div>
        <div className="container mb-4 d-flex justify-content-center">
          <div className="box p-4">
            <h4 className="text-center my-3">
              {select.charAt(0).toUpperCase() + select.slice(1)}
            </h4>
            <hr
              className="hr hr-blur"
              style={{ backgroundColor: "#808080", height: "1px" }}
            ></hr>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="feedbackissue" className="form-label">
                  Email address
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="feedbackissue"
                  aria-describedby="emailHelp"
                  name="email"
                  value={msg.email}
                  onChange={handleChange}
                  required
                />
                <div id="emailHelp" className="form-text">
                  We take email so that we can respond .
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="text" className="form-label">
                  Your {select.charAt(0).toUpperCase() + select.slice(1)}
                </label>
                <textarea
                  type="text"
                  className="form-control"
                  id="msg"
                  name="text"
                  value={msg.text}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={msg.email === "" || msg.text === "" || disable}
              >
                {disable ? (
                  <span>
                    Sending...
                    <span className={loader}></span>
                  </span>
                ) : (
                  `Send ${select}`
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contactus;
