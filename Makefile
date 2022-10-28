
PROJECT_NAME=
MKFILE_DIR=$(shell pwd)

.PHONY: clean build version start test

MVN=docker run --rm -i --privileged -v /var/run/docker.sock:/var/run/docker.sock --name $(PROJECT_NAME)-mvn -v  $(MKFILE_DIR)/.m2:/root/.m2 -v $(MKFILE_DIR):/usr/src/app -w /usr/src/app maven:3.6.0-jdk-8-alpine mvn

export APP_VERSION = $(shell grep '<!--POM_VERSION_LINE//-->' ./pom.xml | cut -d ">" -f2 | cut -d "<" -f1)

clean:
	-rm -rf $(MKFILE_DIR)/.m2
	$(MVN) clean

build:
	$(MVN) clean install -P docker -DskipTests

version:
	@echo App version: $(APP_VERSION)

start:
	docker-compose -f docker-compose.yml up -d

test:
	docker-compose -f docker-compose.yml -f docker-compose-testing.yml up -d



