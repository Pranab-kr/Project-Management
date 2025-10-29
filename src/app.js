import express from "express";
import cors from "cors";

const app = express();

//Basic middleware setup
app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));

//cors config
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
}));

//impoprt the routes
import healthCheckRouteer from "./routes/helthcheck.routes.js";

app.use("/api/v1/health-check" , healthCheckRouteer);

app.get("/", (req, res) => {
  res.json({ message: "Project Management API is running" });
});

export default app;
