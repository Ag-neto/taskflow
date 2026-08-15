# TaskFlow

A full-stack Kanban-style task manager. Users can register, log in, and organize
work into boards, columns, and cards.

## Tech Stack
- **Frontend:** React, Vite, TypeScript
- **Backend:** Node.js, Express, TypeScript, REST API
- **Database:** PostgreSQL with Prisma ORM
- **Auth:** JWT (JSON Web Tokens)
- **Testing:** Jest
- **Infra:** Docker Compose (PostgreSQL)

## Features
- User registration and login (hashed passwords)
- Create, edit, and delete boards
- Columns (To Do / Doing / Done) and cards per board
- Move cards between columns
- Each user only sees their own boards

## Getting Started
1. Start the database: `docker compose up -d`
2. Backend: `cd server && npm install && npm run dev`
3. Frontend: `cd client && npm install && npm run dev`

## Project Structure
- `server/` - Express REST API, Prisma schema, tests
- `client/` - React + Vite frontend
