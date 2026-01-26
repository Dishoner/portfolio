import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
  cc?: string | string[];
}

/**
 * Creates a nodemailer transporter using Gmail App Password
 */
function createTransporter() {
  // Verify all required environment variables are set
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    throw new Error("Missing required Gmail configuration: GMAIL_USER and GMAIL_APP_PASSWORD must be set");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  return transporter;
}

/**
 * Sends an email using Gmail OAuth2
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
  cc,
}: SendEmailParams): Promise<void> {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"${process.env.GMAIL_FROM_NAME || "Portfolio Contact"}" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ""), // Fallback to plain text if html provided
      ...(cc && { cc }), // Include CC if provided
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
}

/**
 * Sends a contact form email
 */
export async function sendContactEmail(
  name: string,
  email: string,
  message: string
): Promise<void> {
  const recipientEmail = process.env.CONTACT_RECIPIENT_EMAIL || process.env.GMAIL_USER;
  
  if (!recipientEmail) {
    throw new Error("Recipient email not configured");
  }

  const subject = `New Contact Form Submission from ${name}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">New Contact Form Submission</h2>
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Message:</strong></p>
        <div style="background-color: white; padding: 15px; border-left: 4px solid #007bff; margin-top: 10px;">
          ${message.replace(/\n/g, "<br>")}
        </div>
      </div>
      <p style="color: #666; font-size: 12px; margin-top: 20px;">
        This email was sent from your portfolio contact form.
      </p>
    </div>
  `;

  await sendEmail({
    to: recipientEmail,
    subject,
    html,
    cc: email, // Add the sender's email to CC
  });
}
