# API Contract

This document describes the current MVP backend API for Social Community Maker.

Base URL for local development:

```text
http://localhost:8080/api
```

Frontend local URL:

```text
http://localhost:5173
```

Authentication uses JWT bearer tokens.

Protected requests should include:

```http
Authorization: Bearer <token>
```

---

# Health

## GET `/health`

Checks whether the backend is running.

### Response `200 OK`

```json
{
  "status": "UP",
  "service": "Social Community Maker Backend",
  "timestamp": "2026-06-05T20:00:00Z"
}
```

---

# Authentication

## POST `/auth/register`

Registers a new user.

### Request

```json
{
  "email": "test@example.com",
  "username": "testuser",
  "displayName": "Test User",
  "password": "Password123!"
}
```

### Response `201 Created`

```json
{
  "id": 1,
  "email": "test@example.com",
  "username": "testuser",
  "displayName": "Test User",
  "bio": null,
  "avatarUrl": null,
  "createdAt": "2026-06-05T20:00:00"
}
```

### Validation Rules

```text
email is required and must be valid
username is required and must be 3-50 characters
displayName is required and must be 2-100 characters
password is required and must be 8-100 characters
email must be unique
username must be unique
```

### Error Responses

```text
400 Bad Request - validation error
409 Conflict - email or username already exists
```

---

## POST `/auth/login`

Logs in a user and returns a JWT token.

### Request

```json
{
  "email": "test@example.com",
  "password": "Password123!"
}
```

### Response `200 OK`

```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "tokenType": "Bearer",
  "user": {
    "id": 1,
    "email": "test@example.com",
    "username": "testuser",
    "displayName": "Test User",
    "bio": null,
    "avatarUrl": null,
    "createdAt": "2026-06-05T20:00:00"
  }
}
```

### Error Responses

```text
401 Unauthorized - invalid email or password
```

---

## GET `/auth/me`

Returns the current logged-in user.

### Headers

```http
Authorization: Bearer <token>
```

### Response `200 OK`

```json
{
  "id": 1,
  "email": "test@example.com",
  "username": "testuser",
  "displayName": "Test User",
  "bio": null,
  "avatarUrl": null,
  "createdAt": "2026-06-05T20:00:00"
}
```

### Error Responses

```text
401 Unauthorized - missing, invalid, or expired token
```

---

# Communities

## GET `/communities`

Returns public communities.

### Response `200 OK`

```json
[
  {
    "id": 1,
    "name": "LA Developers",
    "slug": "la-developers",
    "description": "A community for developers in Los Angeles.",
    "visibility": "PUBLIC",
    "owner": {
      "id": 1,
      "email": "test@example.com",
      "username": "testuser",
      "displayName": "Test User"
    },
    "currentUserIsMember": null,
    "currentUserRole": null,
    "createdAt": "2026-06-05T20:00:00",
    "updatedAt": "2026-06-05T20:00:00"
  }
]
```

---

## POST `/communities`

Creates a community.

### Headers

```http
Authorization: Bearer <token>
```

### Request

```json
{
  "name": "LA Developers",
  "slug": "la-developers",
  "description": "A community for developers in Los Angeles.",
  "visibility": "PUBLIC"
}
```

### Response `201 Created`

```json
{
  "id": 1,
  "name": "LA Developers",
  "slug": "la-developers",
  "description": "A community for developers in Los Angeles.",
  "visibility": "PUBLIC",
  "owner": {
    "id": 1,
    "email": "test@example.com",
    "username": "testuser",
    "displayName": "Test User"
  },
  "currentUserIsMember": true,
  "currentUserRole": "OWNER",
  "createdAt": "2026-06-05T20:00:00",
  "updatedAt": "2026-06-05T20:00:00"
}
```

### Notes

```text
The creator automatically becomes OWNER.
An OWNER record is created in community_members.
```

### Validation Rules

```text
name is required and must be 2-100 characters
slug is required and must be 3-100 characters
slug must use lowercase letters, numbers, and hyphens only
description must be 2000 characters or less
visibility is required
slug must be unique
```

### Error Responses

```text
400 Bad Request - validation error
401 Unauthorized - missing or invalid token
409 Conflict - slug already exists
```

---

## GET `/communities/me`

Returns the logged-in user's owned and joined communities.

### Headers

```http
Authorization: Bearer <token>
```

### Response `200 OK`

```json
{
  "ownedCommunities": [
    {
      "id": 1,
      "name": "LA Developers",
      "slug": "la-developers",
      "description": "A community for developers in Los Angeles.",
      "visibility": "PUBLIC",
      "owner": {
        "id": 1,
        "email": "test@example.com",
        "username": "testuser",
        "displayName": "Test User"
      },
      "currentUserIsMember": true,
      "currentUserRole": "OWNER",
      "createdAt": "2026-06-05T20:00:00",
      "updatedAt": "2026-06-05T20:00:00"
    }
  ],
  "joinedCommunities": [
    {
      "id": 2,
      "name": "React Builders",
      "slug": "react-builders",
      "description": "A community for React developers.",
      "visibility": "PUBLIC",
      "owner": {
        "id": 2,
        "email": "owner@example.com",
        "username": "owneruser",
        "displayName": "Owner User"
      },
      "currentUserIsMember": true,
      "currentUserRole": "MEMBER",
      "createdAt": "2026-06-05T20:00:00",
      "updatedAt": "2026-06-05T20:00:00"
    }
  ]
}
```

### Error Responses

```text
401 Unauthorized - missing or invalid token
```

---

## GET `/communities/{slug}`

Returns one community by slug.

### Optional Headers

```http
Authorization: Bearer <token>
```

If a token is sent, response includes the current user's membership status.

### Response `200 OK`

```json
{
  "id": 1,
  "name": "LA Developers",
  "slug": "la-developers",
  "description": "A community for developers in Los Angeles.",
  "visibility": "PUBLIC",
  "owner": {
    "id": 1,
    "email": "test@example.com",
    "username": "testuser",
    "displayName": "Test User"
  },
  "currentUserIsMember": true,
  "currentUserRole": "MEMBER",
  "createdAt": "2026-06-05T20:00:00",
  "updatedAt": "2026-06-05T20:00:00"
}
```

### Error Responses

```text
404 Not Found - community not found
```

---

## POST `/communities/{communityId}/join`

Joins a public community.

### Headers

```http
Authorization: Bearer <token>
```

### Response `201 Created`

```json
{
  "id": 10,
  "communityId": 1,
  "userId": 2,
  "role": "MEMBER",
  "joinedAt": "2026-06-05T20:00:00"
}
```

### Rules

```text
Only logged-in users can join.
Only PUBLIC communities can be joined at this time.
A user cannot join the same community more than once.
Community owner is already treated as a member.
```

### Error Responses

```text
401 Unauthorized - missing or invalid token
403 Forbidden - community is not public
404 Not Found - community not found
409 Conflict - already a member
```

---

## DELETE `/communities/{communityId}/leave`

Leaves a joined community.

### Headers

```http
Authorization: Bearer <token>
```

### Response `204 No Content`

No response body.

### Rules

```text
A member can leave a joined community.
The OWNER cannot leave their own community.
```

### Error Responses

```text
401 Unauthorized - missing or invalid token
403 Forbidden - owner cannot leave own community
404 Not Found - community or membership not found
```

---

# Posts

## GET `/communities/{communityId}/posts`

Returns active posts for a community.

### Optional Headers

```http
Authorization: Bearer <token>
```

If a token is sent, each post includes whether the current user liked it.

### Response `200 OK`

```json
[
  {
    "id": 1,
    "communityId": 1,
    "author": {
      "id": 1,
      "username": "testuser",
      "displayName": "Test User"
    },
    "content": "Welcome to the community!",
    "likeCount": 3,
    "commentCount": 2,
    "likedByCurrentUser": true,
    "createdAt": "2026-06-05T20:00:00",
    "updatedAt": "2026-06-05T20:00:00"
  }
]
```

### Error Responses

```text
404 Not Found - community not found
```

---

## POST `/communities/{communityId}/posts`

Creates a post in a community.

### Headers

```http
Authorization: Bearer <token>
```

### Request

```json
{
  "content": "Welcome to this community!"
}
```

### Response `201 Created`

```json
{
  "id": 1,
  "communityId": 1,
  "author": {
    "id": 1,
    "username": "testuser",
    "displayName": "Test User"
  },
  "content": "Welcome to this community!",
  "likeCount": 0,
  "commentCount": 0,
  "likedByCurrentUser": false,
  "createdAt": "2026-06-05T20:00:00",
  "updatedAt": "2026-06-05T20:00:00"
}
```

### Rules

```text
Only logged-in community members can create posts.
Community owners are members through OWNER membership.
```

### Validation Rules

```text
content is required
content must be 5000 characters or less
```

### Error Responses

```text
400 Bad Request - validation error
401 Unauthorized - missing or invalid token
403 Forbidden - user is not a community member
404 Not Found - community not found
```

---

## DELETE `/posts/{postId}`

Soft-deletes a post.

### Headers

```http
Authorization: Bearer <token>
```

### Response `204 No Content`

No response body.

### Rules

```text
Post author can delete their own post.
Community owner can delete posts in their community.
Other users cannot delete the post.
Deleted posts are hidden from feeds.
```

### Error Responses

```text
401 Unauthorized - missing or invalid token
403 Forbidden - no permission to delete this post
404 Not Found - post not found
```

---

# Comments

## GET `/posts/{postId}/comments`

Returns active comments for a post.

### Response `200 OK`

```json
[
  {
    "id": 1,
    "postId": 1,
    "author": {
      "id": 1,
      "username": "testuser",
      "displayName": "Test User"
    },
    "content": "Great post!",
    "createdAt": "2026-06-05T20:00:00",
    "updatedAt": "2026-06-05T20:00:00"
  }
]
```

### Error Responses

```text
404 Not Found - post not found
```

---

## POST `/posts/{postId}/comments`

Creates a comment on a post.

### Headers

```http
Authorization: Bearer <token>
```

### Request

```json
{
  "content": "Great post!"
}
```

### Response `201 Created`

```json
{
  "id": 1,
  "postId": 1,
  "author": {
    "id": 1,
    "username": "testuser",
    "displayName": "Test User"
  },
  "content": "Great post!",
  "createdAt": "2026-06-05T20:00:00",
  "updatedAt": "2026-06-05T20:00:00"
}
```

### Rules

```text
Only logged-in community members can comment.
```

### Validation Rules

```text
content is required
content must be 2000 characters or less
```

### Error Responses

```text
400 Bad Request - validation error
401 Unauthorized - missing or invalid token
403 Forbidden - user is not a community member
404 Not Found - post not found
```

---

## DELETE `/comments/{commentId}`

Soft-deletes a comment.

### Headers

```http
Authorization: Bearer <token>
```

### Response `204 No Content`

No response body.

### Rules

```text
Comment author can delete their own comment.
Community owner can delete comments in their community.
Other users cannot delete the comment.
Deleted comments are hidden from comment lists.
```

### Error Responses

```text
401 Unauthorized - missing or invalid token
403 Forbidden - no permission to delete this comment
404 Not Found - comment not found
```

---

# Likes

## POST `/posts/{postId}/likes`

Likes a post.

### Headers

```http
Authorization: Bearer <token>
```

### Response `200 OK`

```json
{
  "postId": 1,
  "likedByCurrentUser": true,
  "likeCount": 1
}
```

### Rules

```text
Only logged-in community members can like posts.
A user can like the same post only once.
Duplicate likes are prevented by application logic and a database unique constraint.
```

### Error Responses

```text
401 Unauthorized - missing or invalid token
403 Forbidden - user is not a community member
404 Not Found - post not found
```

---

## DELETE `/posts/{postId}/likes`

Unlikes a post.

### Headers

```http
Authorization: Bearer <token>
```

### Response `200 OK`

```json
{
  "postId": 1,
  "likedByCurrentUser": false,
  "likeCount": 0
}
```

### Rules

```text
If the user has liked the post, the like is removed.
If the user has not liked the post, the response still returns likedByCurrentUser false.
```

### Error Responses

```text
401 Unauthorized - missing or invalid token
404 Not Found - post not found
```

---

# Common Error Format

Spring Boot currently returns default error responses for many errors.

Example:

```json
{
  "timestamp": "2026-06-05T20:00:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "Community not found",
  "path": "/api/communities/unknown"
}
```

---

# MVP Authorization Rules

```text
Public users can view public communities.
Logged-in users can create communities.
Community creators automatically become OWNER members.
Logged-in users can join public communities.
Members can create posts.
Members can comment.
Members can like posts.
Post authors can delete their posts.
Comment authors can delete their comments.
Community owners can delete posts and comments inside their communities.
Community owners cannot leave their own communities.
Duplicate memberships are prevented.
Duplicate likes are prevented.
```

---

# Future API Improvements

Possible future improvements:

```text
Add profile update endpoints
Add community update/delete endpoints
Add pagination for communities, posts, and comments
Add search endpoints
Add image upload endpoints
Add notification endpoints
Add admin/moderation endpoints
Add standardized error response DTO
Add refresh token flow
Add real Spring Security JWT filter
```
