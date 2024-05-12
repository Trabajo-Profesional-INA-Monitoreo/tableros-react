SHELL := /bin/bash
PWD := $(shell pwd)

run:
	npm install
	npm start
.PHONY: run

docker-run:
	docker-compose -f docker-compose.yaml up -d --build
.PHONY: docker-run