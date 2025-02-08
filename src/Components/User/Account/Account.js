import React, { useState, useContext, useEffect, useRef } from "react";
import { useMediaQuery } from "react-responsive";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { userContext } from "../../../Context/userContext";
import ChangePass from "./ChangePass";
import Delete from "./Delete";

const Account = (props) => {
  const { showAlert, Logdin } = props.prop;
  const [select, setSelect] = useState("details");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsupdating] = useState(false);
  const navigate = useNavigate();
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const context = useContext(userContext);
  const { user, userIdRef, getUser } = context;
  const userId = userIdRef.current;
  const [searchParams] = useSearchParams();
  const [name, setName] = useState({ nm: user.name });
  const isChange = user.name;
  const ref = useRef(null);

  useEffect(() => {
    if (user && user.name) {
      setName({ nm: user.name });
    }
    // eslint-disable-next-line
  }, [user.name]);

  useEffect(() => {
    document.title = "curlmin | user account";
    const token = localStorage.getItem("token");
    // const storedUserId = localStorage.getItem("curlmin-userId");
    if (!token) {
      showAlert("Not Allowed! Kindly Login", "danger");
      navigate("/login");
    } else {
      const isDetails = searchParams.has("details");
      const isChpass = searchParams.has("change-password");
      const isDelete = searchParams.has("delete");
      const tab = isDetails
        ? "details"
        : isChpass
        ? "change-password"
        : isDelete
        ? "delete"
        : "unknown";
      setSelect(tab);
      setIsLoading(false);
    }
    // eslint-disable-next-line
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center">
        <span className="spinner-grow"></span>
      </div>
    );
  }

  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    navigate(`/account?${selectedValue}`);
    setSelect(e.target.value);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) {
      return;
    }
    const date = new Date(dateStr);
    console.log("date is", date);
    const formattedDate = new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
    return formattedDate;
  };

  const handleUpdate = async () => {
    setIsupdating(true);
    const update = await fetch(
      `http://localhost:5000/api/user/updatename/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name.nm }),
      }
    );
    if (update.status === 500) {
      showAlert("Internel server Error Occurred", "danger");
    } else {
      const data = await update.json();
      if (data.success) {
        getUser();
        showAlert("Name Updated Successfully", "success");
      } else {
        showAlert("Not able to update at this moment", "info");
      }
    }
    ref.current.click();
    setIsupdating(false);
  };
  return (
    <div id="account">
      <div className="container py-5">
        <div className="row">
          <div className="col-md-3 col-xs-12 p-4 border">
            {!isTabletOrMobile ? (
              <div>
                <h5 className="fw-bold">Options</h5>
                <hr />
                <nav className="nav nav-pills flex-column">
                  <ul></ul>
                  <Link
                    to={"/account?details"}
                    className={`nav-link ${
                      select === "details" ? "active" : ""
                    }`}
                    onClick={() => setSelect("details")}
                  >
                    Account Details
                  </Link>
                  <Link
                    to={"/account?change-password"}
                    className={`nav-link ${
                      select === "change-password" ? "active" : ""
                    }`}
                    onClick={() => setSelect("change-password")}
                  >
                    Change Password
                  </Link>
                  <Link
                    to={"/account?delete"}
                    className={`nav-link ${
                      select === "delete" ? "active" : ""
                    }`}
                    onClick={() => setSelect("delete")}
                  >
                    Delete Account
                  </Link>
                </nav>
              </div>
            ) : (
              <select
                className="form-select"
                aria-label="Default select example"
                onChange={handleSelectChange}
              >
                <option value="details" selected>
                  Account details
                </option>
                <option value="change-password">Change Password</option>
                <option value="delete">Delete Account</option>
              </select>
            )}
          </div>
          <div
            className={`col-md-8 col-xs-12 ${
              isTabletOrMobile ? "mt-4" : "ms-4"
            }`}
          >
            {select === "details" && (
              <div className="card">
                <div className="card-body">
                  <div className="card-title">Details</div>
                  <h5 className="card-title d-inline">{user.name}</h5>
                  <h6
                    className="d-inline float-end"
                    style={{ fontSize: "12px" }}
                  >
                    id: {userId}
                  </h6>
                  <h6
                    className="card-subtitle mb-2 text-muted"
                    style={{ marginTop: "1px" }}
                  >
                    {user.email}
                  </h6>
                  <div className="mt-3" style={{ width: "50%" }}>
                    <p>
                      Joined On
                      <small class="text-muted ms-2">
                        {formatDate(user.time)}
                      </small>
                    </p>
                  </div>
                </div>
                <div className="card-footer">
                  user type:
                  <p className="ms-2 d-inline">
                    {user.type.charAt(0).toUpperCase() + user.type.slice(1)}
                  </p>
                  <i
                    class="fa-regular fa-pen-to-square float-end btn"
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                  ></i>
                </div>
              </div>
            )}
            {select === "change-password" && (
              <ChangePass prop={{ showAlert }} />
            )}
            {select === "delete" && <Delete prop={{ showAlert, Logdin }} />}
          </div>
        </div>
        <div
          class="modal fade"
          id="exampleModal"
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">
                  Update your name
                </h1>
              </div>
              <div class="modal-body">
                <label for="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="name"
                  aria-describedby="emailHelp"
                  value={name.nm}
                  onChange={(e) => setName({ nm: e.target.value })}
                />
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-outline-secondary btn-sm"
                  data-bs-dismiss="modal"
                  ref={ref}
                >
                  Close
                </button>
                <button
                  type="button"
                  class="btn btn-primary btn-sm"
                  onClick={handleUpdate}
                  disabled={isUpdating || isChange === name.nm.trim()}
                >
                  {isUpdating ? (
                    <span>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Updating...
                    </span>
                  ) : (
                    "Save Changes"
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

export default Account;
