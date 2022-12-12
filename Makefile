APPLICATION_NAME ?= sportsclub
DOCKER_USERNAME ?= vtramo
JAVA_VERSION ?= 17
JDK ?= openjdk

_BUILD_ARGS_DOCKERFILE ?= Dockerfile
_BUILD_ARGS_RELEASE_TAG ?= "${JDK}-${JAVA_VERSION}"

build:
	$(MAKE) _builder

build_%:
	$(MAKE) _builder \
		-e _BUILD_ARGS_DOCKERFILE="Dockerfile.$*" \
		-e _BUILD_ARGS_RELEASE_TAG="$*-${JAVA_VERSION}"

run:
	$(MAKE) _runner

run_%:
ifeq ($($*), native)
	_BUILD_ARGS_RELEASE_TAG="native-${JAVA_VERSION}"
	JDK="graalvm"
endif
	$(MAKE) _runner -e _BUILD_ARGS_RELEASE_TAG="native-java-${JAVA_VERSION}"

up_%:
ifeq ($($*), dev)
	PROJECT_NAME="${APPLICATION_NAME}-${JDK}-${JAVA_VERSION}"
	COMPOSE_FILE_ORDER="-f docker-compose.yml -f docker-compose-dev-yml"
else ifeq ($($*), test)
	COMPOSE_FILE_ORDER="-f docker-compose.yml -f docker-compose-test.yml"
else ifeq ($($*), dev_native)

else
	@echo "You can only use make up_dev or make up_test!"
	exit
endif
	docker compose $COMPOSE_FILE_ORDER

_builder:
	DOCKER_BUILDKIT=1 docker build \
		-t ${DOCKER_USERNAME}/${APPLICATION_NAME}:${_BUILD_ARGS_RELEASE_TAG} \
		-f ${_BUILD_ARGS_DOCKERFILE} . \
		--build-arg JAVA_VERSION=${JAVA_VERSION}

_runner:
	docker container run -dp 8083:8083 ${DOCKER_USERNAME}/${APPLICATION_NAME}:${_BUILD_ARGS_RELEASE_TAG}