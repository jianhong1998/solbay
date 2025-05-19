# Solbay

## Getting Started

### Prerequisites

- Node v18.18.0 or higher

- Rust v1.77.2 or higher
- Anchor CLI 0.30.1 or higher
- Solana CLI 1.18.17 or higher

- Docker installed

### Init project setup

1. Run command below:

```
make init
```

2. (Optional) Copy program keypair to `./anchor/target/deploy/solbay-keypair.json`

### Start project

```
# Start project
make up/build

# Deploy smart contract (without airdrop to program owner)
make deploy

# Deploy smart contract (with airdrop to program owner)
make deploy/with-airdrop
```

### Seed Dummy Data

Prerequisites:

1. Database is running.
2. Database schema up-to-date.

Use command `make up/build` to setup database and executing migration script.

```
make db/data/up
```

### Test smart contract

#### Recommended Test Steps

```
# Run the application and test-local-validator
make down/clean up/build

# Run test in another terminal
make deploy/with-airdrop test/anchor/onchain/skip-deploy
```

#### All Test Related Commands

```
# With bankrun
make test/anchor

# With local test validator (auto deploy)
make test/anchor/onchain

# With local test validator (manual deploy)
make test/anchor/onchain/skip-deploy
```

## Useful Code Formating Commands

### ESLint check

```
# Lint check
make lint

# Lint check (with auto-fix)
make lint/fix
```

### Prettier code format

```
make format
```

## Database Migration Commands

### Pre-Request

Ensure `./server/.env` file is ready and contain necessary environment variables for database connection.

### Generating a new migration script

1. Ensure database is running and schemas up-to-date. Command `make up/build` will spin up entire application including database and run migration script automatically.

2. Run command below to generate a new database migration script

```
cd server
npm run migration:generate --name="<MIGRATION_SCRIPT_FILE_NAME>"
```

### Running migration script

Although when spinning up the application, there is a migration service to auto-execute database migration script. In case of required executing the scripts manually, can run command below:

```
cd server
npm run migration:run
```
