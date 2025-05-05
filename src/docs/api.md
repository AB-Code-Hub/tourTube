# TourTube API Documentation

## Base URL

All endpoints are prefixed with `/api/v1/`

## Security

### Authentication

- JWT-based authentication system
- Access tokens expire after 3 hours
- Refresh tokens expire after 3 days
- Tokens are delivered via HTTP-only cookies
- Also included in response body for external clients
- Authorization header format for token usage:

```
Authorization: Bearer <access_token>
```

### Request Size Limits

- JSON payload limit: 24kb
- URL-encoded payload limit: 24kb
- File uploads: Handled by Multer with configurable limits

### CORS

- Configurable origin via CORS_ORIGIN environment variable
- Credentials support enabled
- Proper headers handling for secure cross-origin requests

## Standard Response Format

All API responses follow this structure:

```json
{
  "statusCode": number,
  "data": any,
  "message": string,
  "success": boolean
}
```

- `success` is automatically `false` for status codes >= 400
- `data` contains the response payload
- `message` provides context about the operation
- Error responses include additional `errors` array

### Error Response Format

```json
{
  "statusCode": number,
  "data": null,
  "message": string,
  "success": false,
  "errors": string[]
}
```

## Available Endpoints

### Health Check

Verify API service status.

**Endpoint**: `/healthcheck`  
**Method**: GET  
**Authentication**: None required

#### Success Response

```json
{
  "statusCode": 200,
  "data": "ok",
  "message": "Health check passed",
  "success": true
}
```

### File Management

The API implements a secure two-step file upload process:

1. Temporary Storage (Multer)

   - Location: `./public/temp`
   - Maintains original filenames
   - Validates file types and sizes
   - Cleans up after processing

2. Permanent Storage (Cloudinary)
   - Secure URL generation
   - Automatic format optimization
   - Quality auto-adjustment
   - Attachment flags for downloads
   - Image/Video transformations:
     - Resolution limit: 1280x720
     - Format auto-detection
     - Quality optimization

### User Management

#### Register User

Create a new user account with profile images.

**Endpoint**: `/users/register`  
**Method**: POST  
**Content-Type**: multipart/form-data  
**Authentication**: None required

**Request Body:**

- `username`: string (required, unique, max: 50 chars)
- `email`: string (required, unique, max: 50 chars)
- `fullName`: string (required, max: 30 chars)
- `password`: string (required, min: 6 chars)
- `avatar`: file (required)
- `coverImage`: file (optional)

**Success Response:**

```json
{
  "statusCode": 201,
  "data": {
    "username": "string",
    "email": "string",
    "fullName": "string",
    "avatar": "string (url)",
    "coverImage": "string (url)",
    "_id": "string",
    "createdAt": "string (ISO date)",
    "updatedAt": "string (ISO date)"
  },
  "message": "User registered successfully",
  "success": true
}
```

**Error Responses:**

- 400: Validation error (missing/invalid fields)
- 409: Username/email already exists
- 500: Server error (with cleanup of uploaded files)

#### Login

Authenticate user and receive tokens.

**Endpoint**: `/users/login`  
**Method**: POST  
**Content-Type**: application/json

**Request Body:**

```json
{
  "email": "string (optional if username provided)",
  "username": "string (optional if email provided)",
  "password": "string (required, min: 6 chars)"
}
```

Note: Either email OR username must be provided, not both.

**Success Response:**

```json
{
  "statusCode": 200,
  "data": {
    "user": {
      // User object without sensitive fields
    },
    "accessToken": "string",
    "refreshToken": "string"
  },
  "message": "User logged in successfully",
  "success": true
}
```

**Cookies Set:**

- `accessToken`: HTTP-only, Secure in production
- `refreshToken`: HTTP-only, Secure in production

#### Refresh Token

Get new access token using refresh token.

**Endpoint**: `/users/refresh-token`  
**Method**: POST  
**Content-Type**: application/json

**Request Sources** (in order of precedence):

1. Cookie: `refreshToken`
2. Body: `{ "refreshToken": "string" }`

**Success Response:**

```json
{
  "statusCode": 200,
  "data": {
    "accessToken": "string",
    "refreshToken": "string"
  },
  "message": "Access token refreshed successfully",
  "success": true
}
```

**Error Responses:**

- 401: Invalid/Expired refresh token
- 404: User not found

### Video Management

#### Upload Video

Upload a new video with metadata.

**Endpoint**: `/api/v1/videos/upload`  
**Method**: POST  
**Authentication**: Required  
**Content-Type**: multipart/form-data

**Request Body:**

```json
{
  "title": "string (required)",
  "description": "string (optional)",
  "videoFile": "file (required)",
  "thumbnail": "file (required)",
  "isPublished": "boolean (default: true)"
}
```

### Social Features

#### Create Comment

Add a comment to a video.

**Endpoint**: `/api/v1/comments`  
**Method**: POST  
**Authentication**: Required

**Request Body:**

```json
{
  "content": "string (required)",
  "videoId": "string (required)"
}
```

#### Like/Unlike Content

Toggle like status on content.

**Endpoint**: `/api/v1/likes/{type}/{id}`  
**Method**: POST  
**Authentication**: Required

**Parameters:**

- type: "video" | "comment" | "tweet"
- id: ObjectId of content

#### Manage Subscriptions

Toggle subscription to a channel.

**Endpoint**: `/api/v1/subscriptions/{channelId}`  
**Method**: POST  
**Authentication**: Required

## Implementation Details

### Error Handling

- Async operations wrapped with asyncHandler
- Consistent error format across API
- Proper cleanup on failures
- Stack traces in development mode only
- Mongoose error handling
- JWT verification error handling

### File Processing

- Two-step upload process:
  1. Temporary storage with Multer
  2. Cloud storage with Cloudinary
- Automatic cleanup of temporary files
- Cloudinary optimization features
- Error handling with rollback capability

### Database Operations

- Proper indexing for performance
- Aggregate pagination support
- Optimized queries
- Proper data validation

### Security Measures

- Input validation and sanitization
- Secure password handling with bcrypt
- Token-based authentication
- File type validation
- Request size limits
- CORS protection
- HTTP-only cookies
- Production security configurations

### Performance Optimization

- Efficient database queries
- Proper MongoDB indexing
- Response pagination support
- Optimized file handling
- Cloudinary transformations
