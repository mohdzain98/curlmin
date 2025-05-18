import React, { useState } from "react";
import { userAccContext } from "./userContext";

const UserAccount = (props) => {
  const { host, showAlert } = props.prop;
  const [urls, setUrls] = useState([]);
  const [qrcodes, setQRcodes] = useState([]);
  const [curltags, setCurltags] = useState([]);
  const [barcodes, setBarcodes] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState({
    url: true,
    qr: true,
    bc: true,
    ct: true,
    im: true,
  });
  const [dbdata, setDbdata] = useState([
    { name: "urls", count: 0 },
    { name: "qrcodes", count: 0 },
    { name: "barcodes", count: 0 },
    { name: "curltags", count: 0 },
    { name: "images", count: 0 },
  ]);

  const factoryReset = () => {
    setDbdata([
      { name: "urls", count: 0 },
      { name: "qrcodes", count: 0 },
      { name: "barcodes", count: 0 },
      { name: "curltags", count: 0 },
      { name: "images", count: 0 },
    ]);
    setUrls([]);
    setQRcodes([]);
    setBarcodes([]);
    setCurltags([]);
  };

  const formatDateTime = (dateTime, flag) => {
    const currentDate = new Date();
    const givenDate = new Date(dateTime);

    if (flag && givenDate < currentDate) {
      return "Expired";
    }
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      //   second: "2-digit",
      hour12: false,
      timeZone: "UTC", //prod
    };
    return givenDate.toLocaleString("en-US", options);
  };

  const formatExpiry = (date) => {
    const dates = new Date(date);
    const manual = dates.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "UTC",
    });
    return manual;
  };

  const formatCurrent = (date) => {
    const dates = new Date(date);
    const manual = dates.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return manual;
  };

  const fetchCounts = async (userId) => {
    try {
      const response = await fetch(`${host}/user/getudata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
        }),
      });
      if (response.status === 500) {
        showAlert("Internel server error", "danger");
      } else {
        const reply = await response.json();
        if (reply.success) {
          const data = reply.data;
          const updatedDbdata = [
            { name: "urls", count: data.urlCount || 0 },
            { name: "qrcodes", count: data.qrCount || 0 },
            { name: "barcodes", count: data.barcodeCount || 0 },
            { name: "curltags", count: data.curltagCount || 0 },
            { name: "images", count: data.imageCount || 0 },
          ];
          setDbdata(updatedDbdata);
        } else {
          showAlert(reply.msg, "info");
          setDbdata([
            { name: "urls", count: 0 },
            { name: "qrcodes", count: 0 },
            { name: "barcodes", count: 0 },
            { name: "curltags", count: 0 },
            { name: "images", count: 0 },
          ]);
        }
      }
    } catch (error) {
      showAlert("An error occurred while fetching data", "danger");
    }
  };

  const fetchUrls = async (userId) => {
    try {
      const res = await fetch(`${host}/user/geturls`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
        }),
      });
      if (res.status === 500) {
        showAlert("some error occurred", "danger");
      } else {
        const reply = await res.json();
        if (reply.success) {
          setUrls(reply.urls);
          setLoading((prev) => ({ ...prev, url: false }));
        } else {
          showAlert(reply.msg, "danger");
        }
      }
    } catch (error) {
      showAlert("An error occurred while fetching data", "danger");
    }
  };

  const fetchQRcodes = async (userId) => {
    try {
      const res = await fetch(`${host}/user/getqrcodes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
        }),
      });
      if (res.status === 500) {
        showAlert("some error occurred", "danger");
      } else {
        const reply = await res.json();
        if (reply.success) {
          setQRcodes(reply.qrcodes);
          setLoading((prev) => ({ ...prev, qr: false }));
        } else {
          showAlert(reply.msg, "danger");
        }
      }
    } catch (error) {
      showAlert("An error occurred while fetching data", "danger");
    }
  };

  const fetchCurltags = async (userId) => {
    try {
      const res = await fetch(`${host}/user/getcurltags`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
        }),
      });
      if (res.status === 500) {
        showAlert("some error occurred", "danger");
      } else {
        const reply = await res.json();
        if (reply.success) {
          setCurltags(reply.curltags);
          setLoading((prev) => ({ ...prev, ct: false }));
        } else {
          showAlert(reply.msg, "danger");
        }
      }
    } catch (error) {
      showAlert("An error occurred while fetching data", "danger");
    }
  };

  const fetchBarcodes = async (userId) => {
    try {
      const res = await fetch(`${host}/user/getbarcodes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
        }),
      });
      if (res.status === 500) {
        showAlert("some error occurred", "danger");
      } else {
        const reply = await res.json();
        if (reply.success) {
          setBarcodes(reply.barcodes);
          setLoading((prev) => ({ ...prev, bc: false }));
        } else {
          showAlert(reply.msg, "danger");
        }
      }
    } catch (error) {
      showAlert("An error occurred while fetching data", "danger");
    }
  };

  const fetchImages = async (userId) => {
    try {
      const res = await fetch(`${host}/user/getimages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
        }),
      });
      if (res.status === 500) {
        showAlert("some error occurred", "danger");
      } else {
        const reply = await res.json();
        if (reply.success) {
          setImages(reply.images);
          setLoading((prev) => ({ ...prev, im: false }));
        } else {
          showAlert(reply.msg, "danger");
        }
      }
    } catch (error) {
      showAlert("An error occurred while fetching data", "danger");
    }
  };

  const getDelete = async (endpoint, uid, userId, path) => {
    try {
      const response = await fetch(`${host}/user/${endpoint}/${uid}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, path }),
      });
      if (response.status === 500) {
        showAlert("internal server error, try again after some time", "danger");
      } else {
        const result = await response.json();
        return result;
      }
    } catch (error) {
      showAlert("Unable to access server", "danger");
    }
  };

  const checkPass = async (userId, cpass) => {
    try {
      const resp = await fetch(`${host}/user/checkpass`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, cpass }),
      });
      if (resp.status === 500) {
        showAlert("Internel Server Occurred", "danger");
      } else {
        const ret = await resp.json();
        return ret;
      }
    } catch (error) {
      showAlert("Unable to Access Server", "danger");
    }
  };

  const deleteUser = async (userId) => {
    try {
      const delete_user = await fetch(`${host}/user/delete-user`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });
      if (delete_user.status === 500) {
        showAlert("Server Error Occurred, try again after some time", "danger");
        const data = delete_user.json();
        return data;
      } else {
        const data = delete_user.json();
        return data;
      }
    } catch (error) {
      showAlert("Unable to access server", "danger");
    }
  };
  return (
    <div>
      <userAccContext.Provider
        value={{
          loading,
          formatDateTime,
          formatExpiry,
          formatCurrent,
          dbdata,
          fetchCounts,
          urls,
          fetchUrls,
          qrcodes,
          fetchQRcodes,
          getDelete,
          curltags,
          fetchCurltags,
          barcodes,
          fetchBarcodes,
          images,
          fetchImages,
          checkPass,
          deleteUser,
          factoryReset,
        }}
      >
        {props.children}
      </userAccContext.Provider>
    </div>
  );
};

export default UserAccount;
