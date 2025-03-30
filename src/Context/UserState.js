import React, { useState, useEffect, useRef } from "react";
import { userContext } from "./userContext";

const UserState = (props) => {
  const { host, showAlert } = props.prop;
  const [user, setUser] = useState({ name: "", email: "", type: "", time: "" });
  const [userId, setUserId] = useState("");
  const userIdRef = useRef(userId);

  useEffect(() => {
    userIdRef.current = userId;
  }, [userId]);

  const getUser = async () => {
    try {
      const response = await fetch(`${host}/auth/getuser`, {
        method: "POST",
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      });

      const json = await response.json();
      setUser({
        name: json.name,
        email: json.email,
        type: json.userType,
        time: json.creationDate,
      });
      setUserId(json._id);
      localStorage.setItem("curlmin-userId", json._id);
    } catch (err) {
      showAlert("There is Error at Accessing Server", "danger");
    }
  };

  const updateUser = () => {
    if (!localStorage.getItem("token")) {
      setUserId("");
    }
  };

  const isValidUrl = (input) => {
    const urlPattern = /^(https?:\/\/)[^\s]+\.[^\s]+$/;
    if (!urlPattern.test(input) || input.includes("curlm.in")) {
      return false;
    }
    try {
      new URL(input);
      return true;
    } catch (error) {
      return false;
    }
  };

  const updatePassword = async (userId, npass) => {
    try {
      const resp = await fetch(`${host}/auth/updatepass/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ npass: npass }),
      });
      if (resp === 500) {
        showAlert("Internel Server Error Occurred", "danger");
      } else {
        const reply = await resp.json();
        return reply;
      }
    } catch (error) {
      showAlert("Unable to Access Server", "danger");
    }
  };

  const verifyCaptcha = async (token) => {
    try {
      if (!token) {
        showAlert("Captcha is not verified", "danger");
        return { stat: false, msg: "No token provided" };
      }
      const response = await fetch(`${host}/auth/checkcaptcha`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: token }),
      });
      const reply = await response.json();
      return reply;
    } catch (err) {
      showAlert("There is an Error Accessing Server", "danger");
    }
  };

  const createShortUrl = async (
    userId,
    url,
    pass,
    passval,
    creationdate,
    formattedDate,
    isPermanent
  ) => {
    try {
      const resp = await fetch(`${host}/url/createurl`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          longUrl: url,
          pass: pass,
          passval: passval,
          creationDate: creationdate,
          expiryDate: formattedDate,
          isPermanent: isPermanent,
        }),
      });
      if (resp.status === 500) {
        showAlert("There is an error generating short url", "danger");
        return false;
      } else {
        const data = await resp.json();
        return data;
      }
    } catch (error) {
      showAlert("an error accurred accessing server", "danger");
    }
  };

  const deleteurl = async (uid, userId) => {
    try {
      const response = await fetch(`${host}/user/deleteurl/${uid}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
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

  // const saveQrcode = async (userId, url) => {
  //   try {
  //     const resp = await fetch("http://localhost:5000/api/url/save-qrcode", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         userId: userId,
  //         longUrl: url,
  //       }),
  //     });
  //     if (resp.status === 500) {
  //       showAlert("There is an error generating Qr code", "danger");
  //       return false;
  //     } else {
  //       const data = await resp.json();
  //       return data;
  //     }
  //   } catch (error) {
  //     showAlert("an error accurred accessing server", "danger");
  //   }
  // };

  const saveBarcode = async (userId, url) => {
    try {
      const resp = await fetch(`${host}/url/save-barcode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          longUrl: url,
        }),
      });
      if (resp.status === 500) {
        showAlert("Some Error Occurred", "danger");
        return false;
      } else {
        const data = await resp.json();
        return data;
      }
    } catch (error) {
      showAlert("an error accurred accessing server", "danger");
    }
  };

  const saveSigmatag = async (userId, url) => {
    try {
      const resp = await fetch(`${host}/url/save-sigmatag`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          longUrl: url,
        }),
      });
      if (resp.status === 500) {
        showAlert("Some Error Occurred", "danger");
        return false;
      } else {
        const data = await resp.json();
        return data;
      }
    } catch (error) {
      showAlert("an error accurred accessing server", "danger");
    }
  };

  const updateUserId = async (service, userId, uid) => {
    try {
      const resp = await fetch(`${host}/url/updateuserid`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service: service,
          userId: userId,
          uid: uid,
        }),
      });
      if (resp.status === 500) {
        showAlert("Some Error Occurred", "danger");
        return false;
      } else {
        const data = await resp.json();
        return data;
      }
    } catch (error) {
      showAlert("an error accurred accessing server", "danger");
    }
  };

  const getSignedUrl = async (
    userId,
    fileType,
    pass,
    passval,
    expiresIn,
    isPermanent
  ) => {
    try {
      const response = await fetch(
        "http://localhost:5006/url/get-presigned-url",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            fileType,
            pass,
            passval,
            expiresIn,
            isPermanent,
          }),
        }
      );
      if (response.status === 500) {
        showAlert("Server Error Occurred", "danger");
        return false;
      } else {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      showAlert("Some Error Occurred Accessing Server", "danger");
    }
  };

  const contact = async (subject, body, to) => {
    try {
      const response = await fetch(`${host}/mail/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subject: subject, body: body, to: to }),
      });
      const reply = await response.json();
      return reply;
    } catch (err) {
      showAlert("There is Error Accessing Server", "danger");
    }
  };

  const sendEmail = async (name, email, page) => {
    try {
      const send = await fetch(`${host}/mail/sendmail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, name: name, page: page }),
      });
      if (send.status === 200) {
        const reply = await send.json();
        return reply;
      } else {
        return { msg: "Email was not sent", uid: null };
      }
    } catch (err) {
      showAlert("There is Error Accessing Server", "danger");
    }
  };

  const verifyEmail = async (uid, otp) => {
    try {
      const send = await fetch(`${host}/mail/verifyotp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: uid, otp: otp }),
      });
      const reply = await send.json();
      return reply;
    } catch (err) {
      showAlert("There is Error Accessing Server", "danger");
    }
  };

  return (
    <div>
      <userContext.Provider
        value={{
          isValidUrl,
          user,
          userIdRef,
          getUser,
          updateUser,
          updatePassword,
          verifyCaptcha,
          createShortUrl,
          deleteurl,
          saveBarcode,
          saveSigmatag,
          contact,
          sendEmail,
          verifyEmail,
          updateUserId,
          getSignedUrl,
        }}
      >
        {props.children}
      </userContext.Provider>
    </div>
  );
};

export default UserState;
