# Point solana cli to local
solana --version
solana config set -ul

# Install project dependencies
echo "Installing packages..."
make install

# Generate keypairs for local env
solana-keygen new -s --no-bip39-passphrase -o ./keypairs/fee-payer.json
solana-keygen new -s --no-bip39-passphrase -o ./keypairs/program-owner.json