# Lion Dance Event Signup App

A web application for lion dance teams to manage performances and allow members to sign up for events.

## Features

- Create, edit, and delete performances (events)
- Each event includes: name, date, time, location, and pay
- Members can register for events by submitting their name
- Members can remove themselves from events
- View all registered members for each event
- Mobile-friendly, responsive UI
- Built with modern technologies: Next.js, TypeScript, Prisma, Supabase, tRPC, NextAuth

## Tech Stack

- **Next.js** (App Router)
- **TypeScript**
- **Prisma** (ORM)
- **Supabase** (Postgres database)
- **tRPC** (type-safe API)
- **NextAuth** (authentication, optional for admin features)
- **Tailwind CSS** (for styling)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repo-url>
cd vcdc-lions
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

- Create a project at [Supabase](https://app.supabase.com/)
- Get your database connection string and API keys from the Supabase dashboard
- Copy `.env.example` to `.env` and fill in the required values:

```
DATABASE_URL=postgres://username:password@host:port/database
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Run Prisma Migrations

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Start the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to use the app.

## Usage

- **Create Event:** Fill out the event creation form with name, date, time, location, and pay.
- **Edit/Delete Event:** Use the Edit or Delete buttons on each event card.
- **Register for Event:** Enter your name under the event you want to join and click Register.
- **Remove Registration:** Click Remove next to your name in the registered members list.

## Customization

- To restrict event creation/editing/deletion to admins, enable and configure NextAuth.
- You can further style the app using Tailwind CSS in `src/styles/globals.css`.
