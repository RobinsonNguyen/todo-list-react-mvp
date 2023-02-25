const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());

app.get("/test", (req, res) => {
  res.send({ msg: "in server" }).status(200);
});

app.listen(3001, () => {
  console.log("listening on port 3001...");
});
