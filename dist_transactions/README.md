# Distributed Transactions Example

This project demonstrates distributed transactions and failure handling across microservices using Bun.js, Fastify, and postgres.js.

## Setup

### 1. Install Bun:

```bash
curl -fsSL https://bun.sh/install | bash
```

### 2. Install dependencies:

```bash
bun install
```

### 3. Set up PostgreSQL database:

- Create a database named `dist_transactions`
- Update database credentials in `src/config/database.ts` if needed

### 4. Start both services:

```bash
# Terminal 1
bun start:foo

# Terminal 2
bun start:bar
```

## Testing the Distributed Transaction

1. Send a POST request to create a Foo with two Bars:

```bash
# Terminal 3
bun test
```

## Technologies

- Bun.js: Fast JavaScript runtime
- Fastify: High-performance web framework
- postgres.js: Modern PostgreSQL client
- Native fetch API for service communication
