# Food Ordering Web Application

## Overview
A full-stack food ordering web application that allows users to browse items, add them to a cart, and place orders securely using authentication. The application demonstrates end-to-end integration between frontend and backend systems.

---

## Features

### Authentication
- User registration and login functionality
- JWT-based authentication
- Secure storage of authentication token
- Conditional UI rendering based on login state

### User Experience
- Dynamic greeting based on logged-in user
- Modal-based Sign In and Sign Up forms
- Inline feedback messages (no alert popups)
- Responsive design using Bootstrap

### Cart System
- Add items to cart with quantity management
- Persistent cart using localStorage
- Dynamic cart popup interface
- Remove items from cart
- Real-time total price calculation

### Order Management
- Place orders using authenticated requests
- Protected backend routes using middleware
- Cart data sent to backend for order creation
- Validation for login and empty cart before ordering

---

## Tech Stack

### Frontend
- HTML5
- CSS3
- Bootstrap
- JavaScript (Vanilla)

### Backend
- Node.js
- Express.js

### Database
- MongoDB

### Authentication
- JSON Web Tokens (JWT)

---

## Project Structure
project-root/
│
├── frontend/
│ ├── index.html
│ ├── css/
│ ├── js/
│
├── backend/
│ ├── controllers/
│ ├── routes/
│ ├── models/
│ ├── middleware/
│ └── server.js


---

## How to Run the Project

### Backend Setup

```bash
cd food-ordering-backend
npm install
npm run dev

