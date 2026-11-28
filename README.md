# IntegrITy — Campus Lost & Found System

![Node.js](https://img.shields.io/badge/Node.js-20.19%2B-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white)
![Status](https://img.shields.io/badge/status-in%20development-orange)

**IntegrITy** is a Campus Lost & Found System developed for Pamantasan ng Lungsod ng Valenzuela (PLV). It aims to give students, faculty, and administrators one centralized place to report lost items, log found items, and manage item claims.

> [!NOTE]
> **Project status: under active development.** The database schema and backend skeleton are in place, and admin registration is the only working API endpoint. Admin login is scaffolded but not routed yet, and the other backend modules are empty placeholders. This repository currently contains the backend only; a `frontend/` directory will be added when frontend development starts.

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
- [Roadmap](#roadmap)
- [Known Limitations](#known-limitations)
- [Development Workflow](#development-workflow)
- [License](#license)

## Features

**Implemented**

- Express 5 and TypeScript setup using ES Modules
- MySQL connection pool (`mysql2/promise`) with a connectivity check on startup
- Relational schema of 15 tables, with seed data for departments, courses, and a sample admin number
- Admin registration restricted to pre-approved admin numbers
- Password hashing with bcrypt (12 salt rounds)
- Transactional registration: the user record, admin record, and admin-number update succeed or roll back together
- Request validation with Zod and a consistent error response format
- Centralized error-handling and 404 middleware
- Modular, feature-based project structure

**Scaffolded (not usable yet)**

- Admin login (controller and service exist, but the route is not registered)
- Member registration and login schemas
- Cloudinary configuration, `multer`, and `jsonwebtoken` (installed, not wired into any feature)

## Tech Stack

| Layer | Technology |
| --- | --- |
| Runtime | Node.js 20.19+ (ES Modules) |
| Language | TypeScript 5.9 |
| Backend framework | Express 5 |
| Database | MySQL 8 with `mysql2` |
| Validation | Zod 4 |
| Password hashing | bcrypt |
| Authentication | `jsonwebtoken` (installed, not used yet) |
| File upload | Multer and Cloudinary (installed, not used yet) |
| Development tooling | tsx, ESLint 10, typescript-eslint |

## Architecture

The backend follows a layered, feature-based design. Each feature lives in `src/modules/<feature>/` and follows this flow:

```text
Request → Routes → Controller → Service → Repository → MySQL
```

| Layer | Responsibility |
| --- | --- |
| Routes | Define endpoints and connect them to controller handlers |
| Controller | Validate the request body (Zod) and send the HTTP response |
| Service | Apply business rules (for example, admin-number checks and password hashing) |
| Repository | Run SQL queries and transactions against MySQL |

Errors are thrown as `AppError` instances and turned into JSON responses by the error-handling middleware. Express 5 forwards errors from async handlers automatically, so controllers do not need `try/catch`.

Only the `admin` module follows this full flow so far.

## Getting Started

### Prerequisites

- Node.js 20.19 or later (required by ESLint 10)
- npm
- MySQL 8.0.16 or later (earlier versions do not enforce the schema's `CHECK` constraints)

### Installation

**1. Clone the repository and go to the backend**

```bash
git clone https://github.com/Jade-22-dev/PLV-Lost-and-Found.git
cd PLV-Lost-and-Found/backend
```

**2. Install dependencies**

```bash
npm install
```

**3. Create the database**

From inside `backend/`, run the schema script:

```bash
mysql -u <your-username> -p -e "source database/schema.sql"
```

You can also open and run `database/schema.sql` in MySQL Workbench or another MySQL client.

> [!WARNING]
> The schema starts with `DROP DATABASE IF EXISTS plvIntegrity;`. Running it deletes the existing `plvIntegrity` database and recreates it. Back up any important data first.

**4. Configure environment variables**

Create a `.env` file inside `backend/` (see [Environment Variables](#environment-variables)) and set the values for your local MySQL setup.

**5. Start the development server**

```bash
npm run dev
```

If everything is configured correctly, the console shows:

```text
Database is connected
Server is running on PORT 5000
```

If the database connection fails, the server logs the error code and message, then exits.

## Environment Variables

The `.env` file belongs in the `backend/` directory, and the server should be started from that directory.

```env
# Server
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=plvIntegrity

# Cloudinary (not used yet)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_SECRET_KEY=your_api_secret
```

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `PORT` | No | `5000` | Port the API listens on |
| `DB_HOST` | Yes | — | MySQL host |
| `DB_PORT` | No | `3306` | MySQL port |
| `DB_USER` | Yes | — | MySQL user |
| `DB_PASSWORD` | Yes | — | MySQL password |
| `DB_NAME` | Yes | — | Database name (`plvIntegrity`) |
| `CLOUDINARY_CLOUD_NAME` | Not yet | — | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Not yet | — | Cloudinary API key |
| `CLOUDINARY_SECRET_KEY` | Not yet | — | Cloudinary API secret |

Never commit `.env` or expose database passwords, API keys, or other credentials.

## Available Scripts

Run these commands from the `backend/` directory.

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server with `tsx watch` (auto-restarts on changes) |
| `npx tsc --noEmit` | Type-check the project without generating output files |
| `npx eslint .` | Run ESLint |

`npm test` is still a placeholder, and there is no production build or start script yet.

## Project Structure

```text
PLV-Lost-and-Found/
├── backend/
│   ├── database/
│   │   └── schema.sql                # Tables and seed data
│   ├── src/
│   │   ├── config/
│   │   │   ├── cloudinary.ts         # Cloudinary client setup
│   │   │   └── db.ts                 # MySQL connection pool
│   │   ├── middlewares/
│   │   │   ├── errorhandler.ts       # Centralized error responses
│   │   │   └── notFound.ts           # 404 handler
│   │   ├── modules/
│   │   │   ├── admin/
│   │   │   │   ├── types/
│   │   │   │   │   └── admin.type.ts
│   │   │   │   ├── admin.controller.ts
│   │   │   │   ├── admin.repository.ts
│   │   │   │   ├── admin.routes.ts
│   │   │   │   └── admin.service.ts
│   │   │   ├── auth/                 # Placeholder (empty)
│   │   │   ├── claims/               # Placeholder (empty)
│   │   │   ├── foundItems/           # Placeholder (empty)
│   │   │   ├── items/                # Placeholder (empty)
│   │   │   ├── lostItems/            # Placeholder (empty)
│   │   │   └── users/                # Placeholder (empty)
│   │   ├── schemas/
│   │   │   ├── admin.schema.ts       # Admin register/login schemas
│   │   │   └── member.schema.ts      # Member register/login schemas (not used yet)
│   │   ├── utils/
│   │   │   ├── AppError.ts           # Custom error class
│   │   │   └── safeParse.ts          # Zod parsing helper
│   │   ├── app.ts                    # Express app and route mounting
│   │   └── server.ts                 # Entry point (DB check, then listen)
│   ├── .env                          # Local only; do not commit
│   ├── eslint.config.js
│   ├── LICENSE
│   ├── package-lock.json
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

### Module Status

| Location | Status |
| --- | --- |
| `modules/admin/` | Registration implemented; login scaffolded but not routed |
| `modules/auth/`, `claims/`, `foundItems/`, `items/`, `lostItems/`, `users/` | Empty placeholders |
| `schemas/` | Admin and member schemas defined; member schemas not used by any route yet |
| `middlewares/` | Error handler and 404 handler in use |
| `utils/` | `AppError` and `safeParse` in use |
| `config/` | `db.ts` in use; `cloudinary.ts` configured but not imported anywhere yet |

## Database

| Setting | Value |
| --- | --- |
| Database name | `plvIntegrity` |
| Character set | `utf8mb4` |
| Collation | `utf8mb4_unicode_ci` |
| Schema file | `backend/database/schema.sql` |

### Tables

The schema defines 15 tables:

| Category | Tables |
| --- | --- |
| Academic structure | `departments`, `courses`, `sections` |
| Locations | `locations` |
| Users and roles | `users`, `students`, `faculties`, `admins`, `allowed_admin_numbers` |
| Inventory | `categories`, `items`, `item_images` |
| Lost and found reports | `lost_items`, `found_items` |
| Claims | `claims` |

### Design Notes

- `users` is the base table for Member, Admin, and Faculty accounts. `user_role` is restricted by a `CHECK` constraint, `email` is unique, and `department_id` is optional.
- `students`, `faculties`, and `admins` each extend `users` one-to-one through a unique `user_id` foreign key.
- `students` reference both a course and a section. Sections belong to courses, and courses belong to departments.
- `allowed_admin_numbers` stores the pre-approved admin numbers. `is_registered` is set to true once an admin registers with that number.
- `items` holds the common item information. `lost_items` and `found_items` hold report-specific details and link to an item, the reporting user, and a location. A `lost_items` row is unique per item.
- `item_images` stores image URLs and Cloudinary public IDs, with an `is_primary` flag.
- `claims` connects a found item with the user claiming it and tracks the claim status, contact number, date filed, and date returned.
- Foreign keys mostly use `ON DELETE CASCADE`. The exception is `users.department_id`, which uses `ON DELETE SET NULL`.
- Other `CHECK` constraints: `staff_type` (`Academic`, `Non-Academic`) and `item_condition` (`Good`, `Damage`, `Scratched`).

### Seed Data

Running `schema.sql` also inserts:

- 5 departments: CEIT, COED, CABA, CAS, CPAG
- 17 courses across those departments
- 1 sample admin number: `ADMIN-0001` (Juan Dela Cruz)

`locations`, `categories`, and `sections` are not seeded yet. Replace the sample admin number with real pre-approved numbers before real use.

## API Reference

**Base URL:** `http://localhost:5000/api/v1` (with the default `PORT`)

Requests and responses use JSON. Successful responses are wrapped in `{ "data": ... }`.

| Method | Endpoint | Description | Status |
| --- | --- | --- | --- |
| `POST` | `/admin/register` | Register an admin account | Available |
| — | Admin login | Verify credentials and issue a token | Not routed yet |

### Register an Admin

`POST /api/v1/admin/register`

Creates an admin account for a pre-approved admin number.

**Request body**

```json
{
  "firstName": "Juan",
  "surname": "Dela Cruz",
  "idNumbers": "ADMIN-0001",
  "department": "CEIT",
  "email": "juan.delacruz@example.com",
  "passwords": "StrongPass123"
}
```

| Field | Rules |
| --- | --- |
| `firstName` | String, trimmed, 2 to 20 characters |
| `surname` | String, trimmed, 2 to 20 characters |
| `idNumbers` | String, trimmed, up to 11 characters; must exist in `allowed_admin_numbers` and not be registered yet |
| `department` | One of `CEIT`, `COED`, `CABA`, `CAS`, `CPAG` |
| `email` | Valid email, trimmed and lowercased, up to 255 characters; must be unique |
| `passwords` | String, trimmed, 8 to 40 characters; stored as a bcrypt hash |

**Success response: `201 Created`**

```json
{
  "data": {
    "id": 1,
    "user_role": "ADMIN",
    "firstname": "Juan",
    "lastname": "Dela Cruz",
    "create_at": "2026-11-28 12:00:00"
  }
}
```

### Error Responses

All errors use this shape:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message"
  }
}
```

| Status | Code | When it happens |
| --- | --- | --- |
| 400 | `VALIDATION_ERROR` | The request body fails schema validation |
| 400 | `INVALID_ADMIN_NUMBER` | The admin number is not pre-approved or is already registered |
| 400 | `INVALID_DEPARTMENT_ID` | The department does not exist in the database |
| 400 | `INVALID JSON` | The request body is not valid JSON |
| 404 | `ROUTE_NOT_FOUND` | The requested route does not exist |
| 409 | `EMAIL_TAKEN` | A duplicate-entry database error occurred (for example, the email is already registered) |
| 500 | `INTERNAL_ERROR` | Unexpected server error |

## Roadmap

### Backend Foundation

- [x] Create backend project structure
- [x] Set up Express and TypeScript
- [x] Configure environment variables
- [x] Set up the MySQL connection
- [x] Create the initial relational database schema
- [x] Add centralized error handling and Zod validation helper
- [ ] Add authentication middleware and role-based access control

### Admin

- [x] Admin registration
- [ ] Admin login and password verification
- [ ] JWT issuing

### Authentication and Users

- [ ] Member registration and login
- [ ] Faculty registration and login
- [ ] User profile endpoints

### Items and Reports

- [ ] Item and category management
- [ ] Lost item reports
- [ ] Found item reports
- [ ] Image uploads using Multer and Cloudinary

### Claims

- [ ] Claim submission
- [ ] Claim review and verification
- [ ] Claim status management

### Frontend

- [ ] Initialize the frontend application
- [ ] Authentication pages
- [ ] Member portal
- [ ] Admin portal
- [ ] Lost and found item interfaces
- [ ] Claims and verification interfaces
- [ ] Integrate the frontend with the backend API

### Quality and Documentation

- [ ] Add automated tests
- [ ] Add production build and start scripts
- [ ] Add deployment configuration
- [ ] Expand the API reference as endpoints are completed

## Known Limitations

- The project is under active development, and only the admin registration endpoint is live.
- Admin login is scaffolded but not routed, and it does not verify passwords or issue tokens yet.
- There is no authentication middleware or role-based access control yet.
- The `auth`, `claims`, `foundItems`, `items`, `lostItems`, and `users` module folders are empty.
- Member schemas exist but are not connected to any route.
- Cloudinary, Multer, and `jsonwebtoken` are installed or configured, but image upload and token features are not implemented.
- There are no automated tests, and no production build or start script.
- The database schema is an initial version and may change. `locations`, `categories`, and `sections` have no seed data yet.
- The frontend has not been started and is not part of this repository yet.

## Development Workflow

- Run backend commands from the `backend/` directory.
- Keep `.env`, credentials, and `node_modules` out of Git.
- Use clear, feature-focused commit messages.
- Update this README when the project structure, setup process, database schema, or implemented features change.

**Example commit messages**

```text
feat(admin): implement admin registration
fix(db): handle database connection errors
docs(readme): update project documentation
refactor(backend): organize shared utilities
```

## License

This project is licensed under the [MIT License](backend/LICENSE).
