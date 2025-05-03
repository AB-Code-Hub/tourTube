# TourTube Project Documentation

## Overview

TourTube is a Node.js application inspired by YouTube and Twitter, built with Express.js, MongoDB (Mongoose), and a modular utility structure for logging, error handling, and environment management.

---

## Project Structure

- **src/**
  - **app.js**: Sets up the Express app, middleware, CORS, logging.
  - **index.js**: Entry point; connects to MongoDB and starts the server.
  - **db/db.js**: Handles MongoDB connection logic.
  - **models/**: Mongoose models (user, video, comment, etc.).
  - **utils/**: Utility modules (logger, error/response handlers, env, etc.).
  - **routes/**: (Expected) API route definitions.
  - **controllers/**: (Expected) Business logic for routes.
  - **middlewares/**: (Expected) Custom Express middlewares.

---

## Key Utilities & Functions

- **logger.js**: Configures Winston for colored console and file logging.
- **env.js**: Loads environment variables using dotenv.
- **ApiError.js**: Custom error class for API error handling.
- **ApiResponse.js**: Standardized API response class.
- **asyncHandler.js**: Wrapper for async route handlers to catch errors.

---

## Making Changes & Updating Functions

### 1. Adding/Updating Models

- Define new Mongoose schemas in `src/models/`.
- Export the model for use in controllers/routes.

### 2. Adding/Updating Routes

- Define new routes in `src/routes/`.
- Use controllers for business logic.
- Use `asyncHandler` to wrap async route handlers.

### 3. Error Handling

- Throw `ApiError` in controllers for consistent error responses.
- Customize error messages and status codes as needed.

### 4. Logging

- Use the `logger` utility for logging info, warnings, and errors.
- Logs are output to both the console (with color) and `app.log` file.

### 5. Environment Variables

- Add/update variables in `.env`.
- Access them via `process.env` or the named exports in `env.js`.

---

## Best Practices

- Use `asyncHandler` for all async Express route handlers.
- Return `ApiResponse` for successful API responses.
- Throw `ApiError` for error cases.
- Keep sensitive data out of logs and source code.
- Use Prettier for code formatting (`npm run format`).

---

## Next Steps

- Implement missing models in `src/models/`.
- Add controllers and routes for API endpoints.
- Add middleware for authentication, validation, etc.
- Write tests for critical functionality.

---

## API Endpoints

### Health Check

- **URL**: `/api/v1/healtcheck`
- **Method**: `GET`
- **Purpose**: Verify the API service is up and running
- **Response Format**:
  ```json
  {
    "statusCode": 200,
    "data": "ok",
    "message": "Health check passed",
    "success": true
  }
  ```
- **Implementation**: Uses asyncHandler wrapper for error handling and returns standardized ApiResponse
- **Location**:
  - Route: `src/routes/healthCheck.route.js`
  - Controller: `src/controllers/healthCheck.controller.js`

---

This documentation should guide you and contributors in understanding, updating, and extending the codebase efficiently. For detailed changes, always refer to commit history and code comments.
