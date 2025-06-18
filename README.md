# Solbay

A Solana-based marketplace application with smart contracts and web services.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Development](#development)
- [Testing](#testing)
- [Database Management](#database-management)
- [Code Quality](#code-quality)
- [Deployment](#deployment)

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v22.14.0 or higher
- **Rust** v1.85.0 or higher
- **Anchor CLI** 0.31.1
- **Solana CLI** 2.1.21
- **Docker** (for containerized development)

## 🚀 Quick Start

### 1. Initialize the Project

```bash
make init
```

**Optional:** Copy your program keypair to `./anchor/target/deploy/solbay-keypair.json`

### 2. Start the Application

```bash
# Start all services (database, server, etc.)
make up/build
```

### 3. Deploy Smart Contracts

```bash
# Deploy without airdrop (if you have sufficient balance)
make deploy

# Deploy with airdrop to program owner
make deploy/with-airdrop
```

### 4. Seed Sample Data

```bash
# Add dummy data to the database
make db/data/up
```

## 💻 Development

### Starting the Development Environment

```bash
# Start all services
make up/build

# Stop and clean up
make down/clean
```

### Smart Contract Development

```bash
# Build Anchor program
make anchor/build

# Deploy to local validator
make deploy
```

## 🧪 Testing

### Recommended Testing Workflow

```bash
# 1. Start fresh environment
make down/clean up/build

# 2. Deploy contracts
make deploy/with-airdrop

# 3. Run tests (in another terminal)
make test/anchor/onchain/skip-deploy
```

### Available Test Commands

```bash
# Test with local validator (auto-deploy)
make test/anchor/onchain

# Test with local validator (manual deploy)
make test/anchor/onchain/skip-deploy
```

## 🗄️ Database Management

### Prerequisites

Ensure your `./server/.env` file contains the necessary database connection variables.

### Generating Migrations

```bash
# Navigate to server directory
cd server

# Generate new migration
npm run migration:generate --name="your_migration_name"
```

### Running Migrations

```bash
# Manual migration (usually auto-executed on startup)
cd server
npm run migration:run
```

## ✨ Code Quality

### Linting

```bash
# Check for linting issues
make lint

# Auto-fix linting issues
make lint/fix
```

### Code Formatting

```bash
# Format code with Prettier
make format
```

## 🚀 Deployment

### Backend Server

Build and deploy the server container:

```bash
# Replace <TAG> with your image tag
# Replace <PLATFORM> with linux/amd64 or linux/arm64
docker build -f ./docker/deployment/Dockerfile.server -t <TAG> --platform <PLATFORM> ./server
```

### Database Migration Task

```bash
# Replace <TAG> with your image tag
# Replace <PLATFORM> with linux/amd64 or linux/arm64
docker build -f ./docker/deployment/Dockerfile.db-migration -t <TAG> --platform <PLATFORM> ./server
```

### Smart Contract Deployment

#### Prerequisites

- Ensure `./keypairs/program-owner.json` has sufficient balance
  - For devnet/testnet: Airdrop to program owner with command: `solana airdrop -k ./keypairs/program-owner.json 2`

#### Deployment Steps

```bash
# 1. Build the program
make anchor/build

# 2. Navigate to anchor directory
cd anchor

# 3. Deploy to devnet
anchor deploy --provider.cluster devnet --provider.wallet ../keypairs/program-owner.json
```

## 📁 Project Structure

```
solbay/
├── anchor/           # Smart contract code
├── client/           # NextJS web page server
├── docker/           # Docker configuration
├── keypairs/         # Keypair files
├── scripts/          # Some useful scripts
├── server/           # Backend API server
└── Makefile          # Local development scripts
```
