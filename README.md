Scriblio
Scriblio is a real-time collaborative drawing platform inspired by Excalidraw. It allows users to create and join drawing rooms where they can collaborate with others by drawing shapes and adding text on a shared canvas.
Project Overview
Scriblio is built as a monorepo using Turborepo and pnpm, consisting of three main applications and shared packages:
Applications

Frontend (Next.js + Tailwind CSS)

Landing page
Authentication (Login/Signup)
Dashboard with available drawing rooms
Canvas page for collaborative drawing with HTML Canvas


HTTP Backend (Express)

Authentication endpoints
Middleware
API endpoints for drawing data retrieval
Fetching last 50 shapes broadcasted in drawing rooms


WebSocket Backend

Real-time updates broadcasting
Drawing room collaboration
Uses WSS library for WebSocket communication



Shared Packages

DB Package

Postgres database connection
Prisma ORM integration
Schema definitions
Exports Prisma client for use in backends


Common

Zod schema validation
Shared types and utilities



Architecture
CopyScriblio/ (root)
├── apps/
│   ├── frontend/          # Next.js frontend application
│   ├── http-backend/      # Express HTTP API server
│   └── ws-backend/        # WebSocket server
├── packages/
│   ├── db/                # Database package with Prisma
│   └── common/            # Shared utilities and schemas
├── package.json
├── turbo.json
└── pnpm-workspace.yaml
Prerequisites

Node.js (16.x or higher)
pnpm (7.x or higher)
PostgreSQL database (cloud or local)

Getting Started
1. Clone the repository
bashCopygit clone https://github.com/yourusername/Scriblio.git
cd Scriblio
2. Install dependencies
bashCopy# Install pnpm if you don't have it already
npm install -g pnpm

# Install project dependencies
pnpm install
3. Set up environment variables
Create a .env file in the root directory with the following variables:
Copy# Database (shared across apps)
DATABASE_URL=postgresql://username:password@hostname:port/database

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3002

# HTTP Backend
PORT=3001
JWT_SECRET=your_jwt_secret_key
CORS_ORIGIN=http://localhost:3000

# WebSocket Backend
WS_PORT=3002
4. Setup the database
bashCopy# Generate Prisma client
pnpm db:generate

# Run database migrations
pnpm db:migrate
5. Start the development servers
bashCopy# Start all applications concurrently
pnpm dev
This will start all three applications:

Frontend: http://localhost:3000
HTTP Backend: http://localhost:3001
WebSocket Backend: ws://localhost:3002

Scripts
bashCopy# Install dependencies
pnpm install

# Start all applications in development mode
pnpm dev

# Build all applications
pnpm build

# Start all applications in production mode
pnpm start

# Generate Prisma client
pnpm db:generate

# Run database migrations
pnpm db:migrate

# Lint code
pnpm lint

# Run tests
pnpm test
Features

Real-time Collaboration: Draw and edit with multiple users simultaneously
Drawing Tools: Create shapes, add text, and customize the canvas
User Authentication: Secure login and signup
Room Management: Create and join drawing rooms
Persistent Storage: Save drawings and continue where you left off
Responsive Design: Works on desktop and mobile devices

Technical Implementation

Frontend: Next.js with Tailwind CSS for styling
Canvas Rendering: Custom HTML Canvas implementation without external libraries
API Server: Express.js for authentication and data retrieval
Real-time Updates: WebSocket server for broadcasting drawing changes
Database: PostgreSQL with Prisma ORM
Schema Validation: Zod for type-safe data validation
Project Structure: Turborepo for monorepo management
