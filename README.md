# Social Community Maker by Deividas Strole

Social Community Maker is a full-stack social community platform built with React, TypeScript, Spring Boot, and JWT authentication.

The project allows users to create communities, join public communities, publish posts, comment, like posts, and manage their activity through a dashboard.

## Project Status

MVP in progress.

Completed MVP features:

- User registration
- User login
- JWT authentication
- Protected dashboard route
- Create communities
- Browse public communities
- Join and leave public communities
- Owned and joined communities dashboard
- Community detail pages
- Create posts
- Delete posts as author or community owner
- Add comments to posts
- Delete comments as author or community owner
- Like and unlike posts
- Shared navigation/layout
- Polished home, dashboard, browse, and community pages

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- Axios
- Tailwind CSS

### Backend

- Java
- Spring Boot
- Spring Web
- Spring Data JPA
- Spring Security
- JWT
- H2 database for development
- PostgreSQL-ready architecture

## Main Features

### Authentication

Users can register, log in, and access protected pages using JWT authentication.

### Communities

Users can create communities with custom names, slugs, descriptions, and visibility settings.

Users can browse public communities and join or leave them.

### Dashboard

The dashboard shows:

- Owned communities
- Joined communities
- Community activity summary
- Quick actions to create or browse communities

### Posts

Community members can create posts inside communities. Post authors and community owners can delete posts.

### Comments

Community members can comment on posts. Comment authors and community owners can delete comments.

### Likes

Community members can like and unlike posts. The app prevents duplicate likes and displays like counts.

## Current Routes

### Frontend Routes

```text
/
 /register
 /login
 /dashboard
 /communities
 /communities/:slug
 /create-community
