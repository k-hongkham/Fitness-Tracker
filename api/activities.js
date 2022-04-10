const express = require("express");
const activitiesRouter = express.Router();
const { getAllActivities } = require("../db");
const { requireUser } = require("./utils");

activitiesRouter.get("/", async (req, res, next) => {
  try {
    const activities = await getAllActivities();
    res.send({
      activities,
    });
  } catch (error) {
    console.log("ACTIVITIES");
    throw error;
  }
});

module.exports = activitiesRouter;
