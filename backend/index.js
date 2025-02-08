const connectToMongo = require("./db");
const { syncDB } = require("./mysql");
const express = require("express");
const cors = require("cors");
require("./routes/updateCount");

connectToMongo();
syncDB();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/url", require("./routes/core"));
app.use("/api/mail", require("./routes/mail"));
app.use("/api/user", require("./routes/user"));
app.use("/api/resolve", require("./routes/redirect"));

app.use("/", (req, res) => {
  return res.json({
    message: "Wecome to sigmaurl backend",
    version: "1.0",
  });
});

app.listen(port, () => {
  console.log("sigmaurl backend Running Successfully on port ***1");
});
