const express = require("express");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const routinesRouter = express.Router();
const { getAllPublicRoutines, createRoutine, updateRoutine } = require("../db");

routinesRouter.get("/", async (req, res, next) => {
  try {
    const publicRoutines = await getAllPublicRoutines();
    res.send(publicRoutines);
  } catch (error) {
    throw error;
  }
});

routinesRouter.post("/", async (req, res, next) => {
  const { isPublic, name, goal } = req.body;

  const prefix = "Bearer ";
  const auth = req.header("Authorization");

  if (!auth) {
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);
    try {
      const { id } = jwt.verify(token, JWT_SECRET);
      let creatorId = id;
      if (!id) {
        res.status(401);
        next({ name: "INVALID ID", message: "ID not recognized" });
      } else {
        const routinesData = {
          creatorId,
          isPublic,
          name,
          goal,
        };
        const routine = await createRoutine(routinesData);
        res.send(routine);
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    res.status(404);
    next({
      name: "AuthorizationHeaderError",
      message: `AuthoriZation token must start with ${prefix}`,
    });
  }
});

routinesRouter.patch("/:routineId", async (req, res, next) => {
  const id = req.params.routineId;
  const { isPublic, name, goal } = req.body;

  try {
    const updateRou = await updateRoutine({
      id,
      isPublic,
      name,
      goal,
    });
    res.send(updateRou);
  } catch (error) {
    throw error;
  }
});

module.exports = routinesRouter;
