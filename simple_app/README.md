# Simple Accounting App

A simple REST API for basic accounting operations built with Bun, Fastify, and PostgreSQL.

## Prerequisites

### Bun

First, install Bun. Bun is a fast all-in-one JavaScript runtime & toolkit.
[Install Bun](https://bun.sh/docs/installation)

### Docker

You'll need Docker to run PostgreSQL locally:

1. Install Docker Desktop:

   - [Mac](https://docs.docker.com/desktop/install/mac-install/)
   - [Windows](https://docs.docker.com/desktop/install/windows-install/)
   - [Linux](https://docs.docker.com/desktop/install/linux-install/)

2. Start PostgreSQL container:

```bash
docker run --name accounting-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_DB=accounting \
  -p 5432:5432 \
  -d postgres:15
```

## Setup

### Install dependencies

```bash
bun run clean
```

### Start the development server

```bash
bun run dev
```

The API will be available at `http://localhost:3000`.

## Available Scripts

- `bun run dev` - Start development server with hot reload
- `bun run start` - Start production server
- `bun run test` - Run tests
- `bun run clean` - Reset database schema

## API Endpoints

- `GET /journals` - List all journal entries
- `GET /journals/:id` - Get journal entry by ID
- `POST /journals` - Create new journal entry
- `PUT /journals/:id` - Update journal entry
- `DELETE /journals/:id` - Delete journal entry

## Development

### Database Schema

`journals` - Stores journal entries

- `id`: Serial primary key
- `reference`: Transaction reference
- `account_number`: Account number
- `date`: Transaction date
- `amount`: Transaction amount
- `currency`: Currency code
- `created_at`: Timestamp
- `updated_at`: Timestamp

### Testing

Run the test suite:

```bash
bun test
```
