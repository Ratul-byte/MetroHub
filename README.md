# MetroHub

Tech Stack: MERN
 
● Language: JavaScript 
● Frontend Framework: React.js 
● Backend Framework: Express.js with Node.js 
● Styling: TailwindCSS
● Database: MongoDB 
● ODM: Mongoose
● Deployment: Vercel (frontend) + Render (API backend) 


Functional requirements:
 
Module 1: User Account & Profile Management
[Member-1] Users can register and log in using email/mobile phone and password.
[Member-3] Users can update their profile including name, phone number, emails, passwords and preferred routes. 
[Member-2] Admins can manage user roles and permissions (e.g., regular user, rapid pass user, admin).
[Member-3] Users can set themselves as rapid pass users and can also deposit money in the pass.
 
Module 2: Metro Schedule & Route Finder
[Member-2] Users can search for metro schedules by metro station, date, and time, and view real-time train updates, including delays, service interruptions, and track changes.
[Member-2] Google Maps API integration helps users visualize nearby metro stations and walking directions.
[Member-3] Admins can create, update, or delete metro train schedules, station lists, route and station info.
[Member-1] Users can choose a destination (Google Maps API) and get optimized route suggestions regarding users location and destination. Estimated travel time will also be included.

Module 3: Ticket Booking & Notifications
[Member-1] Users can book metro tickets with online payment methods, download slip for the ticket, and view booking history from their dashboard
(SSLCOMMERZ)
[Member-3] For metro pass users, ticket costs are automatically deducted from their balance upon booking.
[Member-1] Users receive mobile SMS confirmation and reminder for booked rides using Google Cloud SMS API
[Member-2] Users receive fines when they are in station after certain period of time, added to the profile and a notification will be sent.

