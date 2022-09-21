DC_FILE = ./docker-compose.yml
HOME = /home/$(USER)
DOCKER_COMPOSE = docker-compose -p transcendence_network --file $(DC_FILE)

TEST=`docker volume ls -q`

all:
	mkdir -p ./frontend/volume
	mkdir -p ./backend/volume
	mkdir -p ./data/pgadmin
	mkdir -p ./data/postgresdb
	$(DOCKER_COMPOSE) up -d --build

up:
	$(DOCKER_COMPOSE) up -d

down:
	$(DOCKER_COMPOSE) down

clear_volume: down
	docker volume rm $(TEST)

clear: clear_volume
	docker system prune -af
	sudo rm -rf ./frontend/volume/node_modules
	sudo rm -rf ./backend/volume/node_modules
	sudo rm -rf ./backend/volume/dist
	sudo cp -rf ./frontend/volume/* ./frontend/react/
	sudo cp -rf ./backend/volume/* ./backend/nest/
	sudo chmod 775 ./backend/
	sudo chmod 775 ./frontend/
	sudo rm -rf ./frontend/volume
	sudo rm -rf ./backend/volume
	sudo rm -rf ./data

re: clear all
