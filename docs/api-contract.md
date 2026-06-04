# API Contract

## Project Name

Social Community Maker

## Overview

This document describes the initial REST API contract for the MVP version of Social Community Maker.

The API will be built with Spring Boot and will support:

* User registration and login
* JWT authentication
* Current user profile
* Community creation and viewing
* Community membership
* Posts
* Comments
* Likes
* Basic owner/admin moderation

Base URL for local development:

```text
http://localhost:8080/api
```

---

# General API Rules

## Authentication

Protected endpoints require a JWT token in the request header:

```http
Authorization: Bearer <token>
```

## Content Type

Requests with JSON body should use:

```http
Content-Type: application/json
```

## Standard Error Response

Errors should use a consistent format:

```json
{
  "timestamp": "2026-06-03T12:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Email is already in use",
  "path": "/api/auth/register"
}
```

---

# HTTP Status Codes

| Status Code | Meaning                                   |
| ----------: | ----------------------------------------- |
|         200 | OK                                        |
|         201 | Created                                   |
|         204 | No Content                                |
|         400 | Bad Request / validation error            |
|         401 | Unauthorized / missing or invalid token   |
|         403 | Forbidden / user does not have permission |
|         404 | Resource not found                        |
|         409 | Conflict / duplicate resource             |
|         500 | Internal server error                     |

---

# Authentication Endpoints

## Register User

```http
POST /api/auth/register
```

### Description

Creates a new user account.

### Authentication

Not required.

### Request Body

```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "displayName": "John Doe",
  "password": "Password123!"
}
```

### Validation Rules

* Email is required.
* Email must be valid.
* Email must be unique.
* Username is required.
* Username must be unique.
* Display name is required.
* Password is required.
* Password should meet minimum security requirements.

### Success Response

```http
201 Created
```

```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "johndoe",
  "displayName": "John Doe",
  "createdAt": "2026-06-03T12:00:00"
}
```

### Possible Errors

```http
400 Bad Request
409 Conflict
```

---

## Login User

```http
POST /api/auth/login
```

### Description

Authenticates a user and returns a JWT token.

### Authentication

Not required.

### Request Body

```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

### Success Response

```http
200 OK
```

```json
{
  "token": "jwt-token-here",
  "tokenType": "Bearer",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe",
    "displayName": "John Doe"
  }
}
```

### Possible Errors

```http
400 Bad Request
401 Unauthorized
```

---

## Get Current User

```http
GET /api/auth/me
```

### Description

Returns the currently authenticated user.

### Authentication

Required.

### Success Response

```http
200 OK
```

```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "johndoe",
  "displayName": "John Doe",
  "bio": null,
  "avatarUrl": null,
  "createdAt": "2026-06-03T12:00:00"
}
```

### Possible Errors

```http
401 Unauthorized
```

---

# Community Endpoints

## Create Community

```http
POST /api/communities
```

### Description

Creates a new community. The authenticated user becomes the community owner.

### Authentication

Required.

### Request Body

```json
{
  "name": "LA Developers",
  "slug": "la-developers",
  "description": "A community for developers in Los Angeles.",
  "visibility": "PUBLIC"
}
```

### Validation Rules

* Name is required.
* Slug is required.
* Slug must be unique.
* Slug should be URL-friendly.
* Visibility is required.
* Visibility should be one of: `PUBLIC`, `PRIVATE`, `INVITE_ONLY`.

### Success Response

```http
201 Created
```

```json
{
  "id": 1,
  "name": "LA Developers",
  "slug": "la-developers",
  "description": "A community for developers in Los Angeles.",
  "visibility": "PUBLIC",
  "owner": {
    "id": 1,
    "username": "johndoe",
    "displayName": "John Doe"
  },
  "createdAt": "2026-06-03T12:00:00"
}
```

### Possible Errors

```http
400 Bad Request
401 Unauthorized
409 Conflict
```

---

## Get All Public Communities

```http
GET /api/communities
```

### Description

Returns a list of public communities.

### Authentication

Not required.

### Query Parameters

| Name | Required | Description |
| ---- | -------: | ----------- |
| page |       No | Page number |
| size |       No | Page size   |
| sort |       No | Sort field  |

Example:

```http
GET /api/communities?page=0&size=10
```

### Success Response

```http
200 OK
```

```json
{
  "content": [
    {
      "id": 1,
      "name": "LA Developers",
      "slug": "la-developers",
      "description": "A community for developers in Los Angeles.",
      "visibility": "PUBLIC",
      "memberCount": 12,
      "postCount": 35,
      "createdAt": "2026-06-03T12:00:00"
    }
  ],
  "page": 0,
  "size": 10,
  "totalElements": 1,
  "totalPages": 1
}
```

---

## Get Community by Slug

```http
GET /api/communities/{slug}
```

### Description

Returns a community by its slug.

### Authentication

Not required for public communities. Required for private communities.

### Success Response

```http
200 OK
```

```json
{
  "id": 1,
  "name": "LA Developers",
  "slug": "la-developers",
  "description": "A community for developers in Los Angeles.",
  "visibility": "PUBLIC",
  "owner": {
    "id": 1,
    "username": "johndoe",
    "displayName": "John Doe"
  },
  "memberCount": 12,
  "postCount": 35,
  "currentUserMembership": {
    "isMember": true,
    "role": "OWNER"
  },
  "createdAt": "2026-06-03T12:00:00"
}
```

### Possible Errors

```http
403 Forbidden
404 Not Found
```

---

## Update Community

```http
PUT /api/communities/{communityId}
```

### Description

Updates basic community information.

### Authentication

Required.

### Authorization

Only the community owner or admin can update the community.

### Request Body

```json
{
  "name": "LA Software Developers",
  "description": "A community for software developers in Los Angeles.",
  "visibility": "PUBLIC"
}
```

### Success Response

```http
200 OK
```

```json
{
  "id": 1,
  "name": "LA Software Developers",
  "slug": "la-developers",
  "description": "A community for software developers in Los Angeles.",
  "visibility": "PUBLIC",
  "updatedAt": "2026-06-03T12:30:00"
}
```

### Possible Errors

```http
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
```

---

## Join Community

```http
POST /api/communities/{communityId}/join
```

### Description

Adds the authenticated user as a member of a community.

### Authentication

Required.

### MVP Rule

For MVP, users can join public communities only.

### Success Response

```http
201 Created
```

```json
{
  "id": 1,
  "communityId": 1,
  "userId": 2,
  "role": "MEMBER",
  "joinedAt": "2026-06-03T12:00:00"
}
```

### Possible Errors

```http
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
```

---

## Leave Community

```http
DELETE /api/communities/{communityId}/leave
```

### Description

Removes the authenticated user from a community.

### Authentication

Required.

### MVP Rule

Community owners cannot leave their own community unless ownership transfer is added in the future.

### Success Response

```http
204 No Content
```

### Possible Errors

```http
401 Unauthorized
403 Forbidden
404 Not Found
```

---

## Get My Communities

```http
GET /api/communities/me
```

### Description

Returns communities owned or joined by the authenticated user.

### Authentication

Required.

### Success Response

```http
200 OK
```

```json
{
  "ownedCommunities": [
    {
      "id": 1,
      "name": "LA Developers",
      "slug": "la-developers",
      "role": "OWNER",
      "memberCount": 12
    }
  ],
  "joinedCommunities": [
    {
      "id": 2,
      "name": "React Builders",
      "slug": "react-builders",
      "role": "MEMBER",
      "memberCount": 45
    }
  ]
}
```

---

## Get Community Members

```http
GET /api/communities/{communityId}/members
```

### Description

Returns members of a community.

### Authentication

Required.

### Authorization

User must be a community member.

### Success Response

```http
200 OK
```

```json
[
  {
    "id": 1,
    "user": {
      "id": 1,
      "username": "johndoe",
      "displayName": "John Doe"
    },
    "role": "OWNER",
    "joinedAt": "2026-06-03T12:00:00"
  }
]
```

---

# Post Endpoints

## Create Post

```http
POST /api/communities/{communityId}/posts
```

### Description

Creates a post inside a community.

### Authentication

Required.

### Authorization

User must be a member of the community.

### Request Body

```json
{
  "content": "Hello everyone! Welcome to the community."
}
```

### Validation Rules

* Content is required.
* Content cannot be blank.
* Content should have a maximum length.

### Success Response

```http
201 Created
```

```json
{
  "id": 1,
  "communityId": 1,
  "author": {
    "id": 1,
    "username": "johndoe",
    "displayName": "John Doe"
  },
  "content": "Hello everyone! Welcome to the community.",
  "likeCount": 0,
  "commentCount": 0,
  "likedByCurrentUser": false,
  "createdAt": "2026-06-03T12:00:00",
  "updatedAt": "2026-06-03T12:00:00"
}
```

### Possible Errors

```http
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
```

---

## Get Community Feed

```http
GET /api/communities/{communityId}/posts
```

### Description

Returns posts for a community feed, newest first.

### Authentication

Required for private communities. Public communities may be readable by guests depending on final MVP decision.

### Query Parameters

| Name | Required | Description |
| ---- | -------: | ----------- |
| page |       No | Page number |
| size |       No | Page size   |

Example:

```http
GET /api/communities/1/posts?page=0&size=20
```

### Success Response

```http
200 OK
```

```json
{
  "content": [
    {
      "id": 1,
      "communityId": 1,
      "author": {
        "id": 1,
        "username": "johndoe",
        "displayName": "John Doe"
      },
      "content": "Hello everyone! Welcome to the community.",
      "likeCount": 3,
      "commentCount": 2,
      "likedByCurrentUser": true,
      "createdAt": "2026-06-03T12:00:00",
      "updatedAt": "2026-06-03T12:00:00"
    }
  ],
  "page": 0,
  "size": 20,
  "totalElements": 1,
  "totalPages": 1
}
```

---

## Get Post by ID

```http
GET /api/posts/{postId}
```

### Description

Returns one post by ID.

### Authentication

Required if the post belongs to a private community.

### Success Response

```http
200 OK
```

```json
{
  "id": 1,
  "communityId": 1,
  "author": {
    "id": 1,
    "username": "johndoe",
    "displayName": "John Doe"
  },
  "content": "Hello everyone! Welcome to the community.",
  "likeCount": 3,
  "commentCount": 2,
  "likedByCurrentUser": true,
  "createdAt": "2026-06-03T12:00:00",
  "updatedAt": "2026-06-03T12:00:00"
}
```

### Possible Errors

```http
401 Unauthorized
403 Forbidden
404 Not Found
```

---

## Delete Post

```http
DELETE /api/posts/{postId}
```

### Description

Deletes a post.

### Authentication

Required.

### Authorization

Allowed users:

* Post author
* Community owner
* Community admin

### Success Response

```http
204 No Content
```

### Possible Errors

```http
401 Unauthorized
403 Forbidden
404 Not Found
```

---

# Comment Endpoints

## Create Comment

```http
POST /api/posts/{postId}/comments
```

### Description

Creates a comment on a post.

### Authentication

Required.

### Authorization

User must be a member of the community where the post belongs.

### Request Body

```json
{
  "content": "Great post!"
}
```

### Success Response

```http
201 Created
```

```json
{
  "id": 1,
  "postId": 1,
  "author": {
    "id": 2,
    "username": "janedoe",
    "displayName": "Jane Doe"
  },
  "content": "Great post!",
  "createdAt": "2026-06-03T12:10:00",
  "updatedAt": "2026-06-03T12:10:00"
}
```

### Possible Errors

```http
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
```

---

## Get Comments for Post

```http
GET /api/posts/{postId}/comments
```

### Description

Returns comments for a post.

### Authentication

Required if the post belongs to a private community.

### Success Response

```http
200 OK
```

```json
[
  {
    "id": 1,
    "postId": 1,
    "author": {
      "id": 2,
      "username": "janedoe",
      "displayName": "Jane Doe"
    },
    "content": "Great post!",
    "createdAt": "2026-06-03T12:10:00",
    "updatedAt": "2026-06-03T12:10:00"
  }
]
```

---

## Delete Comment

```http
DELETE /api/comments/{commentId}
```

### Description

Deletes a comment.

### Authentication

Required.

### Authorization

Allowed users:

* Comment author
* Community owner
* Community admin

### Success Response

```http
204 No Content
```

### Possible Errors

```http
401 Unauthorized
403 Forbidden
404 Not Found
```

---

# Like Endpoints

## Like Post

```http
POST /api/posts/{postId}/likes
```

### Description

Likes a post.

### Authentication

Required.

### Authorization

User must be a member of the community where the post belongs.

### Success Response

```http
201 Created
```

```json
{
  "postId": 1,
  "likedByCurrentUser": true,
  "likeCount": 4
}
```

### Possible Errors

```http
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
```

---

## Unlike Post

```http
DELETE /api/posts/{postId}/likes
```

### Description

Removes the authenticated user's like from a post.

### Authentication

Required.

### Success Response

```http
200 OK
```

```json
{
  "postId": 1,
  "likedByCurrentUser": false,
  "likeCount": 3
}
```

### Possible Errors

```http
401 Unauthorized
403 Forbidden
404 Not Found
```

---

# Dashboard Endpoint

## Get Dashboard

```http
GET /api/dashboard
```

### Description

Returns summary data for the logged-in user's dashboard.

### Authentication

Required.

### Success Response

```http
200 OK
```

```json
{
  "user": {
    "id": 1,
    "username": "johndoe",
    "displayName": "John Doe"
  },
  "stats": {
    "ownedCommunities": 1,
    "joinedCommunities": 2,
    "totalPosts": 15
  },
  "ownedCommunities": [
    {
      "id": 1,
      "name": "LA Developers",
      "slug": "la-developers",
      "memberCount": 12,
      "postCount": 35
    }
  ],
  "joinedCommunities": [
    {
      "id": 2,
      "name": "React Builders",
      "slug": "react-builders",
      "memberCount": 45,
      "postCount": 100
    }
  ]
}
```

---

# Request DTO Names

Suggested backend DTO names:

```text
RegisterRequest
LoginRequest
AuthResponse
UserResponse

CreateCommunityRequest
UpdateCommunityRequest
CommunityResponse
CommunitySummaryResponse
CommunityMemberResponse

CreatePostRequest
PostResponse

CreateCommentRequest
CommentResponse

LikeResponse
DashboardResponse
```

---

# Authorization Rules Summary

| Resource  | Action            | Allowed Users                     |
| --------- | ----------------- | --------------------------------- |
| User      | Register          | Anyone                            |
| User      | Login             | Anyone                            |
| User      | View current user | Authenticated user                |
| Community | Create            | Authenticated user                |
| Community | View public       | Anyone                            |
| Community | View private      | Members only                      |
| Community | Update            | Owner/Admin                       |
| Community | Join public       | Authenticated user                |
| Community | Leave             | Member, except owner              |
| Post      | Create            | Community member                  |
| Post      | View              | Community member or public viewer |
| Post      | Delete            | Author, owner, admin              |
| Comment   | Create            | Community member                  |
| Comment   | View              | Community member or public viewer |
| Comment   | Delete            | Author, owner, admin              |
| Like      | Create/delete     | Community member                  |

---

# MVP Endpoint Summary

```text
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

POST   /api/communities
GET    /api/communities
GET    /api/communities/{slug}
PUT    /api/communities/{communityId}
POST   /api/communities/{communityId}/join
DELETE /api/communities/{communityId}/leave
GET    /api/communities/me
GET    /api/communities/{communityId}/members

POST   /api/communities/{communityId}/posts
GET    /api/communities/{communityId}/posts
GET    /api/posts/{postId}
DELETE /api/posts/{postId}

POST   /api/posts/{postId}/comments
GET    /api/posts/{postId}/comments
DELETE /api/comments/{commentId}

POST   /api/posts/{postId}/likes
DELETE /api/posts/{postId}/likes

GET    /api/dashboard
```

---

# Future API Ideas

The following endpoints are not required for MVP.

## Image Uploads

```text
POST /api/posts/{postId}/images
POST /api/users/me/avatar
POST /api/communities/{communityId}/logo
```

## Notifications

```text
GET  /api/notifications
PUT  /api/notifications/{notificationId}/read
```

## Reports and Moderation

```text
POST /api/reports
GET  /api/communities/{communityId}/reports
PUT  /api/reports/{reportId}/resolve
```

## AI Features

```text
POST /api/ai/communities/{communityId}/rules
POST /api/ai/posts/{postId}/summary
POST /api/ai/moderation/check
```

## Invite Links

```text
POST /api/communities/{communityId}/invites
GET  /api/invites/{token}
POST /api/invites/{token}/accept
```

---

# MVP Design Decision

The MVP API should stay simple.

The first API version should focus on:

```text
Authentication
Communities
Membership
Posts
Comments
Likes
Dashboard
```

Advanced features like images, AI, notifications, payments, custom domains, and chat should be added only after the core MVP is working.
