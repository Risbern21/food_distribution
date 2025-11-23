# Leftover Food Distribution Platform  
*A DBMS Mini Project built with Go Fiber (Backend) + React TypeScript (Frontend)*

## Overview
The **Leftover Food Distribution Website** is a platform designed to reduce food wastage by connecting **donors** (individuals, restaurants, organizations) with **recipients** who need food. Donors can list surplus food, and recipients can browse, request, and receive food efficiently.

This project includes:
- **Backend:** Go Fiber
- **Frontend:** React + TypeScript + TailwindCSS
- **Database:** PostgreSQL

---
## Getting Started

## rename the ".env.example" file to ".env" in the frontend folder and it should contain:
VITE_API_URL=http://localhost:42069/api/v1/

---

## rename the ".env.example" file to ".env" in the backend folder and it should contain:
DSN=<your_postgres_dsn>
JWT_SECRET=<your_jwt_secret>

---

### Setup

```bash
git clone https://github.com/Risbern21/food_distribution.git
#setup the frontend
cd frontend
npm i
npm run dev

cd ..

#setup the backend
cd backend
go mod tidy
go run cmd/main.go
```
---

## Features

### User Authentication & Roles
- JWT-based authentication  
- Roles: **Donor**, **Recipient**, **Admin**

### Food Donation Module
- Create + manage food donations  
- Add quantity, description, expiry, pickup time  
- Status updates (Available, Picked, Expired)

### Search & Browse
- Real-time search and category filtering  
- Visibility of food based on expiry time

### Distribution Management
- Recipients can request donations  
- Donors/Admin can accept or reject  
- Track pickup and delivery status  
- Confirmation logs

### Feedback System
- Ratings after successful delivery  
- Comments for transparency and trust  

---

## Tech Stack

### **Frontend**
- React (TypeScript)
- TailwindCSS (no PostCSS)
- Vite

### **Backend**
- Go (Golang)
- Fiber Framework
- RESTful APIs
- JWT Authentication

### **Database**
- PostgreSQL

### **Optional**
- AWS support for deployment
- Docker support for deployment

---

## Database Schema

### **Users Table**
| Field | Description |
|-------|-------------|
| user_id | Primary key |
| username | User name |
| email | Unique email |
| hashed_password | Encrypted password |
| phone | Contact no. |
| address | User address |
| user_type | donor / recipient / admin |

### **Donations Table**
| donation_id | donor_id | title | description | quantity | units | pickup_time | expiry_time | status |

### **Distributions Table**
| distribution_id | donation_id | recipient_id | delivery_status | delivered_at | pickup_confirmed |

### **Feedbacks Table**
| feedback_id | distribution_id | user_id | rating | comments | created_at |

---

