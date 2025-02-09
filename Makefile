up:
	docker compose up

down:
	docker compose down

rebuild:
	docker compose down
	docker compose up --build

fixmodules:
	sudo chown $(USER) frontend/node_modules backend/node_modules
	npm install --prefix frontend
	npm install --prefix backend

resetdb:
	docker compose down
	sudo rm -rf db-data

testback:
	docker compose exec backend-dev npm run test

testfront:
	docker compose exec frontend-dev npm run test

lint:
	docker compose exec backend-dev npm run lint
	docker compose exec frontend-dev npm run lint

prettier:
	docker compose exec backend-dev npm run prettier
	docker compose exec frontend-dev npm run prettier
