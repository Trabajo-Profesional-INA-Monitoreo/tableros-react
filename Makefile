SHELL := /bin/bash
PWD := $(shell pwd)

run:
	npm install
	npm start
.PHONY: run

docker-run:
	docker-compose -f docker-compose.yaml up -d 
.PHONY: docker-run

docker-image:
	docker build -f ./Dockerfile -t "web-monitoreo:latest" .
.PHONY: docker-image