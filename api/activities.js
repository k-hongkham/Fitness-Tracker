const express = require("express");
const activitiesRouter = express.Router();
const {
    getAllActivities, 
    createActivity,
    getActivityById,
    updateActivity,
    getPublicRoutinesByActivity,
} = require("../db");

const {requireUser} = require("./utils");

activitiesRouter.get("/", async (req, res, next) => {
    try {
        const activities = await getAllActivities();
        res.send(activities);
    }catch (error) {
        throw error;
    }
});

activitiesRouter.get("/:activityId/routines", async(req, res, next) => {
    const id = req.params.activityId;

    try {
        const activity = await getActivityById(id);
        const publicRoutineByAct = await getPublicRoutineByActivity(activity);
        res.send(publicRoutineByAct);
    } catch (error) {
        throw error;
        
    }
});


module.exports = activitiesRouter;