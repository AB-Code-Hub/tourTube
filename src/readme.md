# TourTube Project Documentation

## Overview

TourTube is a feature-rich social media platform combining elements of YouTube and Twitter, built with Node.js, Express.js, and MongoDB. The platform supports video sharing, user interactions, comments, likes, and subscription features.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Security**: bcrypt
- **Validation**: Joi
- **File Handling**: Multer, Cloudinary
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
├── utils/          # Utility functions and classes
└── validation/     # Request validation schemas
```

## Core Features

### User Management

- User registration with validation
- JWT-based authentication with refresh tokens
- Profile management with avatar and cover image upload
- Watch history tracking
- Cloudinary integration for media storage

### Video Features

- Video upload with metadata
- Video publishing control
- View count tracking
- Duration tracking
- Thumbnail management

### Social Features

- Comments on videos with pagination
- Polymorphic like system (videos/comments/tweets)
- User subscriptions
- Playlist creation and management
- Tweet functionality

## Data Models

### User Model

- Username (unique, indexed)
- Email (unique, indexed)
- Full Name
- Avatar (required) and Cover Image
- Watch History
- Securely hashed password
- Refresh Token

### Video Model

- Video File URL (Cloudinary)
- Thumbnail URL (Cloudinary)
- Title and Description
- View Count
- Duration
- Publishing Status
- Owner Reference

### Supporting Models

- Comments (with mongoose-aggregate-paginate-v2)
- Likes (polymorphic references)
- Playlists
- Subscriptions
- Tweets

## Security Features

### Request Validation

- Joi schema validation for all requests
- Custom validation middleware
- Input sanitization

### Authentication Security

- JWT with access and refresh tokens
- Token expiration (3h for access, 3d for refresh)
- Secure cookie handling
- CORS protection

### Password Security

- Bcrypt hashing with pre-save hooks
- Automatic password hashing
- Secure password comparison

### File Upload Security

- File type validation
- Size limits
- Temporary storage cleanup
- Secure Cloudinary integration

## Error Handling

### Centralized System

- Custom ApiError class
- Async handler wrapper
- Development/Production stack traces
- Standardized error responses

### Response Format

```json
{
  "statusCode": number,
  "data": any,
  "message": string,
  "success": boolean,
  "errors": string[] // For error responses
}
```

## Logging System

### Winston Configuration

- Console output with colors
- File logging to app.log
- JSON format with timestamps
- Multiple transport support

### Morgan Integration

- HTTP request logging
- Custom format: `method url status response-time`
- Integration with Winston logger

## Environment Configuration

Required variables in `.env`:

- PORT (default: 8000)
- CORS_ORIGIN
- DB_NAME
- DB_URL
- ACCESS_TOKEN_SECRET
- ACCESS_TOKEN_EXPIRE
- REFRESH_TOKEN_SECRET
- REFRESH_TOKEN_EXPIRE
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET
- NODE_ENV

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env` file with required variables
4. Run development server: `npm run dev`
5. Access API at `http://localhost:8000/api/v1/`

## Available Scripts

- `npm start` - Run production server
- `npm run dev` - Run development server with nodemon
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Best Practices

- Use asyncHandler for async operations
- Follow existing patterns for new features
- Validate all inputs with Joi
- Use Morgan and Winston for logging
- Keep sensitive data in environment variables
- Clean up temporary files
- Handle errors consistently
