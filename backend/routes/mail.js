const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const NodeCache = require("node-cache");
const otpCache = new NodeCache({ stdTTL: 300 });
require("dotenv").config();
const mail_host = process.env.MAIL_HOST;
const mail_user = process.env.MAIL_USER;
const mail_pass = process.env.MAIL_PASS;
const mail_port = process.env.MAIL_PORT;

const transporter = nodemailer.createTransport({
  host: mail_host,
  port: mail_port,
  auth: {
    user: mail_user,
    pass: mail_pass,
  },
});

const generateOTP = async () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
const storeOTP = async (userId, otp) => {
  otpCache.set(userId, otp);
};

const generateUserId = async () => {
  return uuidv4();
};

router.post("/contact", async (req, res) => {
  const { subject, body, to } = req.body;
  const mailOptions = {
    from: '"Curlmin Team" <support@curlmin.com>',
    to: to,
    subject: `${subject}`,
    html: `${body}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.json({
        success: false,
        msg: `error occurred: ${error}`,
      });
    }
    return res.json({
      success: true,
      msg: `Email sent successfully: ${info.response}`,
    });
  });
});

// const emailSignature = `
//   <div id="footer" class="box" style="background-color: lightgrey; width: auto; position:relative; box-shadow: 0 25px 25px rgba(0, 0, 0, 0.1); padding: 25px;">
//             <p>Best Regards</p>
//             <p style="margin-top: -15px; font-size:15px;">Docschat, UP, India</p>
//             <ul style="list-style: none; padding: 0;">
//                 <li style="display: inline; margin-right: 5px; font-size: 13px;"><a href="https://docschat.in" style="text-decoration: none;">View Site</a></li>
//                 <li style="display: inline; margin-right: 5px; font-size: 13px;"><a href="https://docschat.in/privacy-policy" style="text-decoration: none;">Privacy Policy</a></li>
//                 <li style="display: inline; margin-right: 5px; font-size: 13px;"><a href="https://docschat.in/in/terms" style="text-decoration: none;">Terms of Service</a></li>
//             </ul>
//     </div>
// `;

router.post("/sendmail", async (req, res) => {
  const { email, name, page } = req.body;
  const userId = await generateUserId();
  const otp = await generateOTP();
  await storeOTP(userId, otp);
  const mailOptions = {
    from: '"Curlmin Support" <support@curlmin.com>',
    to: email,
    subject: "Curlmin Account Verification",
    html: `<head>
    <style>
        /* Reset styles for email clients */
        .ExternalClass { width: 100%; }
        .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; }
        body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table { border-spacing: 0; }
        table td { border-collapse: collapse; }
        @media screen and (max-width: 600px) {
            .container { width: 100% !important; }
            .mobile-hide { display: none !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f6f6f6;">
    <!-- Main container -->
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto;">
        <tr style="background-color:lightgray;">
            <td style="padding: 20px 0; text-align: center">
                <img src="https://drive.google.com/thumbnail?id=1eDG58rlQ4DKlbwDBoE9G4_ZoN28dThBh&sz=w1000" alt="Company Logo" style="max-width: 150px; height: auto;">
            </td>
        </tr>
        
        <!-- Email content -->
        <tr>
            <td style="background: #ffffff; padding: 40px 30px;">
                <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                        <td style="padding-bottom: 20px;">
                            <h1 style="margin: 0; font-family: Arial, sans-serif; color: #333333;">Hello, ${name}!</h1>
                        </td>
                    </tr>
                    ${
                      page === "signup"
                        ? `<tr>
                        <td style="padding-bottom: 25px;">
                            <p style="margin: 0; font-family: Arial, sans-serif; color: #666666; line-height: 1.6;">
                                Thank you for registering with our service. We're excited to have you on board!
                            </p>
                        </td>
                    </tr>`
                        : ""
                    }
                    <tr>
                        <td style="padding-bottom: 25px;">
                            <p style="margin:0; font-family: Arial, sans-serif; color: #666666;">Please find your OTP below</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding-bottom: 30px;">
                            <a href="#" 
                               style="background-color: #007bff; color: #ffffff; padding: 12px 45px; 
                                      text-decoration: none; border-radius: 5px; display: inline-block;
                                      font-family: Arial, sans-serif; font-weight: bold;">
                                ${otp}
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p style="margin: 0; font-family: Arial, sans-serif; color: #666666; line-height: 1.6;">
                                If you have any questions, feel free to <a href="https://curlmin.com/contactus" style="color: #007bff; text-decoration: none;">contact our support team</a>.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>

        <!-- Footer -->
        <tr>
            <td style="padding: 30px 20px; text-align: center;">
                <p style="margin: 0; font-family: Arial, sans-serif; color: #999999; font-size: 12px;">
                    © 2025 curlmin . All rights reserved.<br>
                    <a href="https://curlmin.com" style="color: #999999; text-decoration: none;">View Site</a> | 
                    <a href="https://curlmin.com/privacy-policy" style="color: #999999; text-decoration: none;">Privacy Policy</a> |
                    <a href="https://curlmin.com/terms" style="color: #999999; text-decoration: none;">Terms of Service</a>
                </p>
            </td>
        </tr>
    </table>
</body>`, // HTML body
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.json({
        success: false,
        msg: `error occurred: ${error}`,
        uid: null,
      });
    }
    return res.json({
      success: true,
      msg: `Email sent successfully: ${info.response}`,
      uid: userId,
    });
  });
});

router.post("/verifyotp", async (req, res) => {
  const { userId, otp } = req.body;
  const storedOtp = otpCache.get(userId);
  if (storedOtp === otp) {
    res.json({ success: true, message: "OTP verified successfully" });
  } else {
    res.status(400).json({ success: false, message: "Invalid OTP" });
  }
});

module.exports = router;
