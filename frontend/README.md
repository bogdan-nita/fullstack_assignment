# Frontend Project

This project is a frontend implementation for a simple invoicing system. The application is built with React, Vite, TypeScript, and Tailwind CSS, and uses React Query for data fetching and Redux Toolkit for state management.

## Table of Contents

- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [State Management](#state-management)
- [Validation](#validation)
- [Additional Notes](#additional-notes)

## Installation

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

## Running the Application

To run the application locally:

```bash
npm run dev
```

This command will start the Vite development server. You can access the application in your browser at [http://localhost:5173](http://localhost:5173).

## Project Structure

The project structure is organized as follows:

```
src/
├── axios/
│   └── client.ts         # Axios instance configuration
├── components/
│   └── InvoiceDetails.tsx # Modal component for displaying invoice details
├── hooks/
│   ├── useInvoices.ts     # Custom hook for fetching invoices with React Query
│   └── useInvoiceDetails.ts # Custom hook for fetching a specific invoice's details
├── redux/
│   ├── auth.ts            # Redux slice for authentication state
│   └── store.ts           # Redux store configuration
├── routes/
│   ├── dashboard/
│   │   └── index.tsx      # Dashboard route component
│   └── invoices/
│       └── index.tsx      # Invoices route component
├── schemas/
│   ├── login.schema.ts    # Zod schema for login validation
│   └── invoice.schema.ts  # Zod schema for invoice validation
├── App.tsx                # Main App component
├── main.tsx               # Entry point of the application
└── index.css              # Global styles including Tailwind CSS
```

## API Integration

The frontend interacts with a backend API that provides the following endpoints:

- **GET /invoices**: Retrieves a list of invoices.
- **GET /invoices/:id**: Retrieves details of a specific invoice.
- **POST /auth/login**: Authenticates a user and returns a JWT token.

### Axios Client

The `axios/client.ts` file contains the Axios instance configured to communicate with the backend API.

## State Management

The application uses Redux Toolkit for managing the authentication state. The authentication state includes:

- **isAuthenticated**: Boolean indicating if the user is logged in.
- **user**: The current authenticated user's information.

## Validation

The application uses Zod for validating form inputs:

- **LoginSchema**: Validates login credentials on the dashboard page.
- **InvoiceSchema**: Validates the structure of invoice data received from the API.

## Additional Notes

- The application is built to be simple and extensible, following best practices for React development.
- Error handling is implemented for API requests, with redirects to the dashboard on authentication failure.
