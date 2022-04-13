// create an api router
// attach other routers from files in this api directory (users, activities...)
// export the api router
const express = require ("express");
const apiRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;


apiRouter.get("/health", (req, res, next) => {
    res.send({ message: "Working" });
  });

  module.exports = apiRouter