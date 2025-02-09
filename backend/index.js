const connectToMongo = require("./db");
const { syncDB } = require("./mysql");
const express = require("express");
const cors = require("cors");
require("./routes/updateCount");

connectToMongo();
syncDB();

const app = express();
const port = 5006;

app.use(cors());
app.use(express.json());

app.use("/auth", require("./routes/auth"));
app.use("/url", require("./routes/core"));
app.use("/mail", require("./routes/mail"));
app.use("/user", require("./routes/user"));
app.use("/resolve", require("./routes/redirect"));

app.use("/", (req, res) => {
  return res.json({
    message: "Wecome to curlmin backend",
    version: "1.0",
  });
});

app.listen(port, () => {
  console.log("curlmin backend Running Successfully on port ***1");
});
