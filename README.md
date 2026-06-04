# Social Community Maker

**Social Community Maker** is a full-stack SaaS-style web application that allows users to create, customize, and manage their own online social communities.

The project is built with **React**, **Spring Boot**, and **PostgreSQL**, with planned support for authentication, community creation, posts, comments, likes, roles, moderation, and admin dashboards.

## Project Status

🚧 **Status:** In Development

This project is currently in the planning and early development stage.

## Project Goal

The goal of Social Community Maker is to provide a platform where users can launch their own custom online communities without building a social media platform from scratch.

Example use cases include:

* Developer communities
* Fitness communities
* Real estate groups
* Student groups
* Local city communities
* Private business communities
* Hobby and interest-based groups

## Core Features

### Planned MVP Features

* User registration and login
* JWT-based authentication
* Create and manage communities
* Join public or private communities
* Create posts inside communities
* Comment on posts
* Like and unlike posts
* View community members
* Community owner/admin role
* Basic moderation tools
* Responsive React frontend
* REST API backend with Spring Boot

### Future Features

* Image uploads
* Community branding customization
* Invite links
* Notifications
* Real-time chat or live updates
* AI-generated community rules
* AI post summaries
* AI moderation support
* Analytics dashboard
* Custom domain support
* Subscription/payment system

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* React Router
* Tailwind CSS
* React Query
* Axios
* React Hook Form
* Zod

### Backend

* Java
* Spring Boot
* Spring Security
* JWT Authentication
* Spring Data JPA
* Hibernate
* PostgreSQL
* REST API

### Tools

* Git
* GitHub
* Postman
* IntelliJ IDEA
* VS Code
* Docker planned for future setup

## Planned Project Structure

```text
social-community-maker/
├── backend/
│   └── Spring Boot application
├── frontend/
│   └── React application
├── docs/
│   ├── product-requirements.md
│   ├── database-model.md
│   └── api-contract.md
├── README.md
└── .gitignore
```

## Main User Roles

```text
Platform Admin
Community Owner
Community Admin
Community Member
Guest Visitor
```

## Main Entities

```text
User
Community
CommunityMember
Post
Comment
PostLike
Role
Notification
Report
```

## Planned API Examples

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
```

### Communities

```text
POST /api/communities
GET /api/communities
GET /api/communities/{slug}
PUT /api/communities/{id}
POST /api/communities/{id}/join
```

### Posts

```text
POST /api/communities/{communityId}/posts
GET /api/communities/{communityId}/posts
GET /api/posts/{postId}
DELETE /api/posts/{postId}
```

### Comments

```text
POST /api/posts/{postId}/comments
GET /api/posts/{postId}/comments
DELETE /api/comments/{commentId}
```

### Likes

```text
POST /api/posts/{postId}/likes
DELETE /api/posts/{postId}/likes
```

## MVP Development Plan

1. Create planning documents
2. Set up GitHub repository
3. Create Spring Boot backend
4. Configure PostgreSQL database
5. Create backend entities and repositories
6. Build authentication with JWT
7. Create community CRUD endpoints
8. Create membership system
9. Create posts, comments, and likes
10. Test backend APIs with Postman
11. Create React frontend
12. Build login and registration pages
13. Build dashboard and community pages
14. Connect frontend to backend APIs
15. Add basic admin/moderation features
16. Deploy backend and frontend
17. Add project case study to portfolio

## Local Development

Local setup instructions will be added as the project is developed.

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Example environment variables will be added later.

```text
DATABASE_URL=
DATABASE_USERNAME=
DATABASE_PASSWORD=
JWT_SECRET=
```

## Author

**Deividas Strole**

* Website: https://DeividasStrole.com
* GitHub: https://github.com/deividas-strole
* LinkedIn: https://linkedin.com/in/deividas-strole
* YouTube: https://youtube.com/@deividas-strole

## License

This project is planned as an open-source portfolio project. License information will be added later.
