# Makefile for the X99 Project

# Build and start all services in detached mode.
up:
	docker-compose up --build -d

# Stop all running services.
down:
	docker-compose down

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