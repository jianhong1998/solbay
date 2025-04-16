# Solbay

## Getting Started

### Prerequisites

- Node v18.18.0 or higher

- Rust v1.77.2 or higher
- Anchor CLI 0.30.1 or higher
- Solana CLI 1.18.17 or higher

- Docker installed

### Init project setup

Run command below:

```
make init
```

### Start project

```
# Start project
make up/build

# Deploy smart contract (without airdrop to program owner)
make deploy

# Deploy smart contract (with airdrop to program owner)
make deploy/with-airdrop
```

### Test smart contract

```
# With bankrun
make test/anchor

# With local test validator (auto deploy)
make test/anchor/onchain

# With local test validator (manual deploy)
make test/anchor/onchain/skip-deploy
```
