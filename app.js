const express = require("express");
const app = express();
const apiRouter = require(".server/routes/apiRouter");

app.use("/api", apiRouter);
