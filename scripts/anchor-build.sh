cd ./anchor
anchor build

cp ./target/deploy/solbay.so ./tests/fixtures
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