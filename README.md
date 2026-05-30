# Issue Prevention & Knowledge Sharing Portal

> A production-grade internal web application for preventing recurring issues, standardizing team processes, and sharing technical learnings.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)](https://www.postgresql.org)

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Role-Based Access Control](#role-based-access-control)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

The **Issue Prevention & Knowledge Sharing Portal** is a full-stack internal web application designed to:

- Reduce recurring development and process-related incidents
- Enable teams to follow consistent, reusable workflows with checklists
- Provide a learning hub for technical articles, lessons learned, and best practices
- Improve knowledge discoverability through smart search, tags, and filters
- Give leads and managers visibility into content quality, freshness, and issue trends

---

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                       │
│          React 18 + TypeScript + Material UI + Vite           │
└────────────────────────┬─────────────────────────────────────┘
                         │ HTTPS / REST API
┌────────────────────────▼─────────────────────────────────────┐
│                    BACKEND API SERVER                         │
│               NestJS + TypeScript + Passport.js               │
│   Auth │ Articles │ ProcessDocs │ Blog │ Search │ Analytics   │
└────────────────────────┬─────────────────────────────────────┘
                         │
           ┌─────────────┼──────────────┐
           │             │              │
    ┌──────▼──────┐ ┌───▼────┐ ┌──────▼──────┐
    │ PostgreSQL  │ │ Redis  │ │  Nodemailer  │
    │  (Primary)  │ │(Cache/ │ │  (Email /    │
    │             │ │Sessions│ │ Notifications│
    └─────────────┘ └────────┘ └─────────────┘
```

### Technology Stack

| Layer          | Technology                        |
|----------------|-----------------------------------|
| Frontend       | React 18, TypeScript, Material UI, Vite, React Query, React Hook Form, Zod |
| Backend        | NestJS, TypeScript, Passport.js, JWT, class-validator |
| Database       | PostgreSQL 15 + TypeORM           |
| Search         | PostgreSQL Full-Text Search (tsvector) |
| Auth           | OAuth2 / OpenID Connect + JWT + bcrypt |
| Cache/Sessions | Redis                             |
| Notifications  | Nodemailer + optional Slack/Teams webhooks |
| Containerization | Docker + Docker Compose         |
| Testing        | Jest, Supertest, React Testing Library, Cypress |
| CI/CD          | GitHub Actions                    |

---

## Features

### MVP Phase 1
- ✅ Authentication with JWT & OAuth2/SSO
- ✅ Role-based access control (Developer, Lead, Manager, Admin)
- ✅ Issue Article management (create, edit, draft, review, publish, archive)
- ✅ Process Document management with versioning and checklists
- ✅ Review & Approval Workflow (Draft → In Review → Approved → Published)
- ✅ Global full-text search with tag, team, severity, and type filters
- ✅ Comments with threaded discussions
- ✅ Tag and category management
- ✅ Version history and audit logging
- ✅ Basic notifications (review requests, approvals)

### MVP Phase 2
- ✅ Learning Blog (rich text, code snippets, related article linking)
- ✅ Role-specific dashboards (Developer, Lead, Manager)
- ✅ Stale content detection and reminders
- ✅ Helpfulness tracking (thumbs up/down)
- ✅ Failed search capture and analytics

### Prevention Automation
- ✅ Checklist Engine (reusable checklists with completion tracking)
- ✅ Preventive Action fields on every Issue Article
- ✅ Stale Content Alerts
- ✅ Failed Search Capture
- ✅ Related Content Suggestions
- ✅ Trend Detection on dashboards

---

## Getting Started

### Prerequisites

- Node.js 20.x
- npm 10.x or yarn 4.x
- Docker & Docker Compose
- PostgreSQL 15 (or use Docker)
- Redis 7 (or use Docker)

### 1. Clone the Repository

```bash
git clone https://github.com/Ranjithrosan17-dev/issue-prevention-knowledge-portal.git
cd issue-prevention-knowledge-portal
```

### 2. Environment Setup

```bash
# Copy environment templates
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Edit values as needed
nano backend/.env
```

### 3. Start with Docker (Recommended)

```bash
docker-compose up --build
```

This starts:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379
- **pgAdmin**: http://localhost:5050 (dev only)

### 4. Manual Setup (Development)

```bash
# Install backend dependencies
cd backend && npm install

# Run database migrations
npm run migration:run

# Seed initial data (roles, categories, sample users)
npm run seed

# Start backend in dev mode
npm run start:dev

# Install frontend dependencies
cd ../frontend && npm install

# Start frontend in dev mode
npm run dev
```

---

## Environment Variables

### Backend (`backend/.env`)

```env
# Application
NODE_ENV=development
PORT=4000
APP_URL=http://localhost:4000
FRONTEND_URL=http://localhost:3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=knowledge_portal
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRES_IN=1d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# OAuth2 / SSO (Optional)
OAUTH_CLIENT_ID=
OAUTH_CLIENT_SECRET=
OAUTH_CALLBACK_URL=http://localhost:4000/auth/callback
OAUTH_ISSUER_URL=https://your-sso-provider.com

# Email Notifications
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM="Knowledge Portal <noreply@yourcompany.com>"

# Optional: Slack / Teams Webhooks
SLACK_WEBHOOK_URL=
TEAMS_WEBHOOK_URL=

# Stale Content Review Cycle (days)
DEFAULT_REVIEW_CYCLE_DAYS=90
```

### Frontend (`frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:4000/api/v1
VITE_APP_NAME="Knowledge Portal"
```

---

## API Documentation

Once the backend is running, visit:

```
http://localhost:4000/api/docs
```

Swagger UI is automatically generated from NestJS decorators and provides interactive documentation for all endpoints.

### Core API Endpoints

| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/auth/login` | Local login | Public |
| POST | `/api/v1/auth/refresh` | Refresh JWT token | Authenticated |
| GET | `/api/v1/auth/me` | Current user profile | Authenticated |
| GET | `/api/v1/content` | List all content (paginated, filtered) | Authenticated |
| POST | `/api/v1/content` | Create content item | Developer+ |
| GET | `/api/v1/content/:id` | Get content by ID | Authenticated |
| PATCH | `/api/v1/content/:id` | Update content | Author / Lead / Admin |
| POST | `/api/v1/content/:id/submit` | Submit for review | Author |
| POST | `/api/v1/content/:id/approve` | Approve content | Lead+ |
| POST | `/api/v1/content/:id/reject` | Reject content | Lead+ |
| POST | `/api/v1/content/:id/publish` | Publish content | Lead+ |
| POST | `/api/v1/content/:id/archive` | Archive content | Lead+ |
| GET | `/api/v1/search` | Global search | Authenticated |
| GET | `/api/v1/content/:id/comments` | Get comments | Authenticated |
| POST | `/api/v1/content/:id/comments` | Add comment | Developer+ |
| POST | `/api/v1/content/:id/helpful` | Mark helpful/unhelpful | Developer+ |
| GET | `/api/v1/analytics/dashboard` | Role-specific metrics | Authenticated |
| GET | `/api/v1/admin/users` | List users | Admin |
| POST | `/api/v1/admin/users/:id/role` | Update user role | Admin |
| GET | `/api/v1/admin/audit-logs` | View audit logs | Admin / Manager |
| GET | `/api/v1/tags` | List tags | Authenticated |
| POST | `/api/v1/tags` | Create tag | Admin |

---

## Database Schema

See [`backend/src/database/migrations/`](backend/src/database/migrations/) for full migration files.

Core entities:
- `users` — User accounts with role and team
- `content_items` — Base content (IssueArticle, ProcessDoc, BlogPost)
- `issue_details` — Extended fields for Issue Articles
- `process_details` — Extended fields with checklist JSON
- `blog_details` — Extended fields for Blog Posts
- `tags` — Global tag library
- `content_tags` — Many-to-many join table
- `review_actions` — Full approval history
- `comments` — Threaded comments
- `audit_logs` — Immutable governance audit trail
- `analytics_events` — Search, view, helpful, checklist events
- `content_versions` — Snapshot of each published version

---

## Role-Based Access Control

| Role | Capabilities |
|------|--------------|
| **Developer** | Create/edit own drafts, submit for review, search, comment, use checklists, mark helpful |
| **Team Lead** | All Developer actions + review/approve/reject content, manage team process docs, view team analytics |
| **Manager** | View governance dashboards, approve high-impact content, assign owners, monitor trends |
| **Admin** | Full access — manage users, roles, tags, categories, workflow rules, audit logs |

---

## Testing

```bash
# Backend unit + integration tests
cd backend
npm run test
npm run test:e2e
npm run test:cov

# Frontend unit tests
cd frontend
npm run test

# E2E tests (requires running app)
npm run cypress:open
```

---

## Deployment

### Production Docker Build

```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

### CI/CD

GitHub Actions pipelines are included in `.github/workflows/`:
- `ci.yml` — Lint, test, build on every PR
- `deploy.yml` — Deploy to production on merge to `main`

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit with conventional commits: `git commit -m 'feat: add checklist engine'`
4. Push and open a Pull Request
5. Ensure all CI checks pass before requesting review

---

## License

MIT — see [LICENSE](LICENSE)
