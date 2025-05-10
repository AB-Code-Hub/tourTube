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
  - Support for title and description
  - Automatic thumbnail generation
  - Video duration extraction
  - Cloudinary-based storage for both video and thumbnail
- Video management
  - Publish/unpublish controls
  - View count tracking
  - Duration tracking
  - Thumbnail management
  - Update video details
  - Delete video with cleanup
- Video discovery
  - Pagination support
  - Search by title
  - Sorting options (timestamp, views, etc.)
  - Filter by user/channel
- Video engagement
  - Like/unlike functionality
  - Comments system with pagination
  - Watch history tracking per user

### Social Features

- Comments System

  - Nested comment support
  - Pagination with mongoose-aggregate-paginate-v2
  - Edit and delete functionality
  - Owner identification
  - Timestamp tracking
  - Like/unlike support
  - Performance optimized aggregation pipelines

- Like System

  - Polymorphic like functionality
    - Videos
    - Comments
    - Tweets
  - Like count tracking
  - User-specific like status
  - Optimized queries for like status checks
  - Atomic operations for consistency

- Subscription System

  - Channel subscriptions
  - Real-time subscriber count
  - Bi-directional relationship tracking
  - Subscription status verification
  - Aggregated subscription metrics
    - Total subscriber count
    - Channels subscribed to count
  - Subscription history with timestamps

- Watch History

  - Per-user video history tracking
  - Automatic history updates
  - History retrieval with video details
  - Aggregated history with video metadata
  - Channel information in history

- Tweet System
  - Text-based updates
  - Media attachment support
  - Like functionality
  - User engagement tracking
  - Timeline aggregation

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
- Title (required, searchable)
- Description (optional)
- View Count (default: 0)
- Duration (required, auto-calculated)
- Publishing Status (boolean, default: true)
- Owner Reference (User model)
- Timestamps (created/updated)
- Support for aggregation pipelines
- Mongoose-aggregate-paginate-v2 integration

### Supporting Models

- Comments (with mongoose-aggregate-paginate-v2)
  - Nested comments support
  - Comment text
  - Video reference
  - User reference
- Likes (polymorphic references)
  - Support for videos, comments, tweets
  - User reference
  - Target reference (video/comment/tweet)
- Playlists
  - Name and description
  - Video references
  - Owner reference
  - Privacy settings
- Subscriptions
  - Subscriber reference (User)
  - Channel reference (User)
  - Timestamp tracking
- Tweets
  - Content
  - User reference
  - Media attachments
  - Like support

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

- Multer middleware configuration
  - File type validation (image/video)
  - Size limits enforcement
  - File count limits per request
  - Temporary storage management
- Automatic temporary file cleanup
- Secure Cloudinary integration
  - Automatic format optimization
  - Video quality adjustment
  - Resolution standardization:
    - Images: 1280x720 max resolution
    - Videos: HD ready format
  - Duration metadata extraction
  - Secure URL generation
  - Public ID management
  - Resource cleanup on error
- Upload error handling
  - File size validation
  - Format validation
  - Upload timeout management
  - Cloudinary error handling
  - Automatic cleanup on failure

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

### Logging and Monitoring

- Winston Logger Integration

  - Custom log format
  - Log levels configuration
  - JSON format logging
  - Timestamp integration
  - Console transport
  - File transport (app.log)
  - Error stack traces in development

- Morgan HTTP Logger

  - Custom format: method, URL, status, response time
  - Integration with Winston
  - Request tracking
  - Performance monitoring
  - Error logging

- Error Tracking

  - Centralized error handling
  - Error classification
  - Stack trace preservation
  - Error response formatting
  - Development/Production modes

- Performance Monitoring

  - Response time tracking
  - Database query monitoring
  - File upload tracking
  - API endpoint metrics
  - Resource usage monitoring

- Security Logging
  - Authentication attempts
  - Token management
  - File operations
  - User actions
  - Security violations

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
- `GET /api/v1/users/history` - Get user's watch history (protected)

### Video Management

- `GET /api/v1/videos` - Get all videos with pagination and filters
- `POST /api/v1/videos/publish` - Upload and publish a new video (protected)
- `GET /api/v1/videos/:videoId` - Get video by ID (protected)
- `PATCH /api/v1/videos/update/:videoId` - Update video details (protected)
- `DELETE /api/v1/videos/:videoId` - Delete a video (protected)
- `PATCH /api/v1/videos/toggle/publish/:videoId` - Toggle video publish status (protected)

For detailed API documentation including request/response formats, see `/docs/api.md`

## Additional Features

### Subscription Management

- User subscription system with Mongoose
- Real-time subscriber count tracking
- Bi-directional subscription relationships
- Channel subscription status verification
- Subscriber and subscription lists

### Channel Management

- Profile Features

  - Customizable username
  - Full name display
  - Profile avatar (required)
  - Cover image (optional)
  - Channel statistics
    - Subscriber count
    - Total subscriptions
    - Video count
  - Channel verification status

- Content Management

  - Video publishing controls
  - Published/unpublished video listing
  - Batch video management
  - Content visibility settings
  - Media asset management

- Analytics

  - View count tracking
  - Subscriber growth metrics
  - Engagement statistics
    - Likes
    - Comments
    - Watch time
  - Real-time metric updates

- Subscription Management

  - Subscriber list access
  - Subscription status checking
  - Channel subscription listing
  - Notification settings
  - Privacy controls

- Channel Customization
  - Profile editing
    - Username updates
    - Email management
    - Full name changes
  - Avatar/cover image updates
  - Channel description
  - Social media links

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

- Request payload limits
  - JSON body: 24kb limit
  - URL-encoded: 24kb limit
  - Multipart form data: Configurable limits
- Authentication middleware
  - JWT token validation
  - Token blacklisting support
  - Protected route enforcement
- Cookie security
  - HTTP-only flags
  - Secure flag in production
  - CORS policy configuration
  - Production security settings
- Error handling
  - Standardized error responses
  - Input validation errors
  - Authentication errors
  - File upload errors
  - Database errors
- Resource access control
  - Owner-only video operations
  - Protected media URLs
  - Rate limiting support
  - Input sanitization

### Performance Optimization

- Database Optimization

  - Indexed fields for quick lookups
    - Username
    - Email
    - Full Name
    - Video Title
  - Compound indexes for common queries
  - Mongoose aggregation pipelines
  - Efficient pagination implementation

- Query Optimization

  - Selective field projection
  - Populated references optimization
  - Aggregation pipeline optimization
  - Caching strategies
  - Batch operations

- Media Handling

  - Cloudinary CDN integration
  - Automatic image optimization
  - Video transcoding
  - Adaptive quality settings
  - Lazy loading support

- API Performance

  - Request payload size limits
  - Response compression
  - Efficient error handling
  - Connection pooling
  - Rate limiting support

- Resource Management
  - Temporary file cleanup
  - Memory usage optimization
  - Connection management
  - Resource pooling
  - Garbage collection optimization

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

### Development and Testing

- Development Tools

  - Nodemon for auto-reloading
  - Environment configuration
  - Debug logging
  - Code formatting (Prettier)
  - Development scripts

- Code Organization

  - MVC architecture
  - Modular routing
  - Middleware separation
  - Utility functions
  - Constants management

- Input Validation

  - Joi schema validation
  - Request sanitization
  - Type checking
  - Error messages
  - Custom validators

- Error Management

  - Custom error classes
  - Error middleware
  - Error response format
  - Development stack traces
  - Production error handling

- Project Structure
  - Feature-based organization
  - Clear separation of concerns
  - Resource modularity
  - Configuration management
  - Documentation organization

### Deployment and Configuration

- Environment Variables

  - Server configuration
    - PORT (default: 8000)
    - NODE_ENV
    - CORS_ORIGIN
  - Database settings
    - DB_NAME
    - DB_URL
  - Authentication secrets
    - ACCESS_TOKEN_SECRET
    - ACCESS_TOKEN_EXPIRE
    - REFRESH_TOKEN_SECRET
    - REFRESH_TOKEN_EXPIRE
  - Cloudinary configuration
    - CLOUDINARY_CLOUD_NAME
    - CLOUDINARY_API_KEY
    - CLOUDINARY_API_SECRET

- Production Settings

  - Secure cookie configuration
  - Error handling customization
  - Logging configuration
  - Performance optimization
  - Security hardening

- Deployment Steps

  1. Set environment variables
  2. Install dependencies
  3. Build application
  4. Configure database
  5. Start server process

- Maintenance
  - Log rotation
  - Database backups
  - Media backup strategy
  - Performance monitoring
  - Security updates
