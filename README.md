# Campus Placement Portal

Java full-stack campus-placement project: a React frontend backed by a Spring Boot REST API.

## Stack

- Java 21, Spring Boot, Spring Data JPA, Spring Security
- H2 for local development; PostgreSQL profile for deployment
- React, TypeScript, Vite, TanStack Router and React Query

## Run locally

Start the backend:

```powershell
mvn spring-boot:run
```

In another terminal, start the frontend:

```powershell
npm run dev
```

The frontend proxies `/api` requests to `http://localhost:8080`.

## PostgreSQL

Create a `campus_placement` database, then run:

```powershell
$env:SPRING_PROFILES_ACTIVE="postgres"
$env:DATABASE_URL="jdbc:postgresql://localhost:5432/campus_placement"
$env:DATABASE_USERNAME="postgres"
$env:DATABASE_PASSWORD="your-password"
mvn spring-boot:run
```

## API

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/auth/register` | Register a student or recruiter |
| POST | `/api/auth/login` | Start an HTTP-only session |
| POST | `/api/auth/logout` | End the session |
| GET | `/api/jobs` | List jobs |
| POST | `/api/jobs` | Create a job (recruiter) |
| PUT | `/api/jobs/{id}` | Update a job (recruiter) |
| DELETE | `/api/jobs/{id}` | Delete a job (recruiter) |
| GET/PUT | `/api/profile` | Read or update the signed-in student's profile |
| GET/POST/DELETE | `/api/applications` | Manage the signed-in student's applications |

Passwords are BCrypt-hashed; applications are server-side records constrained to the signed-in student.
