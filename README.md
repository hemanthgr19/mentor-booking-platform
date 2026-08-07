# Mentor Booking Platform

Mentor Booking Platform is a full-stack web application that connects candidates with mentors.

Candidates can create an account, browse mentors, search by expertise, view mentor availability and request a mentoring session.

Mentors can manage their available time slots, view booking requests and approve or decline candidate bookings.

---

## Features

### Candidate Features

Candidates can:

- Register a new account
- Login to an existing account
- Browse available mentors
- Search mentors by expertise
- View mentor profiles
- View available mentor time slots
- Request a mentoring session
- View their bookings
- Check whether a booking is pending, approved or declined
- Access the meeting link after a booking is approved

### Mentor Features

Mentors can:

- Register as a mentor
- Login to their account
- Add available date and time slots
- View their availability
- Remove an available slot
- View booking requests from candidates
- Approve booking requests
- Decline booking requests
- View confirmed session information

---

## Booking Process

The main booking process works like this:

1. A mentor logs into the platform.
2. The mentor adds an available date and time.
3. A candidate browses the mentor list.
4. The candidate opens a mentor profile.
5. The candidate selects an available slot.
6. A booking request is created with `pending` status.
7. The mentor sees the request in the Mentor Dashboard.
8. The mentor can approve or decline the request.
9. If approved, the slot is marked as booked.
10. The booking status changes to `approved`.
11. A meeting link is added to the booking.
12. The candidate can see the approved booking from My Bookings.

---

## Technologies Used

### Frontend

The frontend is built using:

- React
- Vite
- JavaScript
- Redux Toolkit
- React Redux
- React Router
- Axios
- Bootstrap
- React Slick
- AOS
- Chart.js
- React Chart.js 2

### Backend

The backend is built using:

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcryptjs
- Nodemailer
- CORS
- dotenv

---

## Project Structure

```text
mentor-booking-platform/
│
├── client/
│   ├── public/
│   │
│   ├── src/
│   │   ├── app/
│   │   │   └── store.js
│   │   │
│   │   ├── features/
│   │   │   └── auth/
│   │   │       └── authSlice.js
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Mentors.jsx
│   │   │   ├── MentorDetails.jsx
│   │   │   ├── MentorDashboard.jsx
│   │   │   ├── CandidateBookings.jsx
│   │   │   └── Stats.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── App.scss
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── package-lock.json
│
├── server/
│   ├── config/
│   │   ├── db.js
│   │   └── mailer.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── profileController.js
│   │   ├── mentorController.js
│   │   └── bookingController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   └── Booking.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── profileRoutes.js
│   │   ├── mentorRoutes.js
│   │   └── bookingRoutes.js
│   │
│   ├── .env.example
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
└── README.md
```

---

# Getting Started

## Requirements

Before running the project, make sure the following are installed:

- Node.js
- npm
- MongoDB or MongoDB Atlas
- Git

---

## 1. Clone the Repository

Clone the project from GitHub:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Then enter the project folder:

```bash
cd mentor-booking-platform
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with the real repository URL after the project has been uploaded to GitHub.

---

# Backend Setup

## 2. Open the Server Folder

```bash
cd server
```

---

## 3. Install Backend Dependencies

```bash
npm install
```

---

## 4. Configure Environment Variables

Inside the `server` folder, create a file called:

```text
.env
```

The project contains an `.env.example` file showing the required environment variables.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_jwt_secret_here
```

### Important

The real `.env` file should contain your actual MongoDB connection string and JWT secret.

Never upload the real `.env` file to GitHub.

The `.gitignore` file is configured to exclude environment files while allowing `.env.example` to be included.

---

## 5. Start the Backend

Run:

```bash
npm run dev
```

If the project does not have a development script configured, use:

```bash
node server.js
```

The backend normally runs on:

```text
http://localhost:5000
```

A successful MongoDB connection should also be displayed in the terminal.

---

# Frontend Setup

Open another terminal from the main project folder.

## 6. Open the Client Folder

```bash
cd client
```

---

## 7. Install Frontend Dependencies

```bash
npm install
```

---

## 8. Start the Frontend

```bash
npm run dev
```

Vite will display the local development address in the terminal.

It will normally be similar to:

```text
http://localhost:5173
```

The exact port can change if that port is already being used.

Open the URL shown by Vite in your browser.

---

# Authentication

The application uses JSON Web Tokens for authentication.

When a user successfully registers or logs in, the backend generates a JWT.

The frontend stores:

- JWT token
- User information
- User role

Redux Toolkit is used to manage authentication state.

The login information is also stored in browser local storage so the session can be restored after refreshing the page.

Protected API requests send the token using the Authorization header:

```text
Authorization: Bearer YOUR_TOKEN
```

---

# User Roles

There are two user roles in the application:

```text
candidate
mentor
```

Different functionality is available depending on the logged-in user's role.

---

## Candidate Role

A candidate can:

- Browse mentors
- Search mentors
- View mentor details
- View available slots
- Create booking requests
- View their booking history
- View approved meeting links

Candidates cannot manage mentor availability or approve bookings.

---

## Mentor Role

A mentor can:

- Add availability
- Remove unbooked availability
- View booking requests
- Approve bookings
- Decline bookings

Mentors cannot create candidate bookings.

---

# API Endpoints

## Authentication

### Register

```text
POST /api/auth/register
```

Example request:

```json
{
  "name": "Example User",
  "email": "user@example.com",
  "password": "password",
  "role": "candidate"
}
```

### Login

```text
POST /api/auth/login
```

Example request:

```json
{
  "email": "user@example.com",
  "password": "password"
}
```

---

# Profile API

### Get Profile

```text
GET /api/profile
```

Authentication is required.

### Update Profile

```text
PUT /api/profile
```

Authentication is required.

Candidate profiles can contain skills.

Mentor profiles can contain expertise.

---

# Mentor API

### Get All Mentors

```text
GET /api/mentors
```

### Search Mentors by Skill

Example:

```text
GET /api/mentors?skill=React
```

### Get Mentor by ID

```text
GET /api/mentors/:id
```

### Add Mentor Availability

```text
POST /api/mentors/slots
```

Authentication is required and the logged-in user must be a mentor.

Example request:

```json
{
  "startTime": "2026-08-10T14:00:00.000Z"
}
```

### Remove Mentor Availability

```text
DELETE /api/mentors/slots/:slotId
```

Booked slots cannot be removed.

---

# Booking API

### Create Booking

```text
POST /api/bookings
```

Only candidates can create bookings.

Example:

```json
{
  "mentorId": "MENTOR_ID",
  "slotId": "SLOT_ID"
}
```

A new booking starts with:

```text
pending
```

status.

---

### Mentor Bookings

```text
GET /api/bookings/mentor
```

This returns booking requests belonging to the logged-in mentor.

---

### Candidate Bookings

```text
GET /api/bookings/my
```

This returns bookings created by the logged-in candidate.

---

### Approve Booking

```text
PATCH /api/bookings/:bookingId/approve
```

Only the mentor who owns the booking can approve it.

After approval:

```text
pending
   ↓
approved
```

The selected mentor slot is also marked as booked.

---

### Decline Booking

```text
PATCH /api/bookings/:bookingId/decline
```

The booking becomes:

```text
declined
```

---

# Mentor Availability

Mentors can manage availability from the Mentor Dashboard.

A mentor selects a future date and time and clicks:

```text
Add Slot
```

The availability is stored inside the mentor's user record.

Each slot contains:

```text
startTime
isBooked
```

New slots start with:

```text
isBooked: false
```

When the booking is approved:

```text
isBooked: true
```

This prevents an approved slot from being shown as available to other candidates.

---

# Booking Status

Bookings support three statuses:

```text
pending
approved
declined
```

### Pending

The candidate requested the session and the mentor has not made a decision yet.

### Approved

The mentor accepted the booking.

### Declined

The mentor rejected the booking request.

---

# Email Confirmation

The project uses Nodemailer for email functionality.

During development, Nodemailer creates an Ethereal test email account.

This means real emails do not need to be sent while testing the project.

When a mentor approves a booking, confirmation emails are generated for:

- Candidate
- Mentor

The backend terminal prints Ethereal preview links.

For example:

```text
Candidate email preview: https://ethereal.email/message/...
Mentor email preview: https://ethereal.email/message/...
```

Opening the preview link allows the generated email to be viewed in the browser.

---

# Meeting Link

When a booking is approved, the current development version adds a demonstration meeting link.

The candidate can access the meeting link from the My Bookings page after approval.

A production version could replace this with integration such as:

- Google Meet
- Microsoft Teams
- Zoom

---

# Frontend Pages

## Home

The home page introduces the platform and displays featured mentors.

It also contains a simple explanation of the booking process.

---

## Login

Allows existing users to log in.

---

## Register

Allows a new user to register as either:

```text
Candidate
Mentor
```

---

## Mentors

Displays available mentors.

Candidates can search mentors by expertise.

---

## Mentor Details

Displays:

- Mentor name
- Email
- Bio
- Expertise
- Available time slots

Candidates can request an available slot from this page.

---

## Mentor Dashboard

The mentor dashboard contains two main areas.

### Manage Availability

Mentors can:

- Add a date and time
- View availability
- Remove an unbooked slot
- See whether a slot is available or booked

### Booking Requests

Mentors can:

- View candidate details
- View requested session time
- Check booking status
- Approve requests
- Decline requests
- View meeting links for approved bookings

---

## My Bookings

Candidates can see:

- Mentor
- Session date
- Session time
- Booking status
- Meeting link after approval

---

## Statistics

The application includes a Chart.js statistics page.

The current chart uses demonstration booking values.

A future version could retrieve live booking statistics directly from MongoDB.

---

# Security

The project includes several basic security measures.

### Password Hashing

Passwords are hashed using `bcryptjs` before being stored in MongoDB.

Plain-text passwords are not stored in the database.

### JWT Authentication

Protected routes require a valid JSON Web Token.

### Role Validation

Backend controllers check whether the logged-in user is a candidate or mentor before allowing role-specific operations.

### Protected Environment Variables

Database credentials and JWT secrets are stored in `.env`.

The `.env` file is excluded from Git using `.gitignore`.

---

# Current Limitations

This project is currently a development version.

Some areas that could be improved include:

- Real meeting provider integration
- Production email service
- Password reset
- Email verification
- Profile image upload
- More advanced mentor search
- Pagination
- Automated testing
- Real-time notifications
- Better form validation
- Production deployment configuration
- Live statistics from the database
- Admin dashboard

---

# Future Improvements

With more development time, I would add:

1. Google Meet, Microsoft Teams or Zoom integration.
2. Production email notifications.
3. Password reset and email verification.
4. Mentor profile pictures.
5. More detailed mentor profiles.
6. Mentor ratings and reviews.
7. Advanced mentor filtering.
8. Booking cancellation and rescheduling.
9. Real-time notifications.
10. Calendar integration.
11. Admin dashboard.
12. Live booking statistics.
13. Automated frontend and backend tests.
14. Improved accessibility.
15. Production deployment.

---

# Testing the Complete Flow

The application can be tested using the following process.

### Step 1 - Create Mentor

Register a new account and select:

```text
Mentor
```

### Step 2 - Add Availability

Login as the mentor.

Open the Mentor Dashboard and add a future date and time.

### Step 3 - Create Candidate

Register another account and select:

```text
Candidate
```

### Step 4 - Find Mentor

Open the mentor listing and select the mentor created earlier.

### Step 5 - Book Session

Select one of the available mentor slots.

The booking should appear with:

```text
pending
```

status.

### Step 6 - Approve Booking

Login again as the mentor.

Open the Mentor Dashboard.

Approve the candidate's request.

### Step 7 - Check Candidate Booking

Login as the candidate.

Open:

```text
My Bookings
```

The booking should now display:

```text
approved
```

and show the meeting link.

---

# Complete Application Flow

```text
Mentor registers
       ↓
Mentor logs in
       ↓
Mentor adds availability
       ↓
Candidate registers
       ↓
Candidate logs in
       ↓
Candidate browses mentors
       ↓
Candidate selects mentor
       ↓
Candidate chooses available slot
       ↓
Booking request created
       ↓
Status = Pending
       ↓
Mentor views request
       ↓
Mentor approves or declines
       ↓
If approved
       ↓
Slot becomes booked
       ↓
Meeting link added
       ↓
Confirmation emails generated
       ↓
Candidate views approved booking
```

---

# AI Assistance Declaration

AI tools were used as a supporting development resource during this project.

They were used to assist with areas such as:

- Code suggestions
- Debugging
- Code comments
- Project structure
- Documentation
- Troubleshooting development errors

The application was developed and tested incrementally, including authentication, MongoDB connectivity, mentor availability, candidate bookings, mentor approval and decline functionality, frontend/backend integration and development email testing.

The final implementation was reviewed and tested during development.

---

# Running the Complete Project

Two terminals are required during local development.

## Terminal 1 - Backend

```bash
cd server
npm install
npm run dev
```

If there is no development script:

```bash
node server.js
```

## Terminal 2 - Frontend

```bash
cd client
npm install
npm run dev
```

Open the local Vite address displayed in the frontend terminal.

---

# Project Status

The main mentor booking functionality is implemented and working in the development environment.

The project currently supports the complete core workflow:

**mentor availability → mentor discovery → booking request → mentor decision → booking confirmation**


## AI Assistance Declaration

I developed this project myself and understand the code and functionality I have submitted.

I used ChatGPT (OpenAI) a few times during development to help me work faster, mainly for suggestions, debugging and resolving some issues.

I did not use or copy any other public GitHub repository for this project.

I am able to explain the code, project structure and the implementation during the technical discussion.