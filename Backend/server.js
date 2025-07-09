import express from "express";
import cors from "cors";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import authRoutes from './routes/authRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.get("/api/uma", (req, res) => {
    console.log(req);
    return res.status(234).send("Welcome UMA");
});

app.use('/api/auth', authRoutes);

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