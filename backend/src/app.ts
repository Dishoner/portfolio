import express from "express";
import cors from "cors";
import resumeRoutes from "./routes/resume.routes";
import contactRoutes from "./routes/contact.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/resume", resumeRoutes);
app.use("/api/contact", contactRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

export default app;
