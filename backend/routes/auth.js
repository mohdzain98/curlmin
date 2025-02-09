const express = require("express");
const router = express.Router();
const User = require("../models/User");
const UserCounts = require("../models/Urlcount");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
require("dotenv").config();
const JWT_SECRET = process.env.JWTS;
const CAPTCHA_SEC_KEY = process.env.C_SECRET_KEY;
const CAPTCHA_VERIFY = process.env.C_VERIFY;

router.post("/existuser", async (req, res) => {
  let success = true;
  const { email } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.json({
        success,
        id: user.id,
        name: user.name,
        msg: "Email Already Exist",
      });
    }
    success = false;
    return res.json({ success, msg: "Email Not Found" });
  } catch (error) {
    res.status(500).send("Internal server occured");
  }
});

//create a user using : POST "/api/auth" doesn't require auth
router.post(
  "/createuser",
  [
    body("name", "Enter a Valid name").isLength({ min: 3 }),
    body("email", "Enter a Valid Email").isEmail(),
    body("password", "Enter a Valid Password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let success = false;
    //if there are error return bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(500)
        .json({ msg: "error occurred", errors: errors.array() });
    }

    // check email already exist
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ success, error: "Email Already Exist" });
      }
      //If email is unique create user
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      await UserCounts.create({ userId: user.id });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authToken, userId: user.id });
    } catch (err) {
      res.status(500).send("Some Error Occured");
    }
  }
);

router.post(
  "/login",
  [
    body("email", "Enter a Valid Email").isEmail(),
    body("password", "Password cannot be Blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ success, errors: "Email Not Found Kindly Signup" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(401).json({ success, errors: "Wrong Password" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authToken, userId: user.id });
    } catch (error) {
      res.status(500).send("Internal server occured");
    }
  }
);

//Route 3 : Get loggedin user detail : POST "/api/auth/getuser"
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    res.status(500).send("internal server error");
  }
});

router.post("/glogin", async (req, res) => {
  let success = false;
  const { email } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success, errors: "Email Not Found Kindly Signup" });
    }
    const data = {
      user: {
        id: user.id,
      },
    };
    const authToken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({ success, authToken, userId: user.id });
  } catch (error) {
    res.status(500).send("Internal server occured");
  }
});

router.put("/updatepass/:id", async (req, res) => {
  const { npass } = req.body;
  try {
    const np = {};
    if (npass) {
      np.pass = npass;
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(np.pass, salt);
    const update = await User.findByIdAndUpdate(
      req.params.id,
      { password: secPass },
      { new: true }
    );
    res.json({ success: true, val: update });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

router.post("/checkcaptcha", async (req, res) => {
  let stat = false;
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ stat, msg: "No token provided" });
  }
  try {
    const resp = await fetch(
      `${CAPTCHA_VERIFY}?secret=${CAPTCHA_SEC_KEY}&response=${token}`,
      { method: "POST" }
    );
    const data = await resp.json();
    if (data.success) {
      stat = true;
      res.status(200).json({ stat, msg: "captcha verified successfully" });
    } else {
      res
        .status(400)
        .json({ stat, msg: "Not a Human, error verifying Captcha" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ stat, msg: "Some error occuured verifying captcha" });
  }
});

module.exports = router;
