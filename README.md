# Social Community Maker by Deividas Strole

Social Community Maker is a full-stack social community platform built with React, TypeScript, Spring Boot, PostgreSQL, and JWT authentication.

The project allows users to create communities, join public communities, publish posts, comment, like posts, and manage their activity through a dashboard.

## Project Status

MVP in progress.

Completed MVP features:

* User registration
* User login
* JWT authentication
* Protected dashboard route
* Create communities
* Browse public communities
* Join and leave public communities
* Owned and joined communities dashboard
* Community detail pages
* Create posts
* Delete posts as author or community owner
* Add comments to posts
* Delete comments as author or community owner
* Like and unlike posts
* Shared navigation/layout
* Polished home, dashboard, browse, and community pages
* PostgreSQL local development setup
* GitHub Pages frontend deployment

## Live Frontend

The frontend is deployed to GitHub Pages:

```text
https://deividas-strole.github.io/social-community-maker/
```

Because the app uses hash-based routing for GitHub Pages, deployed routes look like this:

```text
https://deividas-strole.github.io/social-community-maker/#/
https://deividas-strole.github.io/social-community-maker/#/communities
https://deividas-strole.github.io/social-community-maker/#/login
https://deividas-strole.github.io/social-community-maker/#/register
```

## Live Deployment

Frontend:

https://deividas-strole.github.io/social-community-maker/#/

Backend:

https://social-community-maker-backend.onrender.com

Health check:

https://social-community-maker-backend.onrender.com/api/health

Database:

Hosted PostgreSQL database on Neon

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* React Router
* Axios
* Tailwind CSS
* GitHub Pages

### Backend

* Java
* Spring Boot
* Spring Web
* Spring Data JPA
* Spring Security
* JWT
* PostgreSQL

## Main Features

### Authentication

Users can register, log in, and access protected pages using JWT authentication.

### Communities

Users can create communities with custom names, slugs, descriptions, and visibility settings.

Users can browse public communities and join or leave them.

### Dashboard

The dashboard shows:

* Owned communities
* Joined communities
* Community activity summary
* Quick actions to create or browse communities

### Posts

Community members can create posts inside communities. Post authors and community owners can delete posts.

### Comments

Community members can comment on posts. Comment authors and community owners can delete comments.

### Likes

Community members can like and unlike posts. The app prevents duplicate likes and displays like counts.

## Local Development

### Backend

Open the backend project in IntelliJ IDEA.

Run:

```cmd
cd backend
mvnw.cmd spring-boot:run
```

Backend runs on:

```text
http://localhost:8080
```

Health check:

```text
http://localhost:8080/api/health
```

### Frontend

Open the frontend project in WebStorm.

Run:

```cmd
cd frontend
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

## Local PostgreSQL Setup

The backend uses PostgreSQL for local development.

Default local database:

```text
Database: socialcommunitymaker
Host: localhost
Port: 5432
Username: postgres
```

Create the database:

```cmd
psql -U postgres
```

Then inside PostgreSQL:

```sql
CREATE DATABASE socialcommunitymaker;
```

Exit PostgreSQL:

```sql
\q
```

## Environment Variables

### Backend Environment Variables

The Spring Boot backend uses the following environment variables:

```text
POSTGRES_USER
POSTGRES_PASSWORD
POSTGRES_DB
POSTGRES_HOST
POSTGRES_PORT
JWT_SECRET
FRONTEND_URL
PORT
```

Local defaults are provided where safe.

Example backend configuration:

```properties
spring.datasource.url=jdbc:postgresql://${POSTGRES_HOST:localhost}:${POSTGRES_PORT:5432}/${POSTGRES_DB:socialcommunitymaker}
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

## Build Commands

### Backend

```cmd
cd backend
mvnw.cmd clean package
```

### Frontend

```cmd
cd frontend
npm run build
```

## Frontend Deployment

The frontend is deployed with GitHub Actions from:

```text
.github/workflows/deploy-frontend.yml
```

GitHub Pages is configured through:

```text
Repository Settings → Pages → Source: GitHub Actions
```

The frontend uses hash-based routing so routes work correctly on GitHub Pages.

## Backend Deployment Pending

The backend is not deployed yet.

Planned backend deployment tasks:

* Deploy Spring Boot backend
* Deploy PostgreSQL database
* Configure backend environment variables
* Configure frontend `VITE_API_BASE_URL`
* Configure backend `FRONTEND_URL` for CORS
* Test deployed register/login flow
* Test deployed communities, posts, comments, and likes

## Security Notes

Do not commit real passwords, production JWT secrets, database URLs, or private credentials to GitHub.

Use local environment variables for development and hosting provider environment variables for production.

## Future Improvements

Planned improvements:

* Real JWT filter/security context
* Profile pages
* Community admin tools
* Edit/delete community settings
* Comment count optimization
* Pagination for feeds
* Search communities
* Image uploads
* Notifications
* Backend deployment
* Production PostgreSQL deployment
* Flyway or Liquibase database migrations

## Connect

* [Deividas Strole](https://deividasstrole.com)
* [LinkedIn](https://linkedin.com/in/deividas-strole)
* [YouTube](https://youtube.com/@deividas-strole)
* [Dev.to](https://dev.to/deividas-strole)
* [Medium](https://medium.com/@deividas-strole)
* [X](https://x.com/deividasstrole)
* [Lake Apps](https://lakeapps.com)
  
If you enjoyed this project, consider starring the repository to support the work of **Deividas Strole**.

© Deividas Strole. All rights reserved.
