# Anchor build

cd ./anchor
# Temporary commented as anchor having some issue with build IDL. The fix will only release in v0.31.1
# anchor build

# ================================================================================
# START - Temporary fix for building IDL
# ================================================================================
anchor build --no-idl

cd ./programs/solbay

RUSTUP_TOOLCHAIN=nightly-2025-04-01 anchor idl build -o ../../target/idl/solbay.json -t ../../target/types/solbay.ts
cd ../../

# ================================================================================
# END - Temporary fix for building IDL
# ================================================================================

cp ./target/deploy/solbay.so ./tests/fixtures


# Format codes
npm run format
cd ..


# Copy anchor src & target to client

rm -rf ./client/src/contract
mkdir -p ./client/src/contract/src
mkdir -p ./client/src/contract/target

cp -r ./anchor/target/idl ./anchor/target/types ./client/src/contract/target
cp -r ./anchor/src ./client/src/contract

# Copy anchor src & target to server

rm -rf ./server/src/contract
mkdir -p ./server/src/contract/src
mkdir -p ./server/src/contract/target

cp -r ./anchor/target/idl ./anchor/target/types ./server/src/contract/target
cp -r ./anchor/src ./server/src/contract