# Backend Project

This backend project is built using Node.js with NestJS in TypeScript. It provides a simple API for managing invoices with basic authentication.

## Table of Contents

1. [Technologies Used](#technologies-used)
2. [Project Structure](#project-structure)
3. [API Endpoints](#api-endpoints)
4. [Database Schema](#database-schema)
5. [Seeding the Database](#seeding-the-database)
6. [Running the Application](#running-the-application)
7. [Testing the Application](#testing-the-application)
8. [Docker Support](#docker-support)
9. [Additional Notes](#additional-notes)

## Technologies Used

- **Node.js**
- **NestJS**
- **TypeScript**
- **PostgreSQL** - Database
- **Prisma ORM** - Database access and management
- **Class-validator** - DTO validation
- **Jest** - Testing framework

## Project Structure

```
backend/
│
├── src/
│   ├── auth/
│   │   ├── controllers/          # Contains controllers related to authentication (e.g., AuthController)
│   │   ├── dtos/                 # Data Transfer Objects (DTOs) for validating input data
│   │   ├── guards/               # Guards for protecting routes (e.g., JwtAuthGuard)
│   │   ├── services/             # Business logic related to authentication (e.g., AuthService)
│   │   └── interfaces/           # Interfaces used across the auth module (e.g., AuthenticatedRequest)
│   │
│   ├── invoice/
│   │   ├── controllers/          # Controllers for handling invoice-related requests (e.g., InvoiceController)
│   │   ├── dtos/                 # DTOs for invoice-related data
│   │   ├── services/             # Business logic related to invoices (e.g., InvoiceService)
│   │   └── interfaces/           # Interfaces for invoice module
│   │
│   ├── prisma/
│   │   ├── services/             # Prisma service for database access
│   │
│   ├── main.ts                   # Entry point of the application
│   ├── app.module.ts             # Root module of the application
│   └── ...                       # Other configuration files and utilities
│
├── prisma/
│   ├── schema.prisma             # Prisma schema for defining database models
│   └── seed.ts                   # Script for seeding the database
│
├── test/                         # Contains test files
├── docker-compose.yml            # Docker configuration for database and services
├── package.json                  # Project dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
└── .env                          # Environment variables

```

## API Endpoints

### Authentication

- **POST /auth/login**: Authenticate a user and return an authentication token.

### Invoices

- **GET /invoices**: Retrieve all invoices. Supports pagination via query parameters `page` and `limit`.
- **GET /invoices/:id**: Retrieve details of a specific invoice.
- **GET /invoices/total**: Retrieve the aggregated total amount of unpaid invoices due by due date.

## Database Schema

- **User**

  - `id`: Integer, Primary Key
  - `email`: String, Unique
  - `password`: String
  - `name`: String

- **Invoice**
  - `id`: Integer, Primary Key
  - `vendor_name`: String
  - `amount`: Float
  - `due_date`: DateTime
  - `description`: String
  - `user_id`: Integer, Foreign Key (references `User`)
  - `paid`: Boolean

## Running the Application

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the root directory with the following content:

```
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nest
JWT_SECRET=e73136ec1fcee4331745923d7ecf5dd6acfc5be9dabc302e7b45c6a38b0f4f3d
```

3. Start the PostgreSQL database (if not already running). You can use Docker for this:

```bash
docker-compose up -d
```

4. Migrate the database schema:

```bash
npx prisma migrate dev
```

5. Seed the database with initial data:

```bash
npx prisma db seed
```

Running the seed script generates a file named `credentials.json` located in the same directory as the `seed.ts` script. This file contains the email addresses and unhashed passwords for the seeded users, which can be used for easy testing.

6. Start the NestJS application:

```bash
npm run start:dev
```

The backend will be running at [http://localhost:3000](http://localhost:3000).

## Testing the Application

To run tests, execute the following command:

```bash
npm run test
```

This will run all the test cases defined for the backend services.

## Docker Support

A `docker-compose.yml` file is provided to simplify the setup of the PostgreSQL database. To start the database with Docker, run:

```bash
docker-compose up -d
```

## Additional Notes

- Make sure to adjust the database connection details in the `.env` file as per your local setup.
- Ensure that the JWT secret in the `.env` file is secure and kept confidential.
- The API includes error-handling mechanisms to manage common issues like authentication failures, invalid inputs, and resource not found errors.
