import { Router, Request, Response } from "express";
import { sendContactEmail } from "../services/email.service";

const router = Router();

interface ContactRequest {
  name: string;
  email: string;
  message: string;
}

router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, email, message }: ContactRequest = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        message: "Missing required fields: name, email, and message are required",
        statusCode: 400,
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
        statusCode: 400,
      });
    }

    // Send email
    await sendContactEmail(name, email, message);

    res.status(200).json({
      message: "Contact form submitted successfully. Email has been sent.",
      statusCode: 200,
    });
  } catch (error) {
    console.error("Error processing contact form:", error);
    res.status(500).json({
      message: "Failed to send email. Please try again later.",
      statusCode: 500,
    });
  }
});

export default router;
