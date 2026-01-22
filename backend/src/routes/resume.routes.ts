import { Router } from "express";
import path from "path";

const router = Router();

router.get("/", (_req, res) => {
  const filePath = path.join(__dirname, "..", "assets", "Dev Swami.pdf");

  // Set status code in header before download
  res.setHeader('X-Status-Code', '200');
  
  res.download(filePath, "Dev Swami.pdf", (err) => {
    if (err) {
      res.status(500).json({ 
        message: "Unable to download resume",
        statusCode: 500
      });
    }
  });
});

export default router;
