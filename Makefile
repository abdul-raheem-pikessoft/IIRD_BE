# Define the default target
default: help

# Help target
help:
	@echo "Usage: make <target>"
	@echo ""
	@echo "Targets:"
	@echo "  install        install dependencies mentioned in package.json file"
	@echo "  build        	Compile build"
	@echo "  start-dev      Start your dev server"
	@echo "  stop-dev       Stop dev server including container(s)"
	@echo "  help           Show this help message"

install:
	docker-compose -f docker-compose.builder.yml run --rm install
build:
	docker-compose -f docker-compose.builder.yml run --rm build
start-dev:
	docker-compose up
stop-dev:
	docker-compose down
start-seed:
	docker-compose -f docker-compose.builder.yml run --rm seed
start-migration:
	docker-compose -f docker-compose.builder.yml run --rm migration
