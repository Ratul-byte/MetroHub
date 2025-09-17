# MetroHub

Hello everyone! This is a project from my university course, System Analysis and Design. MetroHub is a comprehensive web application designed to streamline the urban transportation experience for metro rail users in Dhaka. It provides a seamless interface for users to manage their travel, from booking tickets to navigating the metro network. The application is built with a modern MERN stack (MongoDB, Express.js, React, Node.js) and includes a feature-rich admin dashboard for managing the system.

**Here is the deployed <a href="https://metro-hub.vercel.app/">version</a> of our project and a demo <a href="https://drive.google.com/file/d/1SpC8SIVl-Yui86epEeEDOsM78chIXIu6/view?usp=sharing">user manual</a> document that you can follow.** 
**Register with an actual mail to test notification feature. Password should be 8 characters long including one digit and one special characters.**

## Features

### For Users

- **User Authentication:** Secure user registration and login with email/password or phone number/password. Includes password reset functionality with a security question.
- **Ticket Booking:**
    - Search for available train schedules between any two stations.
    - Book tickets and pay through a secure payment gateway (SSLCommerz).
    - **Rapid Pass Integration:** Users with a Rapid Pass can pay for tickets directly from their pass balance.
- **QR Code Integration:**
    - After successful payment, users receive a unique QR code for their ticket.
    - Users can scan the QR code to start and end their journey.
    - The system tracks journey start and end times and applies fines for overstaying.
- **User Profile:**
    - View and update user profile information, including name, email, phone number, and preferred routes.
    - **Rapid Pass Management:** Users can link their Rapid Pass to their account and deposit money into their pass balance.
- **Booking History:** View a history of all past ticket bookings.
- **Live Metro Map:**
    - View an interactive map of the metro network.
    - Search for specific stations and get directions.
    - Find nearby metro stations based on the user's current location.
- **Schedule Search:** Search for train schedules based on station and time.
- **Internationalization:** The user interface is available in both English and Bengali.

### For Admins

- **Admin Dashboard:** A comprehensive dashboard that provides an overview of the system, including:
    - Total users, active trains, metro stations, and active fines.
    - Quick actions for managing users, schedules, and fines.
    - Recent user registrations.
- **User Management:**
    - View a list of all registered users.
    - Delete users.
    - Change a user's role (e.g., from a normal user to a Rapid Pass user).
- **Station Management:**
    - Add, view, edit, and delete metro stations.
    - Set the name, serial number, and geographical coordinates for each station.
- **Schedule Management:**
    - Add, view, edit, and delete train schedules.
    - Define the source and destination stations, train name, departure and arrival times, frequency, and fare for each schedule.
- **Fine Management:**
    - View a list of all active fines.
    - See the total amount of outstanding fines.
    - View recent fines applied to users.
- **Ticket Management:** View a list of all tickets booked through the system.

## Tech Stack

- **Frontend:**
    - React
    - Vite
    - Tailwind CSS
    - Framer Motion (for animations)
    - i18next (for internationalization)
    - Axios (for API requests)
    - Leaflet (for the interactive map)

- **Backend:**
    - Node.js
    - Express.js
    - MongoDB (with Mongoose)
    - JSON Web Tokens (JWT) for authentication
    - bcryptjs (for password hashing)
    - SSLCommerz (for payment processing)
    - qrcode (for generating QR codes)
    - Nodemailer (for sending emails)
 
 - **Deployment:**
    - Vercel (Frontend)
    - Render (Backend)
