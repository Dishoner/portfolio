/**
 * Script to generate Gmail OAuth2 Refresh Token
 * 
 * Instructions:
 * 1. Make sure you have GMAIL_CLIENT_ID and GMAIL_CLIENT_SECRET in your .env file
 * 2. Run this script: npm run generate-token
 * 3. Follow the prompts to authorize and get your refresh token
 */

import { google } from "googleapis";
import * as readline from "readline";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground" // Redirect URL
);

// Scopes needed for sending emails
const SCOPES = ["https://www.googleapis.com/auth/gmail.send"];

/**
 * Get and store new token after prompting for user authorization
 */
function getNewToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
    });

    console.log("\n===========================================");
    console.log("Gmail OAuth2 Setup");
    console.log("===========================================\n");
    console.log("Authorize this app by visiting this url:");
    console.log("\n" + authUrl + "\n");

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question("Enter the code from that page here: ", (code) => {
      rl.close();

      oauth2Client.getToken(code, (err, token) => {
        if (err) {
          console.error("Error while trying to retrieve access token", err);
          reject(err);
          return;
        }

        if (!token || !token.refresh_token) {
          console.error("No refresh token found. Make sure you revoked previous tokens and try again.");
          reject(new Error("No refresh token found"));
          return;
        }

        console.log("\n✅ Success! Your refresh token is:");
        console.log("\n" + token.refresh_token + "\n");
        console.log("Add this to your .env file as GMAIL_REFRESH_TOKEN\n");

        resolve(token.refresh_token);
      });
    });
  });
}

async function main() {
  if (!process.env.GMAIL_CLIENT_ID || !process.env.GMAIL_CLIENT_SECRET) {
    console.error(
      "❌ Error: GMAIL_CLIENT_ID and GMAIL_CLIENT_SECRET must be set in .env file"
    );
    process.exit(1);
  }

  try {
    const refreshToken = await getNewToken();
    console.log("Setup complete! You can now use this refresh token in your .env file.");
    process.exit(0);
  } catch (error) {
    console.error("Failed to generate refresh token:", error);
    process.exit(1);
  }
}

main();
