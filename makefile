PROJECT_NAME = "solbay"

up/build:
	@$(MAKE) anchor/build
	@docker compose \
		-p ${PROJECT_NAME} \
		up --build -w --remove-orphans

up:
	@docker compose \
		-p ${PROJECT_NAME} \
		up -w

down:
	@docker compose \
		-p ${PROJECT_NAME} \
		down && \
		$(MAKE) clean-image

down/clean:
	@$(MAKE) down && \
		$(MAKE) clean && \
		$(MAKE) clean-image

clean:
	@rm -rf ./solana-ledger ./client/.next ./postgres-data ./temp ./localstack-data

clean-image:
	@docker image prune -f

anchor/build:
	@chmod +x ./scripts/anchor-build.sh
	@./scripts/anchor-build.sh

anchor/keys-sync:
	@cd anchor && \
		anchor keys sync

test/anchor:
	@cd anchor && \
		IS_TESTING_ON_CHAIN=false anchor test --skip-local-validator --skip-deploy

test/anchor/onchain:
	@cd anchor && \
		IS_TESTING_ON_CHAIN=true anchor test --skip-local-validator

test/anchor/onchain/skip-deploy:
	@cd anchor && \
		IS_TESTING_ON_CHAIN=true anchor test --skip-local-validator --skip-deploy

db/data/up:
	@$(MAKE) setup/dummy-usdc
	@$(MAKE) setup/escrow
	@cd server && \
		npm run build && \
		npm run seed:run

deploy:
	@$(MAKE) anchor/build
	@cd ./anchor && \
		anchor deploy

deploy/with-airdrop:
	@$(MAKE) airdrop/program-owner && \
		$(MAKE) airdrop/fee-payer && \
		$(MAKE) airdrop/usdc-mint-authority && \
		$(MAKE) airdrop/usdc-mint-authority/test && \
		$(MAKE) deploy

airdrop/program-owner:
	@solana airdrop 10 -k ./keypairs/program-owner.json

airdrop/fee-payer:
	@solana airdrop 10 -k ./keypairs/fee-payer.json

airdrop/usdc-mint-authority/test:
	@solana airdrop 10 -k ./keypairs/test-usdc-authority.json

airdrop/usdc-mint-authority:
	@solana airdrop 10 FZJmJuj8vz2HbBFrcdbMoZYNnGprBRzZ35KczJwHacAR
	

install:
	@rm -rf ./node_modules
	@rm -rf ./client/node_modules
	@rm -rf ./anchor/node_modules
	@rm -rf ./server/node_modules
	@npm i
	@cd client && \
		npm i
	@cd anchor && \
		npm i
	@cd server && \
		npm i

init:
	@chmod +x ./scripts/init-project.sh && \
		./scripts/init-project.sh

format:
	@cd anchor && \
		npm run format
	@cd client && \
		npm run format
	@cd server && \
		npm run format

lint:
	@echo "Checking lint issue in client..." && \
		npx eslint ./client
	@echo "Checking lint issue in server..." && \
		npx eslint ./server
	@echo "Checking lint issue in anchor tests..." && \
		npx eslint ./anchor

lint/fix:
	@echo "Checking lint issue in client..." && \
		npx eslint ./client --fix
	@echo "Checking lint issue in server..." && \
		npx eslint ./server --fix
	@echo "Checking lint issue in anchor tests..." && \
		npx eslint ./anchor --fix

setup/dummy-usdc:
	@chmod +x ./scripts/init-dummy-usdc.sh && \
		./scripts/init-dummy-usdc.sh

setup/escrow:
	@chmod +x ./scripts/init-escrow.sh && \
		./scripts/init-escrow.sh