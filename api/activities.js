const express = require("express");
const activitiesRouter = express.Router();
const {
  getAllActivities,
  createActivity,
  getActivityById,
  updateActivity,
  getPublicRoutinesByActivity,
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

activitiesRouter.get("/:activityId/routines", async (req, res, next) => {
  const id = req.params.activityId;

  try {
    const activity = await getActivityById(id);
    const publicRoutineByAct = await getPublicRoutinesByActivity(activity);
    res.send(publicRoutineByAct);
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
  const id = req.params.activityId;
  const { name, description } = req.body;

  try {
    const updateAct = await updateActivity({
      id,
      name,
      description,
    });
    res.send(updateAct);
  } catch (error) {
    throw error;
  }
});

module.exports = activitiesRouter;