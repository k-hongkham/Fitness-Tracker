const express = require("express");
const routineActivitiesRouter = express.Router();
const {
  updateRoutineActivity,
  destroyRoutineActivity,
  getRoutineById,
  getRoutineActivityById,
} = require("../db");
const { requireUser } = require("./utils");

routineActivitiesRouter.patch(
  "/:routineActivityId",
  requireUser,
  async (req, res, next) => {
    try {
      const id = req.params.routineActivityId;
      const { count, duration } = req.body;
      let creatorId = req.user.id;
      const updateRouActs = await updateRoutineActivity({
        id,
        count,
        duration,
      });

      const routineToActivity = await getRoutineActivityById(id);
      const routineId = routineToActivity.routineId;
      const theRoutine = await getRoutineById(routineId);
      console.log("******theRoutine", theRoutine);

      if (theRoutine.creatorId === creatorId) {
        const updateActivityOnRoutine = await updateRoutineActivity(
          updateRouActs
        );
        res.send(updateActivityOnRoutine);
      } else {
        next({
          name: "unauthorizedUser",
          message:
            "You cannot update the post if you are not the authorized user.",
        });
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  }
);

// routineActivitiesRouter.delete(
//   "/:routineActivityId",
//   requireUser,
//   async (req, res, next) => {
//     try {
//       const id = req.params.routineActivityId;
//       let creatorId = req.user.id;
//       const originalRouAct = await getRoutineActivityById(id);
//       const routineId = routineActivity.routineId;
//       const routine = await getRoutineById(routineId);
//       if (routine.creatorId === creatorId) {
//         const destroyRouAct = await destroyRoutineActivity(id);
//         console.log("original rouacts", originalRouAct.id);
//         res.send(destroyRouAct);
//       } else {
//         originalRouAct
//           ? {
//               name: "UnauthorizedUser",
//               message: "You cannot delete Routine which is not yours",
//             }
//           : {
//               name: "RoutineNotFoundError",
//               message: "That routine does not exist",
//             };
//       }
//     } catch ({ name, message }) {
//       next({ name, message });
//     }
//   }
// );

module.exports = routineActivitiesRouter;
