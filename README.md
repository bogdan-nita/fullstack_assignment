# Full Stack Project Overview

This repository contains two main projects:

- **Backend**: A NestJS-based Node.js application for managing invoices.
- **Frontend**: A React-based application using Vite for managing the user interface.

For more details on each project, please refer to their respective README.md files located in the `backend` and `frontend` directories.

## Table of Contents

1. [Technologies Used](#technologies-used)
2. [Project Structure](#project-structure)
3. [Getting Started](#getting-started)
4. [Running the Applications](#running-the-applications)
5. [Docker Support](#docker-support)
6. [Additional Notes](#additional-notes)

## Technologies Used

- **Node.js**
- **NestJS** (Backend)
- **TypeScript**
- **PostgreSQL** - Database
- **Prisma ORM** - Database access and management
- **React** (Frontend)
- **Vite** - Fast development build tool for React
- **Jest** - Testing framework for both frontend and backend

## Project Structure

```
root/
│
├── backend/                        # Backend project folder
│   ├── src/                        # Source code for the backend
│   ├── prisma/                     # Prisma schema and database management
│   ├── docker-compose.yml          # Docker configuration for the backend services
│   └── README.md                   # Backend-specific README
│
├── frontend/                       # Frontend project folder
│   ├── src/                        # Source code for the frontend
│   ├── public/                     # Static files
│   ├── vite.config.ts              # Vite configuration file
│   ├── README.md                   # Frontend-specific README
│   └── package.json                # Frontend dependencies and scripts
│
└── README.md                       # This README file for the entire project
```

## Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **Docker** (optional, for containerized setup)

### Backend Setup

Navigate to the `backend` directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Configure environment variables by creating a `.env` file in the `backend` directory with the following content:

```
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nest
JWT_SECRET=e73136ec1fcee4331745923d7ecf5dd6acfc5be9dabc302e7b45c6a38b0f4f3d
```

Run the PostgreSQL database (you can use Docker):

```bash
docker-compose up -d
```

Apply migrations and seed the database:

```bash
npx prisma migrate dev
npx prisma db seed
```

**Note**: Running the seed script will generate a `credentials.json` file near the `seed.ts` script, which contains email addresses and unhashed passwords. This file can be used for testing purposes.

### Frontend Setup

Navigate to the `frontend` directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

## Running the Applications

### Running the Backend

In the `backend` directory, start the server:

```bash
npm run start:dev
```

The backend will be accessible at [http://localhost:3000](http://localhost:3000).

### Running the Frontend

In the `frontend` directory, start the development server:

```bash
npm run dev
```

The frontend will be accessible at [http://localhost:5173](http://localhost:5173).

## Additional Notes

- Ensure that the database connection details in the `.env` file match your setup.
- For more detailed instructions, refer to the `README.md` files within the `backend` and `frontend` directories.
