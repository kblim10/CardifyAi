# CardifyAi API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://your-production-api.com/api
```

## Authentication
All API requests (except login and register) require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Response Format
All API responses follow this format:
```json
{
  "success": true,
  "data": {},
  "message": "Success message",
  "count": 0
}
```

## Error Response Format
```json
{
  "success": false,
  "error": "Error message",
  "details": {}
}
```

---

## Authentication Endpoints

### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": null,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt_token_here"
  },
  "message": "User registered successfully"
}
```

### POST /auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": null,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt_token_here"
  },
  "message": "Login successful"
}
```

### GET /auth/me
Get current user information.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### PUT /auth/profile
Update user profile.

**Request Body:**
```json
{
  "name": "John Updated",
  "email": "john.updated@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "name": "John Updated",
    "email": "john.updated@example.com",
    "avatar": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Profile updated successfully"
}
```

### POST /auth/change-password
Change user password.

**Request Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## Deck Endpoints

### GET /decks
Get all decks for the current user.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `search` (optional): Search term
- `tags` (optional): Filter by tags (comma-separated)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "deck_123",
      "title": "JavaScript Basics",
      "description": "Learn JavaScript fundamentals",
      "coverImage": "https://example.com/image.jpg",
      "cardCount": 25,
      "userId": "user_123",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "lastReviewed": "2024-01-01T00:00:00.000Z",
      "tags": ["javascript", "programming"]
    }
  ],
  "count": 1,
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "pages": 1
  }
}
```

### GET /decks/:id
Get a specific deck by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "deck_123",
    "title": "JavaScript Basics",
    "description": "Learn JavaScript fundamentals",
    "coverImage": "https://example.com/image.jpg",
    "cardCount": 25,
    "userId": "user_123",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "lastReviewed": "2024-01-01T00:00:00.000Z",
    "tags": ["javascript", "programming"]
  }
}
```

### POST /decks
Create a new deck.

**Request Body:**
```json
{
  "title": "JavaScript Basics",
  "description": "Learn JavaScript fundamentals",
  "coverImage": "https://example.com/image.jpg",
  "tags": ["javascript", "programming"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "deck_123",
    "title": "JavaScript Basics",
    "description": "Learn JavaScript fundamentals",
    "coverImage": "https://example.com/image.jpg",
    "cardCount": 0,
    "userId": "user_123",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "lastReviewed": null,
    "tags": ["javascript", "programming"]
  },
  "message": "Deck created successfully"
}
```

### PUT /decks/:id
Update a deck.

**Request Body:**
```json
{
  "title": "JavaScript Fundamentals",
  "description": "Updated description",
  "coverImage": "https://example.com/new-image.jpg",
  "tags": ["javascript", "fundamentals"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "deck_123",
    "title": "JavaScript Fundamentals",
    "description": "Updated description",
    "coverImage": "https://example.com/new-image.jpg",
    "cardCount": 25,
    "userId": "user_123",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "lastReviewed": "2024-01-01T00:00:00.000Z",
    "tags": ["javascript", "fundamentals"]
  },
  "message": "Deck updated successfully"
}
```

### DELETE /decks/:id
Delete a deck.

**Response:**
```json
{
  "success": true,
  "message": "Deck deleted successfully"
}
```

---

## Card Endpoints

### GET /decks/:deckId/cards
Get all cards in a deck.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `status` (optional): Filter by status (new, learning, review, relearn)
- `search` (optional): Search term

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "card_123",
      "deckId": "deck_123",
      "front": "What is JavaScript?",
      "back": "A programming language for web development",
      "notes": "JavaScript is a high-level language",
      "images": ["https://example.com/image1.jpg"],
      "tags": ["javascript", "basics"],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "nextReview": "2024-01-02T00:00:00.000Z",
      "interval": 1,
      "repetition": 0,
      "efactor": 2.5,
      "status": "new"
    }
  ],
  "count": 1,
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "pages": 1
  }
}
```

### GET /decks/:deckId/cards/due
Get cards that are due for review.

**Query Parameters:**
- `limit` (optional): Maximum number of cards (default: 20)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "card_123",
      "deckId": "deck_123",
      "front": "What is JavaScript?",
      "back": "A programming language for web development",
      "notes": "JavaScript is a high-level language",
      "images": ["https://example.com/image1.jpg"],
      "tags": ["javascript", "basics"],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "nextReview": "2024-01-01T00:00:00.000Z",
      "interval": 1,
      "repetition": 0,
      "efactor": 2.5,
      "status": "review"
    }
  ],
  "count": 1
}
```

### GET /cards/:id
Get a specific card by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "card_123",
    "deckId": "deck_123",
    "front": "What is JavaScript?",
    "back": "A programming language for web development",
    "notes": "JavaScript is a high-level language",
    "images": ["https://example.com/image1.jpg"],
    "tags": ["javascript", "basics"],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "nextReview": "2024-01-02T00:00:00.000Z",
    "interval": 1,
    "repetition": 0,
    "efactor": 2.5,
    "status": "new"
  }
}
```

### POST /decks/:deckId/cards
Create a new card in a deck.

**Request Body:**
```json
{
  "front": "What is JavaScript?",
  "back": "A programming language for web development",
  "notes": "JavaScript is a high-level language",
  "images": ["https://example.com/image1.jpg"],
  "tags": ["javascript", "basics"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "card_123",
    "deckId": "deck_123",
    "front": "What is JavaScript?",
    "back": "A programming language for web development",
    "notes": "JavaScript is a high-level language",
    "images": ["https://example.com/image1.jpg"],
    "tags": ["javascript", "basics"],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "nextReview": "2024-01-02T00:00:00.000Z",
    "interval": 1,
    "repetition": 0,
    "efactor": 2.5,
    "status": "new"
  },
  "message": "Card created successfully"
}
```

### PUT /cards/:id
Update a card.

**Request Body:**
```json
{
  "front": "What is JavaScript?",
  "back": "A programming language for web development",
  "notes": "Updated notes",
  "images": ["https://example.com/image1.jpg"],
  "tags": ["javascript", "fundamentals"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "card_123",
    "deckId": "deck_123",
    "front": "What is JavaScript?",
    "back": "A programming language for web development",
    "notes": "Updated notes",
    "images": ["https://example.com/image1.jpg"],
    "tags": ["javascript", "fundamentals"],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "nextReview": "2024-01-02T00:00:00.000Z",
    "interval": 1,
    "repetition": 0,
    "efactor": 2.5,
    "status": "new"
  },
  "message": "Card updated successfully"
}
```

### DELETE /cards/:id
Delete a card.

**Response:**
```json
{
  "success": true,
  "message": "Card deleted successfully"
}
```

---

## Review Endpoints

### POST /cards/:id/review
Submit a review for a card.

**Request Body:**
```json
{
  "quality": 4,
  "timeSpent": 5000
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "card_123",
    "nextReview": "2024-01-03T00:00:00.000Z",
    "interval": 2,
    "repetition": 1,
    "efactor": 2.6,
    "status": "review"
  },
  "message": "Review submitted successfully"
}
```

### POST /decks/:deckId/review-sessions
Create a new review session.

**Request Body:**
```json
{
  "startTime": "2024-01-01T10:00:00.000Z",
  "cardsReviewed": 0,
  "cardsCorrect": 0
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "session_123",
    "deckId": "deck_123",
    "startTime": "2024-01-01T10:00:00.000Z",
    "endTime": null,
    "cardsReviewed": 0,
    "cardsCorrect": 0
  },
  "message": "Review session created successfully"
}
```

### PUT /review-sessions/:id
Update a review session.

**Request Body:**
```json
{
  "endTime": "2024-01-01T10:30:00.000Z",
  "cardsReviewed": 20,
  "cardsCorrect": 18
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "session_123",
    "deckId": "deck_123",
    "startTime": "2024-01-01T10:00:00.000Z",
    "endTime": "2024-01-01T10:30:00.000Z",
    "cardsReviewed": 20,
    "cardsCorrect": 18
  },
  "message": "Review session updated successfully"
}
```

---

## OCR Endpoints

### POST /ocr/extract
Extract text from an image using OCR.

**Request Body (multipart/form-data):**
```
image: [file]
language: eng (optional)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "text": "Extracted text from image",
    "confidence": 0.95,
    "language": "eng"
  },
  "message": "Text extracted successfully"
}
```

---

## Statistics Endpoints

### GET /statistics/overview
Get overview statistics for the current user.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalDecks": 5,
    "totalCards": 150,
    "cardsLearned": 120,
    "cardsDue": 15,
    "currentStreak": 7,
    "longestStreak": 15,
    "averageAccuracy": 85.5,
    "totalStudyTime": 3600000
  }
}
```

### GET /statistics/daily
Get daily statistics.

**Query Parameters:**
- `startDate` (optional): Start date (YYYY-MM-DD)
- `endDate` (optional): End date (YYYY-MM-DD)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "date": "2024-01-01",
      "cardsLearned": 10,
      "cardsReviewed": 25,
      "timeSpent": 1800000,
      "correctAnswers": 22
    }
  ]
}
```

---

## Error Codes

| Status Code | Error Type | Description |
|-------------|------------|-------------|
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Access denied |
| 404 | Not Found | Resource not found |
| 422 | Validation Error | Data validation failed |
| 500 | Internal Server Error | Server error |

---

## Rate Limiting

API requests are limited to:
- 100 requests per minute for authenticated users
- 10 requests per minute for unauthenticated users

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

---

## Pagination

List endpoints support pagination with the following query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

Pagination metadata is included in responses:
```json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
``` 