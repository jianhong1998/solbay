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
	@rm -rf ./solana-ledger ./client/.next ./postgres-data ./temp

clean-image:
	@docker image prune -f

anchor/build:
	@chmod +x ./scripts/anchor-build.sh
	@./scripts/anchor-build.sh

test/anchor:
	@cd anchor && \
		IS_TESTING_ON_CHAIN=false anchor test --skip-local-validator --skip-deploy

test/anchor/onchain:
	@cd anchor && \
		IS_TESTING_ON_CHAIN=true anchor test --skip-local-validator

test/anchor/onchain/skip-deploy:
	@cd anchor && \
		IS_TESTING_ON_CHAIN=true anchor test --skip-local-validator --skip-deploy

deploy:
	@$(MAKE) anchor/build
	@cd ./anchor && \
		anchor deploy

deploy/with-airdrop:
	@$(MAKE) airdrop/program-owner && \
		$(MAKE) airdrop/fee-payer && \
		$(MAKE) deploy

airdrop/program-owner:
	@solana airdrop 10 -k ./keypairs/program-owner.json

airdrop/fee-payer:
	@solana airdrop 10 -k ./keypairs/fee-payer.json

install:
	@rm -rf ./client/node_modules
	@rm -rf ./anchor/node_modules
	@rm -rf ./server/node_modules
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