# Elearning
### A Scalable, Secure, and Performance-Optimized LMS

## Overview

**Elearning** is an online learning system that allows users to explore and access courses across various categories. It’s designed for flexibility; learners can watch lessons on their schedule, froam any device, with a clean and responsive interface.

The platform includes features like **course management**, **user management**, **OTP-based authentication**, and **DRM-protected video streaming**. Both users and admins have dedicated dashboards to manage their roles, track progress, and handle tasks their easily.

This project focuses on building a reliable system with a clear structure, strong security practices, and a smooth user experience. Everything is designed to be fast, stable, and easy to maintain.

---

## Key Features

### Course Management
- Create, edit, and manage courses from the admin panel
- Organize lessons into sections
- Add course tags, categories, and demo URLs
- Upload DRM-protected video lessons using VideoCipher
- Add downloadable resources and course FAQs

### Authentication & User Roles
- Secure OTP-based sign-up and login
- Social login support
- Role-based access (Admin / Student)
- Protected routes and dynamic UI rendering

### Real-Time Admin Dashboard
- View real-time analytics for users, orders, and courses
- Notifications for new activity (orders, reviews, questions)
- Fully responsive design, works well on mobile

### Q&A and Reviews
- Students can submit questions per lesson
- Admin can reply; replies are verified and shown distinctly
- Users can submit course reviews
- Admin can reply to reviews

### Orders & Invoicing
- Stripe payment integration with Stripe Elements
- Support for multiple gateways (Cash App, Google Pay, etc.)
- Instant admin notifications on new orders

### Dynamic Site Content
- Admin can update homepage banner and text
- Admin can manage FAQ and policy content
- Dynamic categories and course filtering

### Video Security
- Videos are DRM-protected, can’t be recorded, downloaded, or screenshot
- Only enrolled users can access lesson content
- Video content loads securely based on user permissions

---

## Architecture

### System Architecture Diagram

![System Architecture Diagram](https://res.cloudinary.com/dmniws8v3/image/upload/v1751889974/Screenshot_2025-07-07_160601_t6anoo.png)

### Frontend

Users access the platform through their browser. The **Next.js** frontend handles login/signup with JWT tokens and OTP verification. It makes REST API calls to get data and uses Socket.IO for real-time notifications.

### Backend

The **Node.js API server** processes all requests. It has rate limiting to prevent spam and handles authentication, course management, and email sending. Socket.IO pushes live updates to connected users.

### Database

**MongoDB Atlas** stores everything - user profiles, courses, orders, questions, and reviews. The backend reads and writes data here for all operations.

### External Services

**VdoCipher** handles video streaming with DRM protection. Only enrolled students can watch course videos.
**Cloudinary** stores and serves media files like profile pictures and course thumbnails.
### How It Works

1. User interacts with frontend
2. Frontend calls backend API
3. Backend processes request and updates MongoDB
4. Backend sends response back
4. Videos stream from VdoCipher
5. Images load from Cloudinary

Simple flow: Browser → Next.js → API Server → MongoDB → External Services.

---

## Tech Stack

**Frontend**  
- Next.js 13 (App Router, SSR)  
- Tailwind CSS for styling  
- RTK Query for data fetching and caching  
- NextAuth for social login  
- Formik + Yup for form handling  
- Material UI + Lucide for UI components  
- Socket.IO (client) for real-time updates  
- Stripe integration (React SDK)  
- Axios, Cookies, LocalStorage for API and state handling

**Backend**  
- Node.js + Express.js  
- TypeScript for type safety  
- MongoDB + Mongoose  
- Redis (ioredis) for caching and session control  
- Socket.IO (server) for real-time communication  
- Cloudinary for media upload  
- JWT + OTP via Nodemailer for authentication  
- Express Rate Limiter, Cron Jobs, Morgan logs  
- Stripe SDK for payments

**Deployment**  
- Frontend deployed on **Vercel**  
- Backend + Socket.IO server on **Render**  
- Media handled via **Cloudinary**

---

## 🗄️ Database Design

### Entity Relationship Diagram

![Entity Relationship Diagram](https://res.cloudinary.com/dmniws8v3/image/upload/v1751900976/diagram-export-7-7-2025-7_57_15-PM_jlaihh.png)

This ERD maps out the LMS structure. Everything connects around these collections: `users`, `courses`, `orders`, `notifications`, and `layouts`. Other collections support and extend their roles.

### Entities

| collection     | Purpose                                                                 |
|---------------|-------------------------------------------------------------------------|
| users         | All users (students, admins). Handles login, roles, and profiles.       |
| courses       | Main course info, video content, reviews, and orders.                   |
| orders        | Tracks course purchases made by users. Used for payments and history.   |
| notifications | Stores alerts per user (order updates, comment replies, etc.).          |
| layouts       | Admin-defined frontend sections (hero, FAQ, categories, banners).       |

### Relationship Tables

| collections      | Connected To        | Role                                                        |
|------------------|---------------------|-------------------------------------------------------------|
| courseData        | courses             | Stores all lessons (video + metadata) under a course.       |
| benefits          | courses             | Lists learning outcomes for a course.                       |
| prerequisites     | courses             | Lists required knowledge before taking the course.          |
| reviews           | users, courses      | Course ratings by users.                                    |
| comments          | users, courseData   | Q&A system for video content or reviews.                    |
| links             | courseData          | Additional learning resources (external).                   |
| user_courses      | users, courses      | Tracks who enrolled, progress, and completion status.       |
| faqItems          | layouts             | FAQ content for frontend.                                   |
| categories        | layouts             | Course categorization, shown on UI.                         |
| bannerImages      | layouts             | Home banners stored and served dynamically.                 |

### How Everything Flows

- A `user` enrolls in a `course` → tracked in `user_courses`.
- That user can make an `order` → creates a purchase record.
- After purchase, `notifications` are sent to the user.
- The `course` shows `courseData` (videos), each video can have `comments` and `links`.
- `reviews` are tied to both `users` and `courses` for feedback.
- The home layout is managed through `layouts`, connected to `categories`, `faqItems`, and `bannerImages`.

---

## User Workflows & System Flow

### Flowchart Diagram

![Flowchart Diagram](https://res.cloudinary.com/dmniws8v3/image/upload/v1751917324/Flowchart_3_tlubmp.png)

**Student Flow:**  
Sign Up → Verify Email (OTP) → Login → Browse Courses → Enroll in Course → Watch Lessons → Ask Questions → Leave Review → Track Progress

**Admin Flow:**  
Login → Create Course → Add Lessons/FAQs → Manage Users → View Orders → Answer Comments → Track Sales → Update Layout

---

## Best Practices

**Security**
- Secure password hashing with bcrypt  
- OTP-based auth using nodemailer + expiry logic  
- JWT + HTTP-only cookies for session security  
- Rate Limiting with express-rate-limit

**Access Control**
- Role-based access (admin, student)  

**API & State Management**
- RESTful API structure with consistent status codes  
- Real-time updates handled via Socket.IO  
- State managed with RTK Query + Redux Toolkit  
- Postman for testing, GitHub for version control  

**Performance & Reliability**
- Redis Caching (with ioredis)  
- Cron Jobs (via node-cron)  

**Deployment**
- Deployment rollback-ready

---

## Conclusion

This LMS wasn’t just about building features it was about solving real problems like secure access, smooth content delivery, and reliable course management. I focused on writing clean backend logic, handling edge cases, and keeping the frontend experience fast and responsive. It helped me understand how to architect a full-stack system, not just build one.

---
