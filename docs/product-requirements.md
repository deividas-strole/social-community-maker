# Product Requirements Document

## Project Name

Social Community Maker

## Project Summary

Social Community Maker is a full-stack SaaS-style web application that allows users to create, customize, and manage their own online social communities.

The platform allows registered users to create communities, invite or accept members, publish posts, comment on posts, like content, and manage basic community settings.

## Problem Statement

Many people, small organizations, creators, and interest groups want to create online communities but do not want to build a custom social media platform from scratch.

Existing social platforms are often too general, too restrictive, or not customizable enough for smaller niche communities.

Social Community Maker solves this by providing a simple platform where users can launch their own community space with basic social features.

## Target Users

### Guest Visitor

A user who is not logged in. Guest visitors may view public communities and register for an account.

### Registered User

A user with an account. Registered users can create communities, join communities, and participate in discussions.

### Community Member

A registered user who has joined a specific community. Members can create posts, comment, and like content.

### Community Owner

The user who creates a community. The owner can manage community settings, members, and moderate posts.

### Community Admin

A trusted member who can help moderate the community.

### Platform Admin

The application owner or system administrator who can manage the overall platform.

## Product Goals

- Allow users to create online communities.
- Allow users to join communities.
- Allow community members to create posts.
- Allow members to comment on posts.
- Allow members to like and unlike posts.
- Allow community owners to manage their communities.
- Provide a clean, responsive React frontend.
- Provide a secure Spring Boot REST API backend.
- Use PostgreSQL for persistent data storage.
- Build a professional portfolio-quality full-stack application.

## MVP Scope

The first version of the application will include the core features needed for a working community platform.

### MVP Features

- User registration
- User login
- JWT authentication
- Current user profile endpoint
- Create community
- View community by slug
- Join community
- View user dashboard
- View communities joined or owned by the user
- Create posts inside a community
- View community feed
- Comment on posts
- Like and unlike posts
- Basic community owner moderation
- Responsive frontend layout

## Out of Scope for MVP

The following features are planned for later versions and will not be included in the first MVP:

- Image uploads
- Real-time chat
- Real-time notifications
- AI moderation
- AI post summaries
- Payments or subscriptions
- Custom domains
- Advanced analytics
- Mobile app
- Email invitations
- Password reset
- Advanced role permissions
- Dark mode
- Search
- Hashtags
- Direct messages

## Main User Flows

### User Registration and Login

1. Guest visitor opens the application.
2. User creates an account.
3. User logs in.
4. User is redirected to the dashboard.

### Create Community

1. Logged-in user clicks "Create Community."
2. User enters community name, slug, and description.
3. System creates the community.
4. Creator becomes the community owner.
5. User is redirected to the new community page.

### Join Community

1. Logged-in user opens a public community.
2. User clicks "Join Community."
3. System adds the user as a community member.
4. User can now post, comment, and like content.

### Create Post

1. Community member opens a community page.
2. Member writes a post.
3. System saves the post.
4. New post appears in the community feed.

### Comment on Post

1. Community member opens a post or feed.
2. Member writes a comment.
3. System saves the comment.
4. Comment appears under the post.

### Like Post

1. Community member clicks the like button.
2. System records the like.
3. Like count increases.
4. User can unlike the post later.

## Functional Requirements

### Authentication

- Users must be able to register.
- Users must be able to log in.
- Passwords must be hashed before being stored.
- Authenticated API requests must use JWT.
- Protected routes must require authentication.

### Communities

- Logged-in users must be able to create communities.
- Each community must have a unique slug.
- Community creator must automatically become the owner.
- Users must be able to view public communities.
- Users must be able to join public communities.
- Community owners must be able to update basic community information.

### Posts

- Community members must be able to create posts.
- Posts must belong to one community.
- Posts must have one author.
- Empty posts must not be allowed.
- Posts must display newest first.
- Post authors must be able to delete their own posts.
- Community owners must be able to delete posts in their community.

### Comments

- Community members must be able to comment on posts.
- Comments must belong to one post.
- Comments must have one author.
- Empty comments must not be allowed.
- Comment authors must be able to delete their own comments.
- Community owners must be able to delete inappropriate comments.

### Likes

- Community members must be able to like posts.
- Users must not be able to like the same post more than once.
- Users must be able to unlike posts.
- Like count must display correctly.

### Dashboard

- Logged-in users must have a dashboard.
- Dashboard must show communities owned by the user.
- Dashboard must show communities joined by the user.
- Dashboard must include a link to create a new community.

## Non-Functional Requirements

### Security

- Passwords must never be stored in plain text.
- JWT secret must be stored in environment variables.
- Protected backend endpoints must require authentication.
- Users must not be allowed to modify resources they do not own or manage.

### Performance

- Community feeds should load efficiently.
- Backend should support pagination for posts in future versions.
- API responses should avoid unnecessary data.

### Usability

- UI should be clean and easy to understand.
- Forms should show validation errors.
- Application should work on desktop and mobile screen sizes.

### Maintainability

- Backend code should be organized by feature.
- Frontend code should be organized by feature/page/component.
- API contracts should be documented.
- Database model should be documented.

## Suggested Tech Stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Axios or React Query
- React Hook Form
- Zod

### Backend

- Java
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- PostgreSQL
- JWT Authentication
- REST API

### Tools

- Git
- GitHub
- GitHub Issues
- GitHub Projects
- Postman
- IntelliJ IDEA
- Docker planned for later

## Success Criteria

The MVP is successful when:

- A user can register and log in.
- A logged-in user can create a community.
- A user can join a community.
- A community member can create a post.
- A community member can comment on a post.
- A community member can like and unlike a post.
- A community owner can delete inappropriate posts.
- The frontend communicates with the backend API.
- The project can be shown as a professional portfolio project.

## Future Enhancements

- Image uploads for posts and profiles
- Community branding customization
- Invite links
- Notifications
- Real-time chat
- AI-generated community rules
- AI post summaries
- AI moderation
- Analytics dashboard
- Custom domain support
- Subscription/payment system
- Advanced search
- User profile pages
- Email verification
- Password reset
- Deployment with Docker