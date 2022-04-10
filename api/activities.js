const express = require("express");
const activitiesRouter = express.Router();
const {
  getAllActivities,
  createActivity,
  getActivityById,
  updateActivity,
} = require("../db");
const { requireUser } = require("./utils");

activitiesRouter.get("/", async (req, res, next) => {
  try {
    const activities = await getAllActivities();
    res.send(activities);
  } catch (error) {
    throw error;
  }
});

activitiesRouter.post("/", async (req, res, next) => {
  const { name, description } = req.body;

  try {
    const activitiesData = {
      name,
      description,
    };
    const activity = await createActivity(activitiesData);

    res.send(activity);
  } catch (error) {
    throw error;
  }
});

activitiesRouter.patch("/:activityId", async (req, res, next) => {
  let id = req.params.activityId;
  let { name, description } = req.body;

  try {
    const updateAct = await updateActivity({
      id,
      name,
      description,
    });
    console.log("*************UPDATEACT********LINE 46", updateAct);
    res.send(updateAct);
  } catch (error) {
    throw error;
  }
});

module.exports = activitiesRouter;
