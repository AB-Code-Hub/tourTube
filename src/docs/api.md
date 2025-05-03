# TourTube API Documentation

This document provides detailed information about the TourTube API endpoints.

## Base URL
All endpoints are prefixed with `/api/v1/`

## Response Format
All API responses follow this standard format:
```json
{
  "statusCode": number,
  "data": any,
  "message": string,
  "success": boolean
}
```

## Endpoints

### Health Check
Verify the API service status.

**Endpoint**: `/healtcheck`
**Method**: GET
**Authentication**: None

#### Success Response
- **Status Code**: 200
- **Response Body**:
```json
{
  "statusCode": 200,
  "data": "ok",
  "message": "Health check passed",
  "success": true
}
```

#### Implementation Details
- Location: 
  - Route: `src/routes/healthCheck.route.js`
  - Controller: `src/controllers/healthCheck.controller.js`
- Uses asyncHandler for error handling
- Returns standardized ApiResponse

## Error Handling
All endpoints use the centralized error handling system via:
- `ApiError` class for error responses
- `asyncHandler` wrapper for async route handlers
- Standardized error response format