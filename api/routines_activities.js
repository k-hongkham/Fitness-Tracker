const express = require("express");
const routineActivitiesRouter = express.Router();
const {
  updateRoutineActivity,
  getRoutineActivityById,
  getRoutineById,
  destroyRoutineActivity,
} = require("../db");
const { requireUser } = require("./utils");

routineActivitiesRouter.patch(
  "/:routineActivityId",
  requireUser,
  async (req, res, next) => {
    try {
      const { routineActivityId } = req.params;
      let routineActivity = await getRoutineActivityById(routineActivityId);
      let routineId = routineActivity.routineId;
      const Routine = await getRoutineById(routineId);
      if (req.user.id === Routine.creatorId) {
        const { count, duration } = req.body;
        updateFields = {};
        updateFields.id = routineActivityId;
        if (count) {
          updateFields.count = count;
        }
        if (duration) {
          updateFields.duration = duration;
        }
        const updatedRoutineActivity = await updateRoutineActivity(
          updateFields
        );
        res.send(updatedRoutineActivity);
      } else {
        res.status(401);
        next({
          name: "testing",
          message: "test",
        });
      }
    } catch (error) {
      res.status(401);
      next(error);
    }
  }
);

routineActivitiesRouter.delete(
  "/:routineActivityId",
  requireUser,
  async (req, res, next) => {
    try {
      const { routineActivityId } = req.params;
      let routineActivity = await getRoutineActivityById(routineActivityId);
      let routineId = routineActivity.routineId;
      const Routine = await getRoutineById(routineId);
      if (req.user.id === Routine.creatorId) {
        await destroyRoutineActivity(routineActivityId);
        res.send(routineActivity);
      } else {
        res.status(401);
        next({
          name: "testing",
          message: "test",
        });
      }
    } catch (error) {
      throw error;
    }
  }
);

module.exports = routineActivitiesRouter;