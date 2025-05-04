# TourTube Project Documentation

## Overview

TourTube is a feature-rich social media platform combining elements of YouTube and Twitter, built with Node.js, Express.js, and MongoDB. The platform supports video sharing, user interactions, comments, likes, and subscription features.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (with Mongoose)
- **Authentication**: JWT (jsonwebtoken)
- **Password Security**: bcrypt
- **Logging**: Winston, Morgan
- **API Documentation**: Available in `/docs/api.md`

## Project Structure

```
src/
├── app.js           # Express app setup & middleware config
├── index.js         # Application entry point
├── controllers/     # Route controllers
├── db/             # Database connection setup
├── docs/           # API documentation
├── middlewares/    # Custom Express middlewares
├── models/         # Mongoose models
├── routes/         # API routes
└── utils/          # Utility functions and classes
```

## Core Features

### User Management

- User registration and authentication
- JWT-based session management with refresh tokens
- Profile management with avatar and cover image
- Watch history tracking

### Video Features

- Video upload and management
- Video metadata (title, description, duration)
- View count tracking
- Publishing control

### Social Features

- Comments on videos
- Like system (videos, comments, tweets)
- User subscriptions
- Playlist creation and management
- Tweet functionality

## Data Models

### User Model

- Username (unique, indexed)
- Email (unique, indexed)
- Full Name
- Avatar and Cover Image
- Watch History
- Password (hashed)
- Refresh Token

### Video Model

- Video File URL
- Thumbnail URL
- Title and Description
- View Count
- Duration
- Publishing Status
- Owner Reference

### Other Models

- Comments (with mongoose-aggregate-paginate)
- Likes (polymorphic - videos/comments/tweets)
- Playlists
- Subscriptions
- Tweets

## Logging System

The application uses a comprehensive logging system with:

- **Winston**: For structured logging with the following features:
  - Console output with colorization
  - File logging to `app.log`
  - JSON format with timestamps
  - Configurable log levels
- **Morgan**: HTTP request logging middleware integrated with Winston
  - Custom format: `:method :url :status :response-time ms`
  - Logs stored in structured JSON format

## Middleware Configuration

- CORS enabled with configurable origin
- JSON body parsing (limit: 24kb)
- URL-encoded body parsing (limit: 24kb)
- Static file serving from 'public' directory
- Morgan request logging
- Express security best practices

## Authentication System

- JWT-based authentication with:
  - Access tokens (expires in 3 hours)
  - Refresh tokens (expires in 3 days)
  - Secure token storage
  - Password hashing using bcrypt
  - Automatic password hashing on user creation/update

## File Upload Architecture

### Temporary Storage

- Uses Multer middleware for multipart/form-data handling
- Files stored in `./public/temp` directory
- Original filename preservation
- Configurable storage options

### Cloud Storage (Cloudinary)

- Automatic upload to Cloudinary CDN
- Supported file types:
  - Images (avatar, thumbnails, cover images)
  - Videos (content uploads)
- Resource type auto-detection
- Automatic cleanup of temporary files
- Secure URL generation

### Upload Flow

1. Client uploads file through multipart/form-data
2. Multer intercepts and stores in temp directory
3. File processed and uploaded to Cloudinary
4. Temporary file automatically cleaned up
5. Cloudinary URL stored in database

## Security Measures

### Password Security

- Bcrypt hashing with salt rounds of 10
- Automatic password hashing on user creation/update
- Secure password comparison methods

### JWT Implementation

- Access Tokens
  - Contains: user ID, email, username
  - Expiration: 3 hours
  - Used for API authentication
- Refresh Tokens
  - Contains: user ID only
  - Expiration: 3 days
  - Stored in user document
  - Used for token renewal

### Request Security

- CORS protection with configurable origin
- Request size limits (24kb) for JSON/URL-encoded data
- Secure cookie handling
- Protected routes using JWT verification

## Database Architecture

### MongoDB Connection

- Mongoose ODM for MongoDB interaction
- Automatic connection retry
- Connection status logging
- Environment-based configuration

### Model Features

- Mongoose aggregate pagination support
- Timestamp tracking on all models
- Indexed fields for optimized queries
- Referential integrity using MongoDB references

## Environment Configuration

Required environment variables:

- PORT (default: 8000)
- CORS_ORIGIN (default: \*)
- DB_NAME
- DB_URL (MongoDB connection string)
- ACCESS_TOKEN_SECRET
- ACCESS_TOKEN_EXPIRE (default: 3h)
- REFRESH_TOKEN_SECRET
- REFRESH_TOKEN_EXPIRE (default: 3d)

## API Response Format

All API responses follow a standard format:

```json
{
  "statusCode": number,
  "data": any,
  "message": string,
  "success": boolean
}
```

## Error Handling

### Centralized Error System

- Custom ApiError class for consistent error format
- Async handler wrapper for promise rejection catching
- Standard error response structure:
  ```json
  {
    "statusCode": number,
    "data": null,
    "message": string,
    "success": false,
    "errors": string[]
  }
  ```

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in `.env`
4. Run development server: `npm run dev`
5. Access API at `http://localhost:8000/api/v1/`

## Available Scripts

- `npm start` - Run production server
- `npm run dev` - Run development server with nodemon
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Best Practices

- Use asyncHandler for all async route handlers
- Return standardized ApiResponse objects
- Throw ApiError for error cases
- Follow existing patterns for new features
- Use Morgan and Winston for logging
- Keep sensitive data in environment variables
