const express = require("express");
const routinesRouter = express.Router();
const { getAllPublicRoutines } = require("../db");

routinesRouter.get("/", async (req, res, next) => {
  try {
    const publicRoutines = await getAllPublicRoutines();
    res.send(publicRoutines);
  } catch (error) {
    throw error;
  }
});

module.exports = routinesRouter;
