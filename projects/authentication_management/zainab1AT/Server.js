import express from "express";
import dotenv from "dotenv";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";

const app = express();

dotenv.config();

const PORT = process.env.PORT;

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
