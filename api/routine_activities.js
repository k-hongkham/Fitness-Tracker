const express = require("express");
const routineActivitiesRouter = express.Router();
const {
  getRoutineActivityById,
  updateRoutineActivity,
  destroyRoutineActivity,
} = require("../db");
const { requireUser } = require("./utils");

routineActivitiesRouter.patch(
  "/:routineActivityId",
  requireUser,
  async (req, res, next) => {
    const id = req.params.routineActivityId;
    const { count, duration } = req.body;
    const updateRouActsInfo = {};
    if (count) {
      updateRouActsInfo.count = count;
    }

    if (duration) {
      updateRouActsInfo.duration = duration;
    }
    console.log("UPDATE********", updateRouActsInfo);
    try {
      const originalRouAct = await getRoutineActivityById(id);
      console.log("********line 22********", originalRouAct);
      console.log("********line 23********", req.user.creatorId);

      if (originalRouAct === req.user.id) {
        const updateRouActs = await updateRoutineActivity({
          id,
          count,
          duration,
        });
        console.log(
          "********line 36 - updateRoutineActs********",
          updateRouActs
        );
        res.send({
          activity: updateRouActs,
        });
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
//     const id = req.params.routineActivityId;
//     const originalRouAct = await getRoutineActivityById(id);
//     console.log("***********I AM ID", id);
//     try {
//       if (originalRouAct && originalRouAct.id === req.user.id) {
//         const destroyRouAct = await destroyRoutineActivity(routineActivityId);
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
//     } catch (error) {
//       throw error;
//     }
//   }
// );

module.exports = routineActivitiesRouter;
