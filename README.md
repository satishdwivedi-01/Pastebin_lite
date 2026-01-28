# Pastebin Lite

A minimal Pastebin-like web application that allows users to create
and share text snippets via a unique URL. Pastes can optionally expire
based on time (TTL) or number of views.

---

## Features

- Create a text paste
- Generate a shareable URL
- Optional expiration by:
  - Time (TTL)
  - View count
- Server-rendered paste view
- Copy & download paste content
- Concurrency-safe backend logic

---

## Tech Stack

- Next.js (App Router)
- PostgreSQL (Neon)
- Raw SQL using `node-postgres`
- Deployed on Vercel

---

## TEST_MODE

- The application supports a deterministic testing mode for automated tests.

- When TEST_MODE=0 (default), the app uses the current system time.

- When TEST_MODE=1, the server accepts a request header
x-test-now-ms (milliseconds since epoch) to override the current time.


### Deployed Environment

The deployed application runs with `TEST_MODE=0` by default.
Automated tests may override this value and supply the
`x-test-now-ms` header to deterministically validate expiration behavior.


## Running Locally

### Prerequisites
- Node.js 18+
- PostgreSQL (local or Neon)

### Setup

1. Clone the repository
2. Install dependencies:

```bash
npm install

# Create a .env.local file in the project root:
# Local PostgreSQL:
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/<db>
# or
# Neon / hosted PostgreSQL:
DATABASE_URL=postgresql://<user>:<password>@<host>/<db>?sslmode=require

TEST_MODE=0

# Create the database table:
CREATE TABLE pastes (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP NULL,
  max_views INTEGER NULL,
  views_used INTEGER NOT NULL DEFAULT 0
);


# Run the app:
npm run dev
