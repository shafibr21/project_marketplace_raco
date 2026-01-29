# Marketplace Workflow System

A full-stack implementation of a service marketplace connecting Buyers and Solvers, managed by Admins. Built with Next.js, Express, MongoDB, and Tailwind CSS.

## Features

- **Role-Based Access Control**: Strict separation between Admin, Buyer, and Solver roles.
- **Workflow Engine**:
  1. **Project Creation**: Buyers post projects.
  2. **Application**: Solvers apply/request projects.
  3. **Assignment**: Buyers assign a specific Solver.
  4. **Task Management**: Solvers break down projects into tasks.
  5. **Submission**: Solvers upload work (ZIP files) per task.
  6. **Review**: Buyers accept or reject submissions to complete tasks.
- **Dashboards**: Dedicated dashboards for each role to manage their specific workflow.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, Lucide Icons, Framer Motion (ready).
- **Backend**: Node.js, Express, MongoDB (Mongoose).
- **Auth**: JWT-based authentication with custom middleware.

## Setup Instructions

1.  **Backend Setup**:
    ```bash
    cd server
    npm install
    npm run dev
    ```
    Creates server on `http://localhost:5000`.

2.  **Frontend Setup**:
    ```bash
    cd client
    npm install
    npm run dev
    ```
    Opens application on `http://localhost:3000`.

3.  **Environment Variables**:
    Ensure `server/.env` contains `MONGO_URI` and `JWT_SECRET`.

## API Endpoints

- **Auth**: `/api/auth` (Register, Login, Me)
- **Users**: `/api/users` (List, Role Update)
- **Projects**: `/api/projects` (CRUD, Assign)
- **Requests**: `/api/requests` (Apply, List)
- **Tasks**: `/api/tasks` (Create, List, Update)
- **Submissions**: `/api/submissions` (Upload ZIP, Review)
- **Admin**: `/api/admin/stats` (System Statistics)

## Roles & Login

- **Admin**: Can view system stats and promote users.
- **Buyer**: Can create projects and review work.
- **Solver**: Can apply for projects and submit work.
*Note: New users default to 'Solver'. Use Admin account to promote users to 'Buyer'.*
