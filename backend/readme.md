
## Overview

TourTube is a feature-rich social media platform combining elements of YouTube and Twitter, built with Node.js, Express.js, and MongoDB. The platform supports video sharing, user interactions, comments, likes, and subscription features, with optimized MongoDB aggregation pipelines for efficient data retrieval.

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
  - Token blacklisting for security
- Profile management with avatar and cover image upload
- Watch history tracking with aggregated video details
- Cloudinary integration for media storage
- Channel profile with aggregated statistics

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
  - Update video details with validation
  - Delete video with associated data cleanup
- Video discovery
  - Advanced pagination with aggregation
  - Search by title with regex support
  - Multiple sorting options (timestamp, views, likes)
  - Filter by user/channel
  - Performance-optimized queries
- Video engagement
  - Like/unlike functionality with count tracking
  - Aggregated comments system
  - Real-time watch history tracking
  - View count analytics

### Social Features

- Comments System
  - Nested comments support
  - Advanced pagination with aggregation
  - Edit and delete functionality with authorization
  - Owner details in responses
  - Timestamp tracking
  - Like/unlike support with counts
  - Aggregated comment retrieval
  - Performance-optimized queries

- Like System
  - Polymorphic like functionality
    - Videos with like counts
    - Comments with aggregated stats
    - Tweets with engagement tracking
  - Real-time like status updates
  - Optimized aggregation pipelines
  - Atomic operations for consistency
  - Batch operations for cleanup

- Subscription System
  - Channel subscriptions with counts
  - Real-time subscriber tracking
  - Bi-directional relationship management
  - Aggregated subscription metrics
    - Total subscriber count
    - Channels subscribed count
    - Subscription history
  - Performance-optimized queries

- Dashboard System
  - Channel statistics
    - Total video views
    - Total subscribers
    - Total video count
    - Total likes received
  - Performance analytics
    - Last 30 days trends
    - Daily view statistics
    - Engagement metrics
  - Content management
    - Video listing with filters
    - Sorting and pagination
    - Search functionality

- Tweet System
  - Text-based updates
  - Like functionality with counts
  - User engagement tracking
  - Aggregated responses
  - Performance-optimized queries

## API Optimizations

### Database Queries

- Optimized Aggregation Pipelines
  - Efficient data lookups
  - Reduced memory usage
  - Proper indexing
  - Pipeline optimization

### Performance Features

- Smart Pagination
  - Cursor-based navigation
  - Limit/Skip optimization
  - Count optimization
  - Response size management

### Security Enhancements

- Resource Authorization
  - Owner verification
  - Permission checks
  - Rate limiting
  - Input validation

### Error Handling

- Comprehensive Error Management
  - Detailed error messages
  - Status code mapping
  - Error categorization
  - Recovery strategies

## API Routes

### Video Management

- `GET /api/v1/videos` - Get all videos with filters and aggregated data
- `POST /api/v1/videos/publish` - Upload and publish video
- `GET /api/v1/videos/:videoId` - Get video with aggregated stats
- `PATCH /api/v1/videos/update/:videoId` - Update video details
- `DELETE /api/v1/videos/:videoId` - Delete video and associated data
- `PATCH /api/v1/videos/toggle/publish/:videoId` - Toggle publish status

### Comment Management

- `GET /api/v1/comments/video/:videoId` - Get video comments with aggregated data
- `POST /api/v1/comments/video/:videoId` - Create comment
- `PATCH /api/v1/comments/:commentId` - Update comment
- `DELETE /api/v1/comments/:commentId` - Delete comment and associated data

### Like Management

- `POST /api/v1/likes/videos/:videoId` - Toggle video like
- `POST /api/v1/likes/comments/:commentId` - Toggle comment like
- `POST /api/v1/likes/tweets/:tweetId` - Toggle tweet like
- `GET /api/v1/likes/videos/user` - Get user's liked videos

### Subscription Management

- `POST /api/v1/subscriptions/c/:channelId` - Toggle subscription
- `GET /api/v1/subscriptions/channel/:channelId/subscribers` - Get channel subscribers
- `GET /api/v1/subscriptions/user/subscribed` - Get user's subscribed channels

### Dashboard

- `GET /api/v1/dashboard/stats` - Get channel statistics
- `GET /api/v1/dashboard/videos` - Get channel videos with filters

### Playlist Management

- `POST /api/v1/playlists` - Create playlist
- `GET /api/v1/playlists/user/:userId` - Get user playlists
- `GET /api/v1/playlists/:playlistId` - Get playlist details
- `PATCH /api/v1/playlists/:playlistId` - Update playlist
- `DELETE /api/v1/playlists/:playlistId` - Delete playlist
- `POST /api/v1/playlists/:playlistId/videos/:videoId` - Add video to playlist
- `DELETE /api/v1/playlists/:playlistId/videos/:videoId` - Remove video from playlist

### Tweet Management

- `POST /api/v1/tweets` - Create tweet
- `GET /api/v1/tweets/user/:userId` - Get user tweets
- `PATCH /api/v1/tweets/:tweetId` - Update tweet
- `DELETE /api/v1/tweets/:tweetId` - Delete tweet

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
