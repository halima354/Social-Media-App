# Social Media App

## Overview

Social Media App is a simple yet full-featured platform for online communication. Users can create accounts, post content with images, comment, reply, like/unlike, and chat in real time using Socket.io. Notifications are supported through both sockets and email. Admins can monitor all activity, block/unblock accounts, and moderate posts.

The project follows a modular structure (Auth, User, Post/Comment, Admin, Deployment) for better maintainability.

## Key Features
 **User Authentication**
   *Traditional Login with username & password.
   *Email Verification with OTP for secure signup and password recovery.

 **User Management**
   *Create and update user profiles (bio, profile picture, etc.).
   *Change password, change email (with OTP validation).
   *Block/Unblock functionality for managing interactions.
   
**Posts & Media**
   *Create, read, update, and delete posts with text and images.
   *File uploads supported (Local, Disk, Cloudinary, or S3).

**Comments & Replies**
  *Parent-Child principle implemented for nested comments.
  *Self-referencing replies with virtual populate for threaded discussions.
  *Mentions (@username) trigger email notifications.

 **Likes**
  *Like/Unlike posts and comments.
  *Real-time updates with Socket.io.

 **Real-Time Chat**
   *One-to-one chat between users.
   *Messages delivered instantly using Socket.io.
  *Notifications triggered for new messages.

 **Notifications**
   *Real-time notifications for likes, comments, and mentions.
   *Delivered via Socket.io with email fallback.

 **Admin Dashboard**
   *Admin role can manage users, posts, and comments.
   *Admin can block/unblock accounts and moderate content.

 **Pagination support for large data (users, posts, activities).**

 ### Code Practices
    *Implemented Hooks to handle logic cleanly (auth, notifications, socket events).
    *Followed Parent-Child principle in comment & reply structures.
    *Used Promises & async/await for better asynchronous handling instead of callbacks.
### Security
  *CORS enabled to allow secure cross-origin requests.
  *Rate limiting to prevent abuse of APIs.
  *Helmet middleware to secure HTTP headers.
  *Access Token & Refresh Token strategy with revocation support.
  
## Technical Stack

**Backend**
  *Node.js with Express.js — server & REST APIs
  **Socket.io — real-time chat & notifications**
  *JWT (Access & Refresh tokens) — authentication
  *Nodemailer — email services (OTP, notifications)

**Database**
   MongoDB (Mongoose) — main database
 
**File Storage**
  *Multer — file uploads (local & disk storage)
  *Cloudinary — cloud image hosting
  
### Other
 *bcrypt — password hashing
 *dotenv — environment config

## Project Modules

### 1. Auth & User Model

* `/auth/signup` — create user, send OTP (hashed, with expiry)
* `/auth/confirm-otp`
* `/auth/login` — returns access & refresh tokens
* `/auth/refresh-token`
* `/auth/forgot-password` — send OTP to email
* `/auth/reset-password` — reset password, clear OTP afterwards
 
### 2. User CRUD & Uploads

* Update profile info
* Change password (verify old password)
* Change email (OTP validation)
* Get/share profile endpoint

### 3. Post - Comment - Reply
 ** Parent-child comments with self-referencing parentId
 ** Virtual populate for replies
 **  Mentions trigger email notifications
 
### 4. Socket.io (Chat & Notifications)
 ** chat — for users
 ** notifications — per-user notifications

**Events:**
*message:receive for chats
*notification:new for likes, comments, mentions
*Hooks trigger socket events after DB operations

### Run Locally
    Clone the repo

### Create .env file with required values

  *Run npm install
  
 * Run npm run dev

 *Test endpoints with Postman/Insomnia

### Deployment

Store images in Cloudinary or S3

Use PM2 for process management

Deploy on AWS (Elastic Beanstalk, ECS, or EC2)

Database on RDS (MySQL/Postgres)

Enable HTTPS and configure CORS

### Testing
  *Unit tests with Jest
  *Integration tests with Supertest
  *Critical tests:
  *Auth flows (signup, OTP, login, refresh)
  *Post/Comment CRUD
  *Like/Unlike
  *Socket events
 
