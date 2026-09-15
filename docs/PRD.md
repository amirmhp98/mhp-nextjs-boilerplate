# Product Requirements Document — {{PROJECT_NAME}}

**Product:** {{PROJECT_NAME}}
**Version:** 1.0
**Last Updated:** YYYY-MM-DD
**Status:** Active Development

> This is the single source of truth for what the product is. Agents read it before making
> product decisions and update it when a change is product-visible (new module, route,
> behaviour, data model). Keep it a reference, not a changelog.
>
> Sections marked _(boilerplate)_ describe what ships with the template; replace or extend them.

---

## 1. Product Overview

<!-- What this product does, who it serves, and its core value proposition. -->

### 1.1 Target Users

- **Administrator** — manages accounts and settings. _(boilerplate role: `ADMIN`)_
- **Analyst** — uses the application's features day to day. _(boilerplate role: `ANALYST`)_

### 1.2 Core Value Proposition

- Value point 1.
- Value point 2.

### 1.3 Language & Locale

- **Primary UI language:** Persian (Farsi), RTL throughout.
- **Locale:** `fa-IR`. **Timezone:** `Asia/Tehran`. Jalali calendar and Persian digits everywhere.

---

## 2. System Architecture Summary

| Layer      | Technology                                                      |
| ---------- | --------------------------------------------------------------- |
| Frontend   | Next.js 16 (App Router), React 19, Tailwind CSS 4               |
| Backend    | Server Actions + route handlers, zod validation, services layer |
| Database   | PostgreSQL via Prisma 6 (`v2_` table prefix)                    |
| Auth       | Cookie sessions (hashed tokens), bcrypt passwords               |
| Deployment | Docker standalone image, GitHub Actions CI                      |

Engineering rules live in `AGENTS.md`; this document stays at the product level.

---

## 3. Domain Terminology

| Term        | Meaning                                                                                                               |
| ----------- | --------------------------------------------------------------------------------------------------------------------- |
| **User**    | An account that can sign in. Has a role and an active flag. _(boilerplate)_                                           |
| **Session** | A signed-in browser. Expires after `SESSION_MAX_AGE_DAYS`; revoked on deactivation or password reset. _(boilerplate)_ |
| **Term**    | Add domain terms here.                                                                                                |

---

## 4. Modules & Features

### 4.1 Authentication _(boilerplate)_

**Purpose:** Let known users into the application and keep everyone else out.

**Features:**

- Login with username and password; generic error on any failure.
- Session cookie, HTTP-only, valid for `SESSION_MAX_AGE_DAYS` (default 7).
- Logout from the header menu or the sidebar.
- Deactivated users cannot sign in and lose their existing sessions immediately.

### 4.2 User Management _(boilerplate, reference module)_

**Purpose:** Administrators manage who can use the system.

**Features:**

- List users with role, status and last login (`/admin/users`, admin only).
- Create a user (username, full name, password, role).
- Edit name and role. An admin cannot change their own role.
- Activate / deactivate. An admin cannot deactivate themselves.
- Reset a user's password; all of that user's sessions are revoked.

### 4.3 Module Name

**Purpose:** …

**Features:**

- …

---

## 5. User Flows

### 5.1 Sign in _(boilerplate)_

```
Visitor opens any page
  |
  +-- no session cookie → redirected to /login
  +-- submits credentials
        |
        +-- invalid / inactive → error shown, stays on /login
        +-- valid → session created, cookie set → /
```

### 5.2 Create a user _(boilerplate)_

```
Admin opens /admin/users → «کاربر جدید»
  |
  +-- fills name, username, password, role (validated client- and server-side)
  +-- submit → user appears in the table, toast confirms
```

---

## 6. Data Model

### 6.1 Entity Relationship Diagram

```
+-----------------+          +--------------------+
| User            |--1 : N---| Session            |
| (v2_users)      |          | (v2_sessions)      |
+-----------------+          +--------------------+
| id              |          | id                 |
| username  (uq)  |          | userId   → User    |
| passwordHash    |          | tokenHash (uq)     |
| fullName        |          | expiresAt          |
| role  (enum)    |          | createdAt          |
| isActive        |          +--------------------+
| lastLoginAt     |
| createdAt       |
| updatedAt       |
+-----------------+
```

### 6.2 Key Relationships

- Deleting a user cascades to their sessions.
- `UserRole` enum: `ADMIN`, `ANALYST` (database type `v2_user_role`).

---

## 7. API Surface

### 7.1 Route Handlers

| Method | Endpoint      | Auth | Description                                        |
| ------ | ------------- | ---- | -------------------------------------------------- |
| GET    | `/api/health` | none | Readiness probe: database connectivity → 200 / 503 |

### 7.2 Server Actions

| Action                | Module | Auth  | Description                          |
| --------------------- | ------ | ----- | ------------------------------------ |
| `loginAction`         | auth   | none  | Validate credentials, open a session |
| `logoutAction`        | auth   | user  | Revoke the current session           |
| `createUserAction`    | users  | admin | Create a user                        |
| `updateUserAction`    | users  | admin | Change name / role                   |
| `setUserActiveAction` | users  | admin | Activate or deactivate               |
| `resetPasswordAction` | users  | admin | Set a new password, revoke sessions  |

---

## 8. UI System

| Token       | Value                                                                              |
| ----------- | ---------------------------------------------------------------------------------- |
| Brand color | Derived from `--brand-hue` / `--brand-saturation` in `globals.css` (default green) |
| Typeface    | Yekan Bakh (variable), line-height 1.6                                             |
| Theme       | Dark by default, light available; persisted per browser                            |
| Layout      | RTL; collapsible sidebar (state persisted in a cookie)                             |
| Components  | Local primitives + RTL-wrapped widget barrel; showcase at `/components`            |

---

## 9. Non-Functional Requirements

- **Security:** hashed session tokens, bcrypt(12), security headers (HSTS, frame-deny, nosniff, referrer, permissions), validated environment, zod on every action.
- **Reliability:** health endpoint for orchestrators; migrations applied on container start.
- **Performance:** server components by default; client islands only where interactive.
- **Quality gate:** lint + typecheck + unit + build + e2e in CI on every push.

---

## 10. Roadmap

| Feature   | Priority | Notes       |
| --------- | -------- | ----------- |
| Feature 1 | High     | Description |
| Feature 2 | Medium   | Description |
