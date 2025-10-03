# Makefile for the Kortex Project

# Build and start all services in detached mode.
up:
	docker-compose up --build -d

# Stop all running services.
down:
	docker-compose down

# Runs the full setup process: starts containers, waits, applies migrations, and seeds.
setup: up
	@echo "Waiting for database to be healthy..."
	@timeout /t 5 > NUL
	$(MAKE) migrate
	$(MAKE) seed
	@echo "Setup complete! Application is ready at https://localhost"

# Apply database migrations to the development database.
migrate:
	docker-compose exec backend npx prisma migrate deploy

# Seed the development database with a test user.
seed:
	docker-compose exec backend npm run seed

# Run the backend integration tests.
test:
	docker-compose exec backend npm test

# Follow the logs of all services.
logs:
	docker-compose logs -f

# Stop all services and remove all volumes (deletes all data).
clean:
	docker-compose down -v --remove-orphans