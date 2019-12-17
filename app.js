const express = require("express");
const app = express();
const apiRouter = require("./server/routes/apiRouter");

app.use(express.json());
app.use("/api", apiRouter);

app.use((err, req, res, next) => {
  console.log("activated error handler");
  if (err.status === 404) {
    res.status(404).send({ msg: "Not found" });
  } else if (err.code === "22P02") res.status(400).send({ msg: "Invalid ___" });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal server error" });
});

apiRouter.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "Not found" });
});

module.exports = app;
