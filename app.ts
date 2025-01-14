import express from "express";

import filmRouter from "./routes/films";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Middleware to count the number if GET requests

let requestsCount = 0;
app.use((req, _res, next) => {
  if (req.method === "GET") {
    requestsCount++;
    console.log(`GET counter : ${requestsCount}`);
  }
  next();
  
});

app.use("/films", filmRouter);

export default app;
