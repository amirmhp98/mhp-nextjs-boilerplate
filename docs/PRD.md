# Product Requirements Document — {{PROJECT_NAME}}

**Product:** {{PROJECT_NAME}}
**Version:** 1.0
**Last Updated:** 2026-09-14
**Status:** Active Development

---

## 1. Product Overview

<!-- Describe what this product does, who it serves, and its core value proposition. -->

### 1.1 Target Users

- **User Type 1** — Description of this user type.
- **User Type 2** — Description of this user type.

### 1.2 Core Value Proposition

- Value point 1.
- Value point 2.

### 1.3 Language & Locale

The UI is driven by a single locale profile (`src/lib/locale.ts`), selected at build time with `NEXT_PUBLIC_LOCALE`. One deployment runs one profile; nothing else in the app decides direction, calendar, or numerals on its own.

| Profile | Language / Direction | Intl tag | Calendar | Numerals | Time zone | Week | Currency |
|---------|----------------------|----------|----------|----------|-----------|------|----------|
| `fa` (default) | Persian, RTL | `fa-IR` | Jalali (`persian`) | Persian (`arabext`) | `Asia/Tehran` | Starts Saturday, weekend Friday | IRR, displayed as toman |
| `en` | English, LTR | `en-US` | Gregorian (`gregory`) | Latin (`latn`) | `UTC` | Starts Monday, weekend Sat–Sun | USD |

- User-facing strings live in `src/messages/{fa,en}.ts` and are read through `t()` / `tp()` (`@/lib/t`).
- Numbers, dates, and currency are formatted with `@/lib/format` from the profile; a single field may override the calendar (e.g. a Gregorian passport date inside the Persian app).
- Free-text input is normalized with `@/lib/persian` so Persian/Arabic digits and characters are stored canonically; Iranian identifiers are validated with `@/lib/validators/iran`.

---

## 2. System Architecture Summary

| Layer         | Technology                                      |
|---------------|------------------------------------------------|
| Frontend      | Next.js 16 (App Router), React 19, Tailwind 4 |
| Backend       | Next.js Server Actions + API Routes            |
| Database      | PostgreSQL via Prisma ORM                       |
| Deployment    | Docker (standalone Next.js output)              |

---

## 3. Domain Terminology

| Term        | Meaning                                         |
|-------------|------------------------------------------------|
| **Term 1**  | Definition of term 1.                           |
| **Term 2**  | Definition of term 2.                           |

---

## 4. Modules & Features

### 4.1 Module Name

**Purpose:** Describe the module purpose.

**Features:**
- Feature 1.
- Feature 2.

---

## 5. User Flows

### 5.1 Flow Name

```
User navigates to /path
  |
  +-- Step 1
  +-- Step 2
  +-- Step 3
```

---

## 6. Data Model

### 6.1 Entity Relationship Diagram

```
+------------+       +------------+
|   Entity1  |--1:N--|   Entity2  |
+------------+       +------------+
```

### 6.2 Key Relationships

- Describe relationships between entities.

---

## 7. API Endpoints

### 7.1 REST API Routes

| Method | Endpoint              | Description              |
|--------|-----------------------|--------------------------|
| GET    | `/api/example`        | Example endpoint         |

### 7.2 Server Actions (RPC)

| Action              | Module  | Description              |
|---------------------|---------|--------------------------|
| `exampleAction()`   | Example | Example action           |

---

## 8. UI Component System

### 8.1 Design Tokens

| Token          | Value                          |
|----------------|--------------------------------|
| Brand Color    | `#4ADE80` (brand green)        |
| Font Family    | Yekan Bakh for `fa` (via `[lang="fa"]`), system sans stack for `en` |
| Theme          | Dark mode (default)            |
| Direction      | From the locale profile: RTL (`fa`) / LTR (`en`); logical CSS only |
| Calendar       | From the locale profile: Jalali (`fa`) / Gregorian (`en`); per-field `calendar` override |
| Framework      | Tailwind CSS v4 + CVA variants |

---

## 9. Non-Functional Requirements

- **Performance:** Describe performance targets.
- **Reliability:** Describe reliability expectations.
- **Scalability:** Describe scalability approach.
- **Security:** Describe security measures.

---

## 10. Roadmap

| Feature          | Priority | Notes                    |
|------------------|----------|--------------------------|
| Feature 1        | High     | Description              |
| Feature 2        | Medium   | Description              |
