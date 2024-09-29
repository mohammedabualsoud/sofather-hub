import express from "express";
import dotenv from "dotenv";
import authRoutes from "./authRoutes.js";
import userController from "./userController.js";

const app = express();

dotenv.config();

const PORT = process.env.PORT;

app.use(express.json());

app.use("/api/auth", userController);
app.use("/user", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
