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

## Local PostgreSQL Setup

The backend uses PostgreSQL for local development.

Default local database:

Database: socialcommunitymaker
Host: localhost
Port: 5432
Username: postgres

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


Open the backend project in IntelliJ IDEA.

Run:

mvnw.cmd spring-boot:run

Backend runs on:

http://localhost:8080

Health check:

http://localhost:8080/api/health

Frontend

Open the frontend project in WebStorm.

Run the Vite dev script:

npm run dev

Frontend runs on:

http://localhost:5173

Development Database

The project currently uses H2 for local development.

The app is designed so it can later be moved to PostgreSQL for a more production-like setup.

## Deployment Configuration

Social Community Maker is prepared for deployment using environment variables for database, security, backend URL, frontend URL, and port configuration.

### Backend Environment Variables

The Spring Boot backend uses the following environment variables:

```text
POSTGRES_USER
POSTGRES_PASSWORD
JWT_SECRET
FRONTEND_URL
PORT
```

Local defaults are provided where safe.

Example local backend configuration:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/socialcommunitymaker
spring.datasource.username=${POSTGRES_USER:postgres}
spring.datasource.password=${POSTGRES_PASSWORD}
spring.datasource.driver-class-name=org.postgresql.Driver

server.port=${PORT:8080}

app.frontend-url=${FRONTEND_URL:http://localhost:5173}
app.jwt.secret=${JWT_SECRET:change-this-secret-key-change-this-secret-key-change-this-secret-key}
```

`POSTGRES_PASSWORD` should be set locally and should never be committed to GitHub.

On Windows:

```cmd
setx POSTGRES_PASSWORD "your-local-postgres-password"
setx POSTGRES_USER "postgres"
```

After setting environment variables, restart the terminal or restart IntelliJ.

### Frontend Environment Variables

The React/Vite frontend uses:

```text
VITE_API_BASE_URL
```

Local example:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

For deployment, this should point to the deployed backend API URL.

Example:

```env
VITE_API_BASE_URL=https://your-backend-domain.com/api
```

### Local Build Commands

Backend:

```cmd
cd backend
mvnw.cmd clean package
```

Frontend:

```cmd
cd frontend
npm run build
```

### Security Notes

Do not commit real passwords, production JWT secrets, database URLs, or private credentials to GitHub.

Use hosting provider environment variables for production values.


Future Improvements

Planned improvements:

Real JWT filter/security context
Profile pages
Community admin tools
Edit/delete community settings
Comment count optimization
Pagination for feeds
Search communities
Image uploads
Notifications
Deployment

📫 Connect

- [Deividas Strole](https://deividasstrole.com)
- [LinkedIn](https://linkedin.com/in/deividas-strole)
- [YouTube](https://youtube.com/@deividas-strole)
- [Dev.to](https://dev.to/deividas-strole)
- [Medium](https://medium.com/@deividas-strole)
- [X](https://x.com/deividasstrole)

⭐ If you enjoyed this project, consider starring the repository to support the work of **Deividas Strole**!

© Deividas Strole. All rights reserved.
