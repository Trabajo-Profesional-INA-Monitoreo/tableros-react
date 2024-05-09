SHELL := /bin/bash
PWD := $(shell pwd)

run:
	npm install
	npm start
.PHONY: run

docker-run:
	docker-compose up
.PHONY: docker-run