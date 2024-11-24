import express from "express";
import recordsRoutes from "./recordsRoutes";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" })); // Allow requests from your frontend

// Routes
app.use("/api/records", recordsRoutes);
app.use("/uploads", express.static(path.resolve(__dirname, "../uploads"))); // Adjusted path to "../uploads"

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
