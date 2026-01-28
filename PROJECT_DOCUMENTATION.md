# Portfolio Project - Complete Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Frontend Application](#frontend-application)
6. [Backend Application](#backend-application)
7. [Dependencies & Libraries](#dependencies--libraries)
8. [Configuration Files](#configuration-files)
9. [Environment Variables](#environment-variables)
10. [API Endpoints](#api-endpoints)
11. [Key Features & Logic](#key-features--logic)
12. [Content Management](#content-management)
13. [Deployment Requirements](#deployment-requirements)
14. [Development Workflow](#development-workflow)
15. [Important Files Reference](#important-files-reference)

---

## Project Overview

This is a **full-stack personal portfolio website** showcasing projects, work experience, skills, and providing a contact form. The project consists of:

- **Frontend**: Next.js 16.1.1 application with React 19.2.3
- **Backend**: Express.js 5.2.1 API server with TypeScript
- **Purpose**: Personal portfolio website with dynamic content, contact form functionality, and resume download capability

**Project Location**: `x:\De\Project\Portfolio`

---

## Architecture

### System Architecture
- **Frontend-Backend Separation**: Frontend and backend are separate applications
- **Communication**: Frontend communicates with backend via REST API
- **Frontend Port**: 3000 (default Next.js)
- **Backend Port**: 4000 (configured in server.ts)

### Data Flow
1. Frontend fetches content from JSON files (projects, skills, work experience)
2. Frontend makes API calls to backend for:
   - Contact form submissions (`POST /api/contact`)
   - Resume downloads (`GET /api/resume`)
3. Backend handles email sending via Gmail API using OAuth2
4. Backend serves PDF resume file from assets directory

---

## Technology Stack

### Frontend Stack
- **Framework**: Next.js 16.1.1 (App Router)
- **UI Library**: React 19.2.3
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Animation**: Motion (Framer Motion) 12.29.2
- **3D Graphics**: Three.js 0.167.1, @react-three/fiber 9.5.0
- **UI Utilities**: 
  - class-variance-authority 0.7.1
  - clsx 2.1.1
  - tailwind-merge 3.4.0
- **Icons**: lucide-react 0.562.0
- **Build Tool**: Next.js built-in (Webpack/Turbopack)
- **CSS Processing**: PostCSS with @tailwindcss/postcss 4
- **Linting**: ESLint 9 with Next.js config

### Backend Stack
- **Framework**: Express.js 5.2.1
- **Language**: TypeScript 5.9.3
- **Email Service**: 
  - nodemailer 6.9.16
  - googleapis 144.0.0 (Gmail OAuth2)
- **CORS**: cors 2.8.5
- **Environment**: dotenv 16.4.5
- **Development**: 
  - ts-node-dev 2.0.0 (hot reload)
  - ts-node 10.9.2

---

## Project Structure

```
Portfolio/
├── .gitignore                          # Git ignore rules
├── README.md                           # Root README
├── PROJECT_DOCUMENTATION.md            # This file
│
├── frontend/
│   └── portfolio-website/
│       ├── package.json                # Frontend dependencies
│       ├── package-lock.json           # Locked versions
│       ├── tsconfig.json               # TypeScript config
│       ├── next.config.ts              # Next.js config
│       ├── postcss.config.mjs         # PostCSS config
│       ├── eslint.config.mjs           # ESLint config
│       ├── components.json             # shadcn/ui config
│       │
│       ├── public/                     # Static assets
│       │   ├── images/
│       │   │   └── projects/           # Project images
│       │   └── *.svg                   # SVG icons
│       │
│       └── src/
│           ├── app/                    # Next.js App Router
│           │   ├── layout.tsx          # Root layout
│           │   ├── page.tsx            # Home page
│           │   ├── globals.css         # Global styles
│           │   ├── favicon.ico         # Site icon
│           │   ├── about/
│           │   │   └── page.tsx        # About page
│           │   ├── contact/
│           │   │   └── page.tsx        # Contact page
│           │   └── projects/
│           │       ├── page.tsx        # Projects listing
│           │       └── [id]/
│           │           ├── page.tsx     # Project detail page
│           │           ├── ProjectImage.tsx
│           │           └── BackendProjectCard.tsx
│           │
│           ├── components/
│           │   └── ui/
│           │       ├── background-gradient-animation.tsx
│           │       └── evervault-card.tsx
│           │
│           ├── content/                # JSON data files
│           │   ├── projects.json
│           │   ├── skills.json
│           │   └── work-experience.json
│           │
│           └── lib/
│               └── utils.ts             # Utility functions
│
└── backend/
    ├── package.json                    # Backend dependencies
    ├── tsconfig.json                   # TypeScript config
    ├── GMAIL_SETUP.md                  # Gmail OAuth setup guide
    │
    ├── scripts/
    │   └── generate-refresh-token.ts   # OAuth token generator
    │
    └── src/
        ├── server.ts                   # Server entry point
        ├── app.ts                      # Express app setup
        │
        ├── routes/
        │   ├── contact.routes.ts       # Contact API routes
        │   └── resume.routes.ts        # Resume download routes
        │
        ├── services/
        │   └── email.service.ts        # Email service logic
        │
        └── assets/
            └── Dev Swami.pdf           # Resume PDF file
```

---

## Frontend Application

### Next.js App Router Structure
The frontend uses Next.js 16 App Router with file-based routing:

- **`/`** → Home page (`src/app/page.tsx`)
- **`/about`** → About page (`src/app/about/page.tsx`)
- **`/contact`** → Contact page (`src/app/contact/page.tsx`)
- **`/projects`** → Projects listing (`src/app/projects/page.tsx`)
- **`/projects/[id]`** → Dynamic project detail page (`src/app/projects/[id]/page.tsx`)

### Key Frontend Features

#### 1. Home Page (`page.tsx`)
- **Animated Hero Section**: 
  - Text appears centered, fades in after 100ms
  - After 2 seconds, transitions from center to top position
  - Main content fades in after transition
  - Uses sessionStorage to skip animation on navigation back
- **Work Experience Section**: 
  - Displays work experience from `work-experience.json`
  - Highlights programming languages in project descriptions
  - Responsive layout with company name (25%) and details (75%)
- **Featured Projects**: 
  - Shows first 2 projects from `projects.json`
  - Links to full projects page
- **Resume Download**: 
  - Button triggers API call to backend
  - Downloads PDF file from backend

#### 2. Projects Page (`projects/page.tsx`)
- Lists all projects from `projects.json`
- Sorts projects by ID (PJ-1, PJ-2, PJ-3)
- Grid layout: 1 column mobile, 2 columns desktop
- Each card shows title, description, tech stack, and details button
- Links to individual project detail pages

#### 3. Project Detail Page (`projects/[id]/page.tsx`)
- Dynamic route based on project ID
- Displays project title, description, technologies
- **Image Carousel**: 
  - Shows project images if available
  - Uses `ProjectImage` component with navigation arrows and dots
  - Handles image loading errors gracefully
- **Backend Project Card**: 
  - Shows animated card for projects without images
  - Uses `BackendProjectCard` component with gradient effects
- Shows NDA/demo availability notes for specific projects

#### 4. Contact Page (`contact/page.tsx`)
- **Contact Form**:
  - Name, email, message fields
  - Real-time validation
  - Field-level error messages
  - Submits to backend API (`POST /api/contact`)
  - Success/error feedback
- **Social Links**:
  - LinkedIn, GitHub, WhatsApp, Phone, Email
  - Configurable links in component constants

#### 5. About Page (`about/page.tsx`)
- Displays personal introduction
- Skills section organized by category from `skills.json`
- Skills displayed as badges/tags

### UI Components

#### BackgroundGradientAnimation
- Animated gradient background with multiple moving circles
- Interactive mouse tracking
- Safari-specific optimizations
- Used in root layout for global background

#### EvervaultCard
- Animated card with random string pattern
- Mouse-tracking gradient effects
- Used for decorative elements

#### BackendProjectCard
- Customizable animated card for backend projects
- Configurable text, colors, gradients
- Random string overlay on hover
- Used when projects don't have images

#### ProjectImage
- Image carousel component
- Supports single or multiple images
- Navigation arrows and dot indicators
- Error handling for missing images

### Styling System
- **Tailwind CSS 4**: Utility-first CSS framework
- **Global Styles** (`globals.css`):
  - CSS variables for theming
  - Dark mode support via `prefers-color-scheme`
  - Custom animations (moveHorizontal, moveInCircle, moveVertical)
  - Antialiased fonts
- **Color Scheme**: 
  - Light background: `oklch(1 0 0)` (white)
  - Dark background: `oklch(0.129 0.042 264.695)` (dark gray)
  - Primary text: `#F0F0F0` (light gray)
  - Accent: `#B0A6A4` (beige)

---

## Backend Application

### Express Server Setup
- **Entry Point**: `src/server.ts`
- **Port**: 4000
- **CORS**: Enabled for all origins
- **Body Parser**: JSON middleware enabled

### API Routes

#### 1. Contact Routes (`routes/contact.routes.ts`)
- **Endpoint**: `POST /api/contact`
- **Request Body**:
  ```json
  {
    "name": "string",
    "email": "string",
    "message": "string"
  }
  ```
- **Validation**:
  - Checks required fields (name, email, message)
  - Validates email format with regex
- **Response**:
  - Success: `200` with success message
  - Error: `400` (validation) or `500` (server error)
- **Logic**: Calls `sendContactEmail` service to send email via Gmail

#### 2. Resume Routes (`routes/resume.routes.ts`)
- **Endpoint**: `GET /api/resume`
- **Response**: Downloads PDF file (`Dev Swami.pdf`)
- **Headers**: Sets `X-Status-Code: 200` before download
- **Error Handling**: Returns 500 if file not found

#### 3. Health Check
- **Endpoint**: `GET /health`
- **Response**: `{ status: "ok" }`

### Email Service (`services/email.service.ts`)

#### Gmail OAuth2 Integration
- Uses `nodemailer` with Gmail service
- Requires Gmail App Password (not OAuth2 refresh token in current implementation)
- Environment variables needed:
  - `GMAIL_USER`: Gmail address
  - `GMAIL_APP_PASSWORD`: Gmail App Password
  - `GMAIL_FROM_NAME`: Sender display name (optional)
  - `CONTACT_RECIPIENT_EMAIL`: Recipient email (defaults to GMAIL_USER)

#### Functions
- **`createTransporter()`**: Creates nodemailer transporter with Gmail credentials
- **`sendEmail()`**: Generic email sending function
- **`sendContactEmail()`**: 
  - Sends formatted HTML email with contact form data
  - Includes sender's email in CC
  - Formats message with HTML styling

### OAuth Token Generation Script
- **Location**: `scripts/generate-refresh-token.ts`
- **Purpose**: Generates Gmail OAuth2 refresh token
- **Usage**: `npm run generate-token`
- **Note**: Currently uses App Password, but script exists for OAuth2 setup if needed

---

## Dependencies & Libraries

### Frontend Dependencies

#### Production Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| next | 16.1.1 | Next.js framework |
| react | 19.2.3 | React library |
| react-dom | 19.2.3 | React DOM renderer |
| @react-three/fiber | ^9.5.0 | React renderer for Three.js |
| class-variance-authority | ^0.7.1 | Component variant management |
| clsx | ^2.1.1 | Conditional className utility |
| lucide-react | ^0.562.0 | Icon library |
| motion | ^12.29.2 | Animation library (Framer Motion) |
| tailwind-merge | ^3.4.0 | Merge Tailwind classes |
| three | ^0.167.1 | 3D graphics library |

#### Development Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| @tailwindcss/postcss | ^4 | Tailwind PostCSS plugin |
| @types/node | ^20 | Node.js TypeScript types |
| @types/react | ^19 | React TypeScript types |
| @types/react-dom | ^19 | React DOM TypeScript types |
| @types/three | ^0.182.0 | Three.js TypeScript types |
| babel-plugin-react-compiler | 1.0.0 | React Compiler plugin |
| eslint | ^9 | ESLint linter |
| eslint-config-next | 16.1.1 | Next.js ESLint config |
| tailwindcss | ^4 | Tailwind CSS framework |
| tw-animate-css | ^1.4.0 | Tailwind animation utilities |
| typescript | ^5 | TypeScript compiler |

### Backend Dependencies

#### Production Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| cors | ^2.8.5 | CORS middleware |
| dotenv | ^16.4.5 | Environment variable loader |
| express | ^5.2.1 | Web framework |
| googleapis | ^144.0.0 | Google APIs client (Gmail) |
| nodemailer | ^6.9.16 | Email sending library |

#### Development Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| @types/cors | ^2.8.19 | CORS TypeScript types |
| @types/express | ^5.0.6 | Express TypeScript types |
| @types/node | ^25.0.10 | Node.js TypeScript types |
| @types/nodemailer | ^6.4.14 | Nodemailer TypeScript types |
| ts-node | ^10.9.2 | TypeScript execution |
| ts-node-dev | ^2.0.0 | TypeScript dev server with hot reload |
| typescript | ^5.9.3 | TypeScript compiler |

---

## Configuration Files

### Frontend Configuration

#### `tsconfig.json`
- **Target**: ES2017
- **Module**: ESNext
- **JSX**: react-jsx
- **Path Alias**: `@/*` → `./src/*`
- **Strict Mode**: Enabled
- **Module Resolution**: bundler

#### `next.config.ts`
- **React Compiler**: Enabled (`reactCompiler: true`)
- Minimal configuration

#### `postcss.config.mjs`
- Uses `@tailwindcss/postcss` plugin
- Processes Tailwind CSS

#### `eslint.config.mjs`
- Uses Next.js core web vitals rules
- Uses Next.js TypeScript rules
- Ignores: `.next/`, `out/`, `build/`, `next-env.d.ts`

#### `components.json`
- shadcn/ui configuration
- Style: "new-york"
- RSC (React Server Components): Enabled
- Tailwind CSS variables: Enabled
- Icon library: lucide

### Backend Configuration

#### `tsconfig.json`
- **Target**: ES2020
- **Module**: CommonJS
- **Module Resolution**: node
- **Root Dir**: `src`
- **Out Dir**: `dist`
- **Strict Mode**: Enabled

---

## Environment Variables

### Frontend Environment Variables
Create `.env.local` in `frontend/portfolio-website/`:

```env
# Backend API URL (for production)
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

**Note**: If not set, defaults to `http://localhost:4000` in development.

### Backend Environment Variables
Create `.env` in `backend/`:

```env
# Gmail Configuration
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
GMAIL_FROM_NAME=Portfolio Contact
CONTACT_RECIPIENT_EMAIL=your-email@gmail.com

# Optional: OAuth2 (if using OAuth instead of App Password)
GMAIL_CLIENT_ID=your-client-id
GMAIL_CLIENT_SECRET=your-client-secret
GMAIL_REFRESH_TOKEN=your-refresh-token
```

**Important**: 
- `.env` files are in `.gitignore` and should never be committed
- For Gmail App Password: Go to Google Account → Security → 2-Step Verification → App Passwords
- For OAuth2: Follow instructions in `backend/GMAIL_SETUP.md`

---

## API Endpoints

### Backend API Base URL
- **Development**: `http://localhost:4000`
- **Production**: Set via `NEXT_PUBLIC_API_URL` environment variable

### Endpoints

#### 1. Contact Form Submission
- **Method**: `POST`
- **URL**: `/api/contact`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Hello, I'm interested in your work."
  }
  ```
- **Success Response** (200):
  ```json
  {
    "message": "Contact form submitted successfully. Email has been sent.",
    "statusCode": 200
  }
  ```
- **Error Response** (400):
  ```json
  {
    "message": "Missing required fields: name, email, and message are required",
    "statusCode": 400
  }
  ```

#### 2. Resume Download
- **Method**: `GET`
- **URL**: `/api/resume`
- **Response**: PDF file download (`Dev Swami.pdf`)
- **Headers**: 
  - `Content-Type: application/pdf`
  - `X-Status-Code: 200`
- **Error Response** (500):
  ```json
  {
    "message": "Unable to download resume",
    "statusCode": 500
  }
  ```

#### 3. Health Check
- **Method**: `GET`
- **URL**: `/health`
- **Response**:
  ```json
  {
    "status": "ok"
  }
  ```

---

## Key Features & Logic

### 1. Animated Hero Section Logic
- **Initial State**: Text centered, opacity 0
- **Fade In**: After 100ms, opacity transitions to 100
- **Position Calculation**: After 300ms, calculates exact position to align with hero section
- **Transition**: After 2000ms, text moves from center to top using `translateY`
- **Content Reveal**: After transition (1200ms), main content fades in
- **Session Management**: Uses `sessionStorage` to skip animation on navigation back
- **Responsive**: Handles window resize and orientation changes

### 2. Project Image Carousel Logic
- **State Management**: Tracks current image index
- **Navigation**: Previous/Next buttons cycle through images
- **Dot Indicators**: Click to jump to specific image
- **Error Handling**: Tracks image load errors, shows fallback message
- **Single Image**: Renders without carousel controls if only one image
- **Sliding Animation**: Uses CSS transform for smooth transitions

### 3. Contact Form Validation Logic
- **Field Validation**:
  - Name: Required, non-empty after trim
  - Email: Required, valid email format (regex)
  - Message: Required, non-empty after trim
- **Real-time Validation**: Validates email as user types (after field is touched)
- **Error Display**: Shows field-specific error messages
- **Visual Feedback**: Border color changes to red on error
- **Submission**: Validates all fields before API call
- **Success Handling**: Clears form and shows success message for 5 seconds

### 4. Work Experience Highlighting Logic
- **Language Detection**: Regex pattern matches common programming languages
- **Highlighting**: Wraps matched languages in `<strong>` tags
- **Sorting**: Sorts by ID number (PT-1, PT-2, etc.)
- **Display**: Company name (25% width) + details (75% width) with vertical divider

### 5. Project Sorting Logic
- **ID Parsing**: Extracts number from ID format "PJ-{number}"
- **Sorting**: Sorts projects by extracted number (ascending)
- **Grid Layout**: Centers last item if odd count in 2-column grid

### 6. Resume Download Logic
- **API Call**: Fetches from backend `/api/resume` endpoint
- **Blob Handling**: Converts response to blob
- **Download**: Creates temporary anchor element, triggers download
- **Error Handling**: Shows alert if download fails

---

## Content Management

### JSON Data Files

All content is managed through JSON files in `src/content/`:

#### 1. `projects.json`
Structure:
```json
{
  "projects": [
    {
      "id": "PJ-1",
      "title": "Project Title",
      "description": "Full project description",
      "ShortDiscription": "Short description",
      "tech": ["React", "Node.js", "TypeScript"],
      "images": ["/images/projects/image1.png"],
      "liveUrl": "https://example.com",
      "githubUrl": "https://github.com/user/repo"
    }
  ]
}
```

**Fields**:
- `id`: Unique identifier (format: PJ-{number})
- `title`: Project title
- `description`: Full description
- `ShortDiscription`: Short description for cards
- `tech`: Array of technology names
- `images`: Array of image paths (optional)
- `liveUrl`: Live demo URL (optional)
- `githubUrl`: GitHub repository URL (optional)

#### 2. `skills.json`
Structure:
```json
{
  "Languages & Frameworks": ["TypeScript", "JavaScript", "React"],
  "Styling & Tools": ["Tailwind CSS", "Figma", "Git"],
  "Concepts": ["Responsive Design", "REST APIs"]
}
```

**Structure**: Object with category names as keys, arrays of skill names as values

#### 3. `work-experience.json`
Structure:
```json
{
  "workExperience": [
    {
      "id": "PT-1",
      "company_name": "Company Name",
      "duration": "Jan 2025 - Dec 2025",
      "position": "Job Title",
      "description": "Job description",
      "projects": ["Project 1", "Project 2"]
    }
  ]
}
```

**Fields**:
- `id`: Unique identifier (format: PT-{number})
- `company_name`: Company name
- `duration`: Employment duration
- `position`: Job title/position
- `description`: Job description
- `projects`: Array of project descriptions

### Image Assets
- **Location**: `public/images/projects/`
- **Naming**: `project{number}-image{number}.png`
- **Usage**: Referenced in `projects.json` as `/images/projects/filename.png`

---

## Deployment Requirements

### Frontend Deployment

#### Build Commands
```bash
cd frontend/portfolio-website
npm install
npm run build
npm run start
```

#### Environment Variables
- Set `NEXT_PUBLIC_API_URL` to production backend URL

#### Recommended Platforms
- **Vercel**: Optimal for Next.js (automatic deployments)
- **Netlify**: Good alternative
- **Self-hosted**: Requires Node.js server

#### Build Output
- Directory: `.next/`
- Static assets: `public/`
- Server: Next.js production server

### Backend Deployment

#### Build Commands
```bash
cd backend
npm install
npm run build
npm run start
```

#### Environment Variables
- All variables from `.env` must be set in production environment
- **Critical**: `GMAIL_USER`, `GMAIL_APP_PASSWORD`, `CONTACT_RECIPIENT_EMAIL`

#### Required Files
- `dist/` directory (compiled JavaScript)
- `src/assets/Dev Swami.pdf` (resume file)

#### Recommended Platforms
- **Railway**: Easy Node.js deployment
- **Render**: Free tier available
- **Heroku**: Traditional option
- **VPS**: Self-hosted (DigitalOcean, AWS EC2, etc.)

#### Port Configuration
- Default: 4000
- Can be changed via `PORT` environment variable in `server.ts`

### Full Stack Deployment Considerations

1. **CORS Configuration**: Backend must allow frontend domain
2. **API URL**: Frontend must point to production backend URL
3. **HTTPS**: Required for production (especially for email service)
4. **Environment Variables**: Never commit `.env` files
5. **Resume File**: Ensure PDF is included in deployment
6. **Gmail Setup**: App Password or OAuth2 must be configured

---

## Development Workflow

### Frontend Development

#### Start Development Server
```bash
cd frontend/portfolio-website
npm install
npm run dev
```
- Server runs on `http://localhost:3000`
- Hot reload enabled
- TypeScript type checking

#### Build for Production
```bash
npm run build
```
- Creates optimized production bundle
- Type checking and linting
- Output in `.next/` directory

#### Run Production Server
```bash
npm run start
```
- Serves production build
- Runs on port 3000

#### Linting
```bash
npm run lint
```
- Runs ESLint with Next.js rules

### Backend Development

#### Start Development Server
```bash
cd backend
npm install
npm run dev
```
- Server runs on `http://localhost:4000`
- Hot reload with `ts-node-dev`
- TypeScript compilation on the fly

#### Build for Production
```bash
npm run build
```
- Compiles TypeScript to JavaScript
- Output in `dist/` directory

#### Run Production Server
```bash
npm run start
```
- Runs compiled JavaScript from `dist/`
- Requires `npm run build` first

#### Generate Gmail Refresh Token (if using OAuth2)
```bash
npm run generate-token
```
- Interactive script to generate OAuth2 refresh token
- Follow prompts to authorize and get token

### Development Tips

1. **Frontend Changes**: Edit files in `src/app/` for immediate updates
2. **Backend Changes**: Restart server if hot reload doesn't catch changes
3. **Content Updates**: Edit JSON files in `src/content/` (no restart needed)
4. **Styling**: Use Tailwind classes, edit `globals.css` for global styles
5. **Type Safety**: TypeScript will catch errors during development

---

## Important Files Reference

### Frontend Critical Files

| File | Purpose | Critical For |
|------|---------|--------------|
| `src/app/layout.tsx` | Root layout, global background | App structure |
| `src/app/page.tsx` | Home page with animations | Main landing page |
| `src/app/contact/page.tsx` | Contact form | User interaction |
| `src/app/projects/[id]/page.tsx` | Project details | Content display |
| `src/app/globals.css` | Global styles, theme | Styling system |
| `src/content/projects.json` | Project data | Content management |
| `src/content/work-experience.json` | Work experience data | Content management |
| `src/content/skills.json` | Skills data | Content management |
| `next.config.ts` | Next.js configuration | Build process |
| `package.json` | Dependencies | Project setup |

### Backend Critical Files

| File | Purpose | Critical For |
|------|---------|--------------|
| `src/server.ts` | Server entry point | Application startup |
| `src/app.ts` | Express app setup | API routing |
| `src/routes/contact.routes.ts` | Contact API | Contact form functionality |
| `src/routes/resume.routes.ts` | Resume API | Resume download |
| `src/services/email.service.ts` | Email service | Email sending |
| `src/assets/Dev Swami.pdf` | Resume file | Resume download |
| `.env` | Environment variables | Configuration (not in repo) |
| `package.json` | Dependencies | Project setup |

### Configuration Files

| File | Purpose |
|------|---------|
| `frontend/portfolio-website/tsconfig.json` | TypeScript config (frontend) |
| `backend/tsconfig.json` | TypeScript config (backend) |
| `frontend/portfolio-website/postcss.config.mjs` | PostCSS config |
| `frontend/portfolio-website/eslint.config.mjs` | ESLint config |
| `frontend/portfolio-website/components.json` | shadcn/ui config |
| `.gitignore` | Git ignore rules |

### Documentation Files

| File | Purpose |
|------|---------|
| `PROJECT_DOCUMENTATION.md` | This file - complete documentation |
| `backend/GMAIL_SETUP.md` | Gmail OAuth2 setup instructions |
| `README.md` | Project README |

---

## Additional Notes

### Security Considerations
1. **Environment Variables**: Never commit `.env` files
2. **Gmail Credentials**: Keep App Password or OAuth tokens secure
3. **CORS**: Configure allowed origins in production
4. **Input Validation**: Backend validates all contact form inputs
5. **Email Validation**: Regex pattern prevents invalid emails

### Performance Optimizations
1. **React Compiler**: Enabled in Next.js config
2. **Code Splitting**: Automatic with Next.js
3. **Image Optimization**: Next.js Image component ready (when used)
4. **Font Optimization**: Inter font loaded via `next/font`
5. **CSS Optimization**: Tailwind purges unused styles

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design
- Safari-specific optimizations in BackgroundGradientAnimation

### Future Enhancements
- Add more project images
- Implement blog section
- Add analytics tracking
- Implement dark mode toggle
- Add more animation effects
- Optimize images with Next.js Image component

---

## Summary

This portfolio project is a **full-stack application** with:

- **Frontend**: Modern Next.js 16 app with React 19, TypeScript, Tailwind CSS 4
- **Backend**: Express.js 5 API server with TypeScript
- **Features**: Dynamic content, contact form, resume download, animated UI
- **Content Management**: JSON-based content files
- **Email Service**: Gmail integration via nodemailer
- **Deployment Ready**: Both frontend and backend can be deployed independently

**Key Technologies**: Next.js, React, TypeScript, Express.js, Tailwind CSS, Nodemailer, Gmail API

**Total Dependencies**: 
- Frontend: 11 production + 11 development
- Backend: 5 production + 6 development

**Important**: Ensure all environment variables are configured before deployment, especially Gmail credentials for the contact form functionality.
