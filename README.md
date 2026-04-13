# Smart Event Management Web Application

A full-stack web application for discovering, booking, and managing events — built with Next.js, PostgreSQL, and Tailwind CSS.

## Features

- **Event discovery** — browse and search events by name, location, and date
- **Event detail pages** — full event information with booking support
- **Organizer profiles** — dedicated pages for event organizers
- **User authentication** — register, log in, and manage your account
- **Ticket booking** — book tickets and view your bookings in "My Tickets"
- **Dark/light theme** — persistent theme toggle
- **Multilingual UI** — French and English support via a language context

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (Pages Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL 18 |
| Auth | bcryptjs (password hashing) |
| Containerization | Docker / Docker Compose |

## Project Structure

```
src/
├── pages/
│   ├── api/
│   │   ├── auth/        # login, register
│   │   ├── bookings/    # create booking, user bookings
│   │   └── events/      # list events, event by ID, create event
│   ├── events/[id].tsx  # event detail page
│   ├── explore.tsx      # browse all events
│   ├── my-tickets.tsx   # user bookings
│   ├── organizers.tsx   # organizer directory
│   ├── login.tsx
│   └── register.tsx
├── components/
│   ├── NavBar.tsx
│   └── Footer.tsx
├── context/
│   ├── AuthContext.tsx  # authentication state
│   └── LangContext.tsx  # i18n (FR/EN)
└── lib/
    └── db.ts            # PostgreSQL client
```

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose
- Or Node.js 18+ and a running PostgreSQL instance

### Run with Docker (recommended)

1. Copy the example environment file and fill in your values:

   ```bash
   cp .env.example .env
   ```

   Required variables:

   ```env
   POSTGRES_USER=your_user
   POSTGRES_PASSWORD=your_password
   POSTGRES_DB=smart_event
   DATABASE_URL=postgresql://your_user:your_password@db:5432/smart_event
   ```

2. Start the application:

   ```bash
   docker compose up --build
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

The database schema is applied automatically from `migration/init_schema.sql` on first start.

### Run locally (without Docker)

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set your `DATABASE_URL` in a `.env.local` file pointing to a local PostgreSQL instance.

3. Apply the database schema:

   ```bash
   psql $DATABASE_URL -f migration/init_schema.sql
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
