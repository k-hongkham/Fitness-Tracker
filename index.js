// create the express server here
const PORT = 3000;
const express = require("express");
const app = express();
const apiRouter = require("./api");
const morgan = require("morgan");
const cors = require("cors");
const client = require("./db/client");

app.use(cors());
app.use(morgan("dev"));
require("dotenv").config();
app.use(express.json());

app.use((req, res, next) => {
  console.log("<____Body Logger START____>");
  console.log(req.body);
  console.log("<_____Body Logger END_____>");

  next();
});

// causes server to crash
// app.use("/api", apiRouter);
app.use("/api", apiRouter);
app.get("/api", function (req,res, next) {
  res.json({msg: "This is Cors-enable for all"})
})

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
