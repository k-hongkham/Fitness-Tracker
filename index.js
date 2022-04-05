// create the express server here
const PORT = 3000;

const express = require("express");
const app = express();

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
