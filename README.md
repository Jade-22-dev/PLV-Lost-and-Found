# IntegrITy Backend

![Node.js](https://img.shields.io/badge/Node.js-20.19%2B-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white)
![Status](https://img.shields.io/badge/status-in%20development-orange)

RESTful API for **IntegrITy**, the Campus Lost & Found System of Pamantasan ng Lungsod ng Valenzuela (PLV), serving the Maysan, Annex, and CPAG campuses. The system allows students, faculty, and administrators to report lost items, log found items, and file and process claims, all backed by a normalized MySQL database.

> **Project status:** Under active development. The admin module (registration and request validation) is implemented. The remaining modules are scaffolded and tracked in the [Roadmap](#roadmap).

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Database](#database)
- [API Reference](#api-reference)
- [Error Handling](#error-handling)
- [Roadmap](#roadmap)
- [Known Limitations](#known-limitations)
- [Development Workflow](#development-workflow)
- [License](#license)

## Features

- Admin registration gated by a pre-approved list of admin numbers
- Password hashing with bcrypt (12 salt rounds)
- Schema-based request validation with Zod
- Centralized error handling with a consistent JSON error format
- Transactional multi-table writes for data integrity
- Normalized relational schema covering users, academic structure, items, reports, images, and claims
- Cloudinary integration prepared for item image storage

## Tech Stack

| Layer | Technology |
| --- | --- |
| Runtime | Node.js (ES Modules) |
| Language | TypeScript 5.9 |
| Framework | Express 5 |
| Database | MySQL via `mysql2/promise` (connection pool) |
| Validation | Zod 4 |
| Authentication | bcrypt, jsonwebtoken |
| File handling | Multer, Cloudinary |
| Tooling | tsx, ESLint 10, typescript-eslint |

## Architecture

Each feature module follows a layered design:

```
Request → Routes → Controller → Service → Repository → MySQL
```

| Layer | Responsibility |
| --- | --- |
| **Routes** | Map HTTP endpoints to controller handlers |
| **Controller** | Validate input with Zod and shape the HTTP response |
| **Service** | Enforce business rules; throw `AppError` on failure |
| **Repository** | Run parameterized SQL queries and manage transactions |

## Getting Started

### Prerequisites

- Node.js **20.19 or later**
- MySQL **8.0 or later**
- A Cloudinary account (required once image upload is enabled)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Jade-22-dev/PLV-Lost-and-Found.git
cd PLV-Lost-and-Found

# 2. Install dependencies
npm install

# 3. Create the database and tables
mysql -u <user> -p < database/schema.sql

# 4. Create your .env file from the template, then fill in the values
cp .env.example .env

# 5. Start the development server
npm run dev
```

The API is served at `http://localhost:5000` by default.

> **Warning:** `database/schema.sql` begins with `DROP DATABASE IF EXISTS plvIntegrity;`. Running it deletes all existing data in that database. Do not run it against production.

### Required seed data

Registration looks up departments by code and only accepts pre-approved admin numbers. Insert the following before testing:

```sql
USE plvIntegrity;

INSERT INTO departments (department_code, department_name) VALUES
  ('CEIT', 'College of Engineering and Information Technology'),
  ('COED', 'College of Education'),
  ('CABA', 'College of Accountancy and Business Administration'),
  ('CAS',  'College of Arts and Sciences'),
  ('CPAG', 'College of Public Administration and Governance');

INSERT INTO allowed_admin_numbers (admin_number, full_name)
VALUES ('ADMIN-0001', 'Juan Dela Cruz');
```

## Environment Variables

Copy `.env.example` to `.env` in the project root and fill in the values:

```env
# Server
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=plvIntegrity

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_SECRET_KEY=your_api_secret
```

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `PORT` | No | `5000` | Port the HTTP server listens on |
| `DB_HOST` | Yes | n/a | MySQL host |
| `DB_PORT` | No | `3306` | MySQL port |
| `DB_USER` | Yes | n/a | MySQL user |
| `DB_PASSWORD` | Yes | n/a | MySQL password |
| `DB_NAME` | Yes | n/a | Database name (`plvIntegrity`) |
| `CLOUDINARY_CLOUD_NAME` | For uploads | n/a | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | For uploads | n/a | Cloudinary API key |
| `CLOUDINARY_SECRET_KEY` | For uploads | n/a | Cloudinary API secret |

Never commit your `.env` file. Make sure it is listed in `.gitignore`.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the server in watch mode using `tsx` |
| `npx eslint .` | Run the linter |
| `npx tsc --noEmit` | Type-check the project without emitting files |

## Project Structure

```
PLV-Lost-and-Found/
├── database/
│   └── schema.sql                # MySQL schema (15 tables)
├── src/
│   ├── config/
│   │   ├── cloudinary.ts         # Cloudinary client
│   │   └── db.ts                 # MySQL connection pool
│   ├── middlewares/
│   │   ├── errorhandler.ts       # Global error handler
│   │   └── notFound.ts           # 404 handler
│   ├── modules/
│   │   ├── admin/                # Controller, service, repository, routes, types
│   │   ├── auth/                 # Planned
│   │   ├── claims/               # Planned
│   │   ├── foundItems/           # Planned
│   │   ├── items/                # Planned
│   │   ├── lostItems/            # Planned
│   │   └── users/                # Planned
│   ├── schemas/                  # Zod validation schemas
│   ├── utils/
│   │   ├── AppError.ts           # Custom operational error
│   │   └── safeParse.ts          # Zod wrapper that throws AppError
│   ├── app.ts                    # Express app configuration
│   └── server.ts                 # Application entry point
├── eslint.config.js
├── package.json
└── tsconfig.json
```

## Database

**Database name:** `plvIntegrity` (`utf8mb4`, `utf8mb4_unicode_ci`)

| Domain | Tables |
| --- | --- |
| Academic structure | `departments`, `courses`, `sections` |
| Users and roles | `users`, `students`, `faculties`, `admins`, `allowed_admin_numbers` |
| Inventory | `categories`, `items`, `item_images`, `locations` |
| Reports | `lost_items`, `found_items` |
| Claims | `claims` |

**Design notes**

- `users` is the base table. `students`, `faculties`, and `admins` extend it through a unique `user_id` foreign key.
- Admin sign-up is restricted to numbers listed in `allowed_admin_numbers` that are not yet registered.
- `item_images` stores the Cloudinary `image_url` and `public_id`, with an `is_primary` flag.
- Foreign keys use `ON DELETE CASCADE`, except `users.department_id`, which uses `ON DELETE SET NULL`.
- Roles, item conditions, and staff types are enforced with `CHECK` constraints.

## API Reference

**Base URL:** `/api/v1`

All request and response bodies are JSON. Successful responses are wrapped in a `data` object.

### Admin

#### Register an admin

`POST /api/v1/admin/register`

Creates a new admin account. The `idNumbers` value must exist in `allowed_admin_numbers` and must not be registered yet.

**Request body**

```json
{
  "firstName": "Juan",
  "surname": "Dela Cruz",
  "idNumbers": "ADMIN-0001",
  "department": "CEIT",
  "email": "juan@example.com",
  "passwords": "supersecret123"
}
```

**Validation**

| Field | Rule |
| --- | --- |
| `firstName` | 2 to 20 characters |
| `surname` | 2 to 20 characters |
| `idNumbers` | Up to 11 characters |
| `department` | One of `CEIT`, `COED`, `CABA`, `CAS`, `CPAG` |
| `email` | Valid email, up to 255 characters (lowercased) |
| `passwords` | 8 to 40 characters |

**Response: `201 Created`**

```json
{
  "data": {
    "id": 1,
    "user_role": "ADMIN",
    "firstname": "Juan",
    "lastname": "Dela Cruz",
    "create_at": "2026-11-25 10:00:00"
  }
}
```

#### Log in as an admin

`POST /api/v1/admin/login`

**Request body**

```json
{
  "email": "juan@example.com",
  "idNumbers": "ADMIN-0001",
  "passwords": "supersecret123"
}
```

> This endpoint is partially implemented. See [Known Limitations](#known-limitations).

## Error Handling

All errors follow the same structure:

```json
{
  "error": {
    "code": "INVALID_ADMIN_NUMBER",
    "message": "Invalid or already registered admin number."
  }
}
```

| Code | HTTP Status | Description |
| --- | --- | --- |
| `INVALID JSON` | 400 | The request body is not valid JSON |
| `INVALID_ADMIN_NUMBER` | 400 | Validation failed, or the admin number is invalid or already registered |
| `INVALID_DEPARTMENT_ID` | 400 | The department code does not exist |
| `ROUTE_NOT_FOUND` | 404 | No route matches the request |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

## Roadmap

Progress is tracked per module. Items are checked off in the same commit that completes the feature.

**Admin**
- [x] Admin registration with allow-listed admin numbers
- [ ] Admin login (password verification and JWT issuing)
- [ ] `GET /admin/me`

**Auth**
- [ ] JWT authentication middleware
- [ ] Role-based access control (`Member`, `Admin`, `Faculty`)

**Users**
- [ ] Student registration and login
- [ ] Faculty registration and login

**Items**
- [ ] Item CRUD and category management
- [ ] Image upload via Multer and Cloudinary

**Lost and found reports**
- [ ] Lost item reports
- [ ] Found item reports

**Claims**
- [ ] File a claim
- [ ] Admin review, approval, and return workflow

**Quality**
- [ ] Automated tests
- [ ] API documentation (OpenAPI)

## Known Limitations

- Admin login only checks that the admin number is registered. Password verification and token issuing are not implemented yet.
- Only the `/api/v1/admin` routes are mounted in `app.ts`.
- The `.env` values for Cloudinary are loaded, but no upload route exists yet.

## Development Workflow

- Work on one feature at a time and commit once the feature is complete.
- Follow [Conventional Commits](https://www.conventionalcommits.org/):

  ```
  feat(admin): add login with password verification and JWT
  fix(db): await connection check on startup
  docs(readme): update roadmap
  ```

- Run `npx eslint .` and `npx tsc --noEmit` before committing.
- Update the [Roadmap](#roadmap) and [Known Limitations](#known-limitations) in the same commit as the feature.

## License

This project is licensed under the [MIT License](LICENSE).
