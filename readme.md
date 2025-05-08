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
├── controllers/     # Route controllers (user, health)
├── db/             # Database connection setup
├── docs/           # API documentation
├── middlewares/    # Custom Express middlewares
├── models/         # Mongoose models (user, video, etc.)
├── routes/         # API routes
├── utils/          # Utility functions and classes
└── validation/     # Request validation schemas
```

## Core Features

### User Management

- User registration with email/username validation
- Secure JWT-based authentication system
  - Access tokens (3h expiry)
  - Refresh tokens (3d expiry)
  - Secure HTTP-only cookies
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

- Username (unique, indexed, lowercase)
- Email (unique, indexed, lowercase)
- Full Name (indexed)
- Avatar (required) and Cover Image
- Watch History with Video references
- Securely hashed password
- Refresh Token management

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

### Authentication & Authorization

- JWT-based token system
  - Short-lived access tokens (3h)
  - Long-lived refresh tokens (3d)
  - Secure cookie implementation
  - HTTP-only cookie flags
  - Production-ready security configurations

### Request Validation

- Joi schema validation for all requests
- Custom validation middleware
- Input sanitization
- File type validation

### Password Security

- Bcrypt hashing with pre-save hooks
- Automatic password hashing
- Secure password comparison
- No plain-text password storage

### File Upload Security

- Multer for temporary storage
- File type validation
- Size limits enforcement
- Automatic temporary file cleanup
- Secure Cloudinary integration
  - Automatic format optimization
  - Quality adjustment
  - Resolution limits (1280x720)
  - Secure URL generation

## Error Handling

### Centralized System

- Custom ApiError class for consistent errors
- Async handler wrapper for all controllers
- Environment-based stack traces
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

- Console output with color coding
- JSON format logging
- Timestamp integration
- File-based logging (app.log)
- Multiple transport support

### Morgan Integration

- HTTP request logging
- Custom format: `method url status response-time ms`
- Winston logger integration
- Request tracking

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

## API Routes

### Health Check

- `GET /api/v1/healthcheck` - API health verification

### User Management

- `POST /api/v1/users/register` - Register new user
- `POST /api/v1/users/login` - User login
- `POST /api/v1/users/logout` - User logout (protected)
- `POST /api/v1/users/refresh-token` - Refresh access token
- `GET /api/v1/users/profile` - Get current user profile (protected)
- `POST /api/v1/users/change-password` - Change user password (protected)
- `POST /api/v1/users/update-details` - Update account details (protected)
- `POST /api/v1/users/update-avatar` - Update user avatar (protected)
- `POST /api/v1/users/update-cover-image` - Update cover image (protected)
- `GET /api/v1/users/channel/:username` - Get channel profile with subscription info (protected)

For detailed API documentation including request/response formats, see `/docs/api.md`

## Additional Features

### Subscription Management

- User subscription system with Mongoose
- Real-time subscriber count tracking
- Bi-directional subscription relationships
- Channel subscription status verification
- Subscriber and subscription lists

### Channel Management

- View channel profiles with subscription stats
- Track subscriber counts
- Check subscription status
- View channels subscribed to

### Profile Management

- Update account details (username, email, fullName)
- Secure password changes
- Avatar and cover image management
- Profile viewing permissions

### Media Processing

- Automatic image/video optimization via Cloudinary
- Smart format conversion (auto-format detection)
- Resolution standardization:
  - Images: 1280x720 max resolution
  - Videos: HD ready format
- Quality auto-adjustment for optimal file size
- Secure attachment flags for downloads
- Temporary file cleanup with fs.unlinkSync
- Secure URL generation with Cloudinary
- Error handling for failed uploads

### API Security

- Request size limits (24kb for JSON/URL-encoded)
- File upload validation
- Secure cookie configuration
- Production-ready security settings
- CORS policy management

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
- Use proper HTTP status codes
- Implement proper security measures
