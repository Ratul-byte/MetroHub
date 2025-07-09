import express from "express"
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";

const app = express()

app.get("/api/uma", (req, res) => {
    //res.send("UMA UMA UMA");
    console.log(req)
    return res.status(234).send("Welcome UMA")
});

app.listen(PORT, () => {
    console.log("Umamusume started on PORT: 5001");
    
});

mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log('App connected to database');
    app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });