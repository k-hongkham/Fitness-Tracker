const healthRouter = require("express").Router();

healthRouter.get("/", async (req, res) => {
  res.send({ message: "Healthy!" });
});

module.exports = healthRouter;