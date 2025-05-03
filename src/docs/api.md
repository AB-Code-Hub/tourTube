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
