import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Cookies from "js-cookie";
import Scrolltotop from "./Components/Scrolltotop";
import Login from "./Components/Login";
import Navbar from "./Components/Nabar";
import Alert from "./Components/Alert";
import Home from "./Components/Home/Home";
import Signup from "./Components/Signup";
import UserState from "./Context/UserState";
import UserAccount from "./Context/UserAccount";
import Qr from "./Components/categories/Qr";
import Barcode from "./Components/categories/Barcode";
import Snaptag from "./Components/categories/Snaptag";
import BarcodeScanner from "./Components/Scanner/BarcodeScanner";
import Help from "./Components/Help";
import Privacy from "./Components/Privacy";
import Faq from "./Components/Faq";
import Contactus from "./Components/Contactus";
import Forgot from "./Components/Forgot";
import User from "./Components/User/data/User";
import Account from "./Components/User/Account/Account";
import Terms from "./Components/Terms";
import Cookiesc from "./Components/Cookies";
import Image from "./Components/categories/Image";

function App() {
  const [alert, setAlert] = useState(null);
  const [login, setLogin] = useState(true);
  const host = process.env.REACT_APP_HOST;
  const c_sitekey = process.env.REACT_APP_CAPTCHA_SITE_KEY;

  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type,
    });
    setTimeout(() => {
      setAlert(null);
    }, 3500);
  };

  const Logdin = () => {
    setLogin(true);
  };

  const Logdout = () => {
    setLogin(false);
  };

  const setCookie = (uid, val) => {
    Cookies.set(uid, val, {
      expires: 1,
      secure: true,
      sameSite: "Strict",
    });
  };

  return (
    <>
      <UserState prop={{ host, showAlert }}>
        <UserAccount prop={{ host, showAlert }}>
          <Router>
            <Scrolltotop />
            <Navbar prop={{ showAlert, Logdin, Logdout, login }} />
            <Alert alert={alert} />
            <Routes>
              <Route
                exact
                path="/"
                element={<Home prop={{ showAlert, login }} />}
              ></Route>
              <Route
                exact
                path="/login"
                element={
                  <Login prop={{ host, Logdout, showAlert, c_sitekey }} />
                }
              ></Route>
              <Route
                exact
                path="/signup"
                element={
                  <Signup prop={{ host, Logdout, showAlert, c_sitekey }} />
                }
              ></Route>
              <Route
                exact
                path="/qrcode"
                element={<Qr prop={{ host, showAlert, login }} />}
              ></Route>
              <Route
                exact
                path="/barcode"
                element={<Barcode prop={{ host, showAlert, login }} />}
              ></Route>
              <Route
                exact
                path="/curltag"
                element={<Snaptag prop={{ host, showAlert, login }} />}
              ></Route>
              <Route
                exact
                path="/image"
                element={<Image prop={{ host, showAlert, login }} />}
              ></Route>
              <Route
                exact
                path="/barcode-scanner"
                element={<BarcodeScanner />}
              ></Route>
              <Route exact path="/help-center" element={<Help />}></Route>
              <Route exact path="/privacy-policy" element={<Privacy />}></Route>
              <Route exact path="/faq" element={<Faq />}></Route>
              <Route
                exact
                path="/contactus"
                element={<Contactus prop={{ host, showAlert }} />}
              ></Route>
              <Route
                exact
                path="/forgot-password"
                element={<Forgot prop={{ host, showAlert, setCookie }} />}
              ></Route>
              <Route
                exact
                path="/urls"
                element={<User prop={{ showAlert }} />}
              ></Route>
              <Route
                exact
                path="/account"
                element={<Account prop={{ host, showAlert, Logdin }} />}
              ></Route>
              <Route exact path="/terms" element={<Terms />}></Route>
            </Routes>
            <Cookiesc />
          </Router>
        </UserAccount>
      </UserState>
    </>
  );
}

export default App;
