import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { userContext, userAccContext } from "../../../Context/userContext";

const Delete = (props) => {
  const { showAlert, Logdin } = props.prop;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const context = useContext(userContext);
  const accontext = useContext(userAccContext);
  const { dbdata, fetchCounts, deleteUser, factoryReset } = accontext;
  const { userIdRef, updateUser } = context;
  const userId = userIdRef.current;
  const modal = useRef();

  useEffect(() => {
    if (userId) {
      async function fetchData() {
        await fetchCounts(userId);
      }
      fetchData();
      setIsLoading(false);
    }
    // eslint-disable-next-line
  }, [userId]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center">
        <span className="spinner-border"></span>
      </div>
    );
  }
  const handleDelete = async (e) => {
    e.preventDefault();
    setIsDeleting(true);
    const res = await deleteUser(userId);
    if (res.success) {
      factoryReset();
      localStorage.removeItem("token");
      localStorage.removeItem("curlmin-userId");
      updateUser();
      showAlert("Account Deleted Successfully", "success");
      modal.current.click();
      navigate("/");
      Logdin();
    }
    setIsDeleting(false);
  };

  return (
    <>
      <div className="card">
        <div className="row">
          <div className="col-md-7">
            <div className="card-body p-4">
              <h5 className="card-title text-danger">Delete Your Account ? </h5>
              <p>
                Deleting your account will delete all your longUrls if made
                any..
              </p>
              <p className="text-muted">
                <ul>
                  {dbdata.map((item) =>
                    item.count > 0 ? (
                      <li key={item.name}>{`${item.count} - ${item.name}`}</li>
                    ) : null
                  )}
                </ul>
              </p>
            </div>
          </div>
          <div className="col-md-5 d-flex justify-content-center align-items-center">
            <img
              src={require("../../../Assets/delete.png")}
              alt="delete"
              className="img-fluid d-none d-lg-flex"
              style={{ width: "100px", height: "100px" }}
            />
          </div>
        </div>

        <div className="card-footer py-3 text-center">
          <button
            className="btn btn-danger"
            disabled={isDeleting}
            style={{ width: "150px" }}
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            Delete
          </button>
        </div>
      </div>
      <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog  modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">
                Are you sure you want to Delete...?
              </h1>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
                ref={modal}
              >
                Close
              </button>
              <button
                type="button"
                class="btn btn-danger"
                onClick={handleDelete}
              >
                {!isDeleting ? (
                  "Delete"
                ) : (
                  <span>
                    Deleting...
                    <span className="spinner-border spinner-border-sm ms-2"></span>
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Delete;
