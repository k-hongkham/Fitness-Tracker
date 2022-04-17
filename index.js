// create the express server here
require("dotenv").config();
const PORT = 3000;
const express = require("express");
const app = express();
const apiRouter = require("./api");
const morgan = require("morgan");
const cors = require("cors");

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use((req, res, next) => {
  console.log("<____Body Logger START____>");
  console.log(req.body);
  console.log("<_____Body Logger END_____>");

  next();
});

app.use("/api", apiRouter);

const client = require("./db/client");
client.connect();

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
