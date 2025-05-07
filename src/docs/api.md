# TourTube API Documentation

## Base URL

All endpoints are prefixed with `/api/v1/`

## Authentication System

### Token System

- Access Token (JWT)

  - Expiry: 3 hours
  - Delivered via HTTP-only cookie and response body
  - Used for API authentication
  - Required for protected endpoints

- Refresh Token (JWT)
  - Expiry: 3 days
  - Stored in database
  - Used to obtain new access tokens
  - Delivered via HTTP-only cookie and response body

### Token Usage

- Bearer token in Authorization header:

```
Authorization: Bearer <access_token>
```

- Cookies (preferred for web clients)
  - `accessToken`
  - `refreshToken`

## Security Features

### Request Limits

- JSON body: 24kb max
- URL-encoded data: 24kb max
- File uploads: Configured per route
- Rate limiting: Applied per IP

### File Security

- Two-phase upload process:
  1. Local temporary storage (Multer)
  2. Cloud storage (Cloudinary)
- Automatic cleanup
- Type validation
- Size restrictions

### CORS Policy

- Origin: Configurable via CORS_ORIGIN
- Credentials: Enabled
- Methods: GET, POST, PUT, DELETE
- Headers: Content-Type, Authorization

## Response Format

### Success Response

```json
{
  "statusCode": number,
  "data": any,
  "message": string,
  "success": true
}
```

### Error Response

```json
{
  "statusCode": number,
  "data": null,
  "message": string,
  "success": false,
  "errors": string[]
}
```

## API Endpoints

### Health Check

GET `/healthcheck`

- Purpose: API health verification
- Auth: None required
- Response: 200 OK

```json
{
  "statusCode": 200,
  "data": "ok",
  "message": "Health check passed",
  "success": true
}
```

### User Management

#### Register User

POST `/users/register`

- Auth: None required
- Content-Type: multipart/form-data
- Body:
  - username\* (string, max:50)
  - email\* (string, max:50)
  - fullName\* (string, max:30)
  - password\* (string, min:6)
  - avatar\* (file)
  - coverImage (file, optional)
- Response: 201 Created

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
    "createdAt": "string",
    "updatedAt": "string"
  },
  "message": "User registered successfully",
  "success": true
}
```

#### Login User

POST `/users/login`

- Auth: None required
- Content-Type: application/json
- Body:

```json
{
  "email": "string (required if username not provided)",
  "username": "string (required if email not provided)",
  "password": "string (required, min:6)"
}
```

- Response: 200 OK

```json
{
  "statusCode": 200,
  "data": {
    "user": {
      "_id": "string",
      "username": "string",
      "email": "string",
      "fullName": "string",
      "avatar": "string (url)",
      "coverImage": "string (url)"
    },
    "accessToken": "string",
    "refreshToken": "string"
  },
  "message": "User logged in successfully",
  "success": true
}
```

#### Logout User

POST `/users/logout`

- Auth: Required (Bearer token)
- Response: 200 OK

```json
{
  "statusCode": 200,
  "data": {},
  "message": "User logged out successfully",
  "success": true
}
```

#### Refresh Token

POST `/users/refresh-token`

- Auth: Required (Bearer token)
- Content-Type: application/json
- Sources (in order):
  1. Cookie (refreshToken)
  2. Request body

```json
{
  "refreshToken": "string"
}
```

- Response: 200 OK

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

#### Get Current User Profile

GET `/users/profile`

- Auth: Required (Bearer token)
- Response: 200 OK

```json
{
  "statusCode": 200,
  "data": {
    "_id": "string",
    "username": "string",
    "email": "string",
    "fullName": "string",
    "avatar": "string (url)",
    "coverImage": "string (url)",
    "watchHistory": ["video_id"]
  },
  "message": "User retrieved successfully",
  "success": true
}
```

#### Change Password

POST `/users/change-password`

- Auth: Required (Bearer token)
- Content-Type: application/json
- Body:

```json
{
  "currentPassword": "string (min:6)",
  "newPassword": "string (min:6)"
}
```

- Response: 200 OK

```json
{
  "statusCode": 200,
  "data": {},
  "message": "Password changed successfully",
  "success": true
}
```

#### Update Account Details

POST `/users/update-details`

- Auth: Required (Bearer token)
- Content-Type: application/json
- Body:

```json
{
  "fullName": "string (max:30)",
  "email": "string (max:50)",
  "username": "string (max:50)"
}
```

- Response: 200 OK

```json
{
  "statusCode": 200,
  "data": {
    "_id": "string",
    "username": "string",
    "email": "string",
    "fullName": "string",
    "avatar": "string (url)",
    "coverImage": "string (url)"
  },
  "message": "Account details updated successfully",
  "success": true
}
```

#### Update Avatar

POST `/users/update-avatar`

- Auth: Required (Bearer token)
- Content-Type: multipart/form-data
- Body:
  - avatar\* (file)
- Response: 200 OK

```json
{
  "statusCode": 200,
  "data": {
    "_id": "string",
    "username": "string",
    "email": "string",
    "fullName": "string",
    "avatar": "string (url)",
    "coverImage": "string (url)"
  },
  "message": "Avatar updated successfully",
  "success": true
}
```

#### Update Cover Image

POST `/users/update-cover-image`

- Auth: Required (Bearer token)
- Content-Type: multipart/form-data
- Body:
  - coverImage\* (file)
- Response: 200 OK

```json
{
  "statusCode": 200,
  "data": {
    "_id": "string",
    "username": "string",
    "email": "string",
    "fullName": "string",
    "avatar": "string (url)",
    "coverImage": "string (url)"
  },
  "message": "Cover image updated successfully",
  "success": true
}
```

#### Get Channel Profile

GET `/users/channel/:username`

- Auth: Required (Bearer token)
- Response: 200 OK

```json
{
  "statusCode": 200,
  "data": {
    "fullName": "string",
    "username": "string",
    "avatar": "string (url)",
    "coverImage": "string (url)",
    "email": "string",
    "subscribersCount": number,
    "channelSubscribedToCount": number,
    "isSubscribed": boolean,
    "createdAt": "string"
  },
  "message": "Channel profile fetched successfully",
  "success": true
}
```

## Error Codes

- 200: Success
- 201: Created
- 400: Bad Request (validation errors)
- 401: Unauthorized (invalid/missing token)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 409: Conflict (e.g., duplicate username)
- 429: Too Many Requests
- 500: Internal Server Error

## File Upload Details

### Supported Formats

- Images: jpg, jpeg, png, gif
- Videos: mp4, mov, webm
- Max file sizes configured per route

### Cloudinary Integration

- Auto-optimization
- Format conversion
- Quality adjustment
- Secure URL generation
- Resolution limits:
  - Images: 1280x720 max
  - Videos: HD ready

## Development Notes

### Environment Variables

Required in `.env`:

```
PORT=8000
CORS_ORIGIN=*
DB_NAME="tourTube"
DB_URL=mongodb+srv://...
ACCESS_TOKEN_SECRET=your_secret
ACCESS_TOKEN_EXPIRE=3h
REFRESH_TOKEN_SECRET=your_secret
REFRESH_TOKEN_EXPIRE=3d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development
```

### Error Handling

- Consistent format across API
- Stack traces in development
- Sanitized responses in production
- Proper cleanup on failures
- Mongoose error handling
- JWT verification errors

### Security Measures

- Password hashing (bcrypt)
- HTTP-only cookies
- CORS protection
- Input validation
- File type checking
- Request size limits
- Secure headers
