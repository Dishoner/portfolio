# Gmail OAuth2 Setup Instructions

## ✅ Step 1: Configure Redirect URI in Google Cloud Console

Before generating the refresh token, you need to add the redirect URI to your OAuth 2.0 Client:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Click on your OAuth 2.0 Client ID (the one you're using)
4. Under **Authorized redirect URIs**, click **ADD URI**
5. Add this URI: `https://developers.google.com/oauthplayground`
6. Click **SAVE**

## ✅ Step 2: Install Dependencies

Make sure all packages are installed:

```bash
cd backend
npm install
```

## ✅ Step 3: Generate Refresh Token

Run the token generation script:

```bash
npm run generate-token
```

This will:
1. Display an authorization URL
2. Open that URL in your browser (or copy-paste it)
3. Sign in with your Google account (devswami157@gmail.com)
4. Grant permissions to the app
5. You'll be redirected to a page with an authorization code
6. Copy that code and paste it into the terminal when prompted
7. The script will display your refresh token

## ✅ Step 4: Update .env File

Copy the refresh token from Step 3 and update your `.env` file:

```env
GMAIL_REFRESH_TOKEN=your_actual_refresh_token_here
```

Replace `your_refresh_token_here` with the token you received.

## ✅ Step 5: Test the Setup

Start your backend server:

```bash
npm run dev
```

The contact form API endpoint is now ready at: `POST http://localhost:4000/api/contact`

## 📝 Environment Variables

Your `.env` file should contain:

```env
GMAIL_CLIENT_ID=sample_id
GMAIL_CLIENT_SECRET=Sample_secerate
GMAIL_REFRESH_TOKEN=<generated_token>
GMAIL_USER=devswami157@gmail.com
GMAIL_FROM_NAME=Portfolio Contact
CONTACT_RECIPIENT_EMAIL=devswami157@gmail.com
```

## 🔒 Security Note

- Never commit your `.env` file to version control
- The `.env` file is already in `.gitignore`
- Keep your `GMAIL_CLIENT_SECRET` and `GMAIL_REFRESH_TOKEN` secure

## 🐛 Troubleshooting

**Issue: "No refresh token found"**
- Make sure you're using `access_type: "offline"` (already set in the script)
- Revoke previous tokens in Google Cloud Console and try again
- Make sure you're signing in with the correct Google account

**Issue: "Redirect URI mismatch"**
- Verify you've added `https://developers.google.com/oauthplayground` to authorized redirect URIs
- Make sure there are no extra spaces or typos

**Issue: "Invalid grant"**
- Your refresh token may have expired or been revoked
- Generate a new refresh token using the script
