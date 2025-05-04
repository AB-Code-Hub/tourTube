# TourTube API Documentation

This document provides detailed information about the TourTube API endpoints.

## Base URL

All endpoints are prefixed with `/api/v1/`

## Authentication

Most endpoints require JWT authentication. Include the access token in the Authorization header:

```
Authorization: Bearer <access_token>
```

Access tokens expire after 3 hours. Use the refresh token endpoint to obtain a new access token.

## Standard Response Format

All API responses follow this format:

```json
{
  "statusCode": number,
  "data": any,
  "message": string,
  "success": boolean
}
```

- `success` is automatically set to `false` for status codes >= 400
- Error responses include additional `errors` array when applicable

## Error Handling

Error responses use the following format:

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

Verify the API service status.

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

### File Upload System

#### Upload Endpoints

The API uses a two-step upload process:

1. File is uploaded to temporary storage
2. File is processed and stored in Cloudinary

**Temporary Storage:**

- Location: `./public/temp`
- Handled by Multer middleware
- Supports multiple file types
- Original filenames preserved

**Cloudinary Storage:**

- Automatic file type detection
- Secure upload process
- Temporary files are cleaned up
- Returns secure URLs

### Authentication Endpoints

#### Register User

**Endpoint**: `/api/v1/users/register`
**Method**: POST
**Content-Type**: multipart/form-data

**Request Body:**

```json
{
  "username": "string",
  "email": "string",
  "fullName": "string",
  "password": "string",
  "avatar": "file",
  "coverImage": "file (optional)"
}
```

#### Login

**Endpoint**: `/api/v1/users/login`
**Method**: POST

**Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**

```json
{
  "statusCode": 200,
  "data": {
    "user": {},
    "accessToken": "string",
    "refreshToken": "string"
  },
  "message": "User logged in successfully",
  "success": true
}
```

#### Refresh Token

**Endpoint**: `/api/v1/users/refresh-token`
**Method**: POST

**Request Body:**

```json
{
  "refreshToken": "string"
}
```

### Video Management

#### Upload Video

**Endpoint**: `/api/v1/videos/upload`
**Method**: POST
**Authentication**: Required
**Content-Type**: multipart/form-data

**Request Body:**

```json
{
  "title": "string",
  "description": "string",
  "videoFile": "file",
  "thumbnail": "file",
  "isPublished": "boolean (optional)"
}
```

### Social Features

#### Create Comment

**Endpoint**: `/api/v1/comments`
**Method**: POST
**Authentication**: Required

**Request Body:**

```json
{
  "content": "string",
  "videoId": "string"
}
```

#### Like/Unlike

**Endpoint**: `/api/v1/likes/{type}/{id}`
**Method**: POST
**Authentication**: Required
**Parameters:**

- type: "video" | "comment" | "tweet"
- id: Object ID of the content

#### Subscribe/Unsubscribe

**Endpoint**: `/api/v1/subscriptions/{channelId}`
**Method**: POST
**Authentication**: Required

## Implementation Notes

### Error Handling

- All async route handlers use the `asyncHandler` wrapper
- Errors are handled consistently through the `ApiError` class
- Stack traces are included in development mode

### Request Validation

- All requests are validated for:
  - Required fields
  - Data types
  - Authorization headers where applicable
  - Request size limits (24kb)

### Performance

- Database queries use proper indexes
- Responses are properly paginated where needed
- Mongoose aggregate pagination for optimized list queries
