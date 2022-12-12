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

_builder:
	DOCKER_BUILDKIT=1 docker build \
		-t ${DOCKER_USERNAME}/${APPLICATION_NAME}:${_BUILD_ARGS_RELEASE_TAG} \
		-f ${_BUILD_ARGS_DOCKERFILE} . \
		--build-arg JAVA_VERSION=${JAVA_VERSION}

run:
	$(MAKE) _runner

run_%:
	@if [ $* = "native" ]; then \
		$(MAKE) _runner -e _BUILD_ARGS_RELEASE_TAG="native-java-${JAVA_VERSION}"; \
	elif [ $* = "graalvm" ]; then \
	  	$(MAKE) _runner -e _BUILD_ARGS_RELEASE_TAG="graalvm-${JAVA_VERSION}"; \
  	elif [ $* = "openj9" ]; then \
  	  	$(MAKE) _runner -e _BUILD_ARGS_RELEASE_TAG="openj9-${JAVA_VERSION}"; \
	else \
	  	echo "You can only user run, run_native, run_graalvm or run_openj9"; \
  	fi

_runner:
	docker container run --rm -dp 8083:${APPLICATION_CONTAINER_PORT} ${DOCKER_USERNAME}/${APPLICATION_NAME}:${_BUILD_ARGS_RELEASE_TAG}


COMPOSE_FILE_ORDER_DEV='-f ./docker-compose.yml -f ./docker-compose-dev.yml'
COMPOSE_FILE_ORDER_TEST='-f ./docker-compose.yml -f ./docker-compose-test.yml'

OPENJDK_DEV_PORT=8090
OPENJDK_TEST_PORT=8091
GRAALVM_DEV_PORT=8092
GRAALVM_TEST_PORT=8093
OPENJ9_DEV_PORT=8094
OPENJ9_TEST_PORT=8095
NATIVE_DEV_PORT=8096
NATIVE_TEST_PORT=8097

up_%:
	@if [ $* = "dev" ]; then \
		$(MAKE) _upper \
			-e _UP_ARGS_DOCKER_FILE="Dockerfile" \
			-e _UP_ARGS_COMPOSE_FILE_ORDER=${COMPOSE_FILE_ORDER_DEV} \
			-e _UP_ARGS_PORT=${OPENJDK_DEV_PORT} \
			-e _UP_ARGS_JAVA_VERSION=${JAVA_VERSION} \
			-e _UP_ARGS_PROJECT_NAME=${APPLICATION_NAME}-openjdk-${JAVA_VERSION}-dev; \
	elif [ $* = "test" ]; then \
		$(MAKE) _upper \
			-e _UP_ARGS_DOCKER_FILE="Dockerfile" \
			-e _UP_ARGS_COMPOSE_FILE_ORDER=${COMPOSE_FILE_ORDER_TEST} \
			-e _UP_ARGS_PORT=${OPENJDK_TEST_PORT} \
			-e _UP_ARGS_JAVA_VERSION=${JAVA_VERSION} \
			-e _UP_ARGS_PROJECT_NAME=${APPLICATION_NAME}-openjdk-${JAVA_VERSION}-test; \
	elif [ $* = "dev_graalvm" ]; then \
		$(MAKE) _upper \
			-e _UP_ARGS_DOCKER_FILE="Dockerfile.graalvm" \
			-e _UP_ARGS_COMPOSE_FILE_ORDER=${COMPOSE_FILE_ORDER_DEV} \
			-e _UP_ARGS_PORT=${GRAALVM_DEV_PORT} \
			-e _UP_ARGS_JAVA_VERSION=${JAVA_VERSION} \
			-e _UP_ARGS_PROJECT_NAME=${APPLICATION_NAME}-graalvm-${JAVA_VERSION}-dev; \
	elif [ $* = "test_graalvm" ]; then \
	  	$(MAKE) _upper \
			-e _UP_ARGS_DOCKER_FILE="Dockerfile.graalvm" \
			-e _UP_ARGS_COMPOSE_FILE_ORDER=${COMPOSE_FILE_ORDER_TEST} \
			-e _UP_ARGS_PORT=${GRAALVM_TEST_PORT} \
			-e _UP_ARGS_JAVA_VERSION=${JAVA_VERSION} \
			-e _UP_ARGS_PROJECT_NAME=${APPLICATION_NAME}-graalvm-${JAVA_VERSION}-test; \
	elif [ $* = "dev_openj9" ]; then \
		$(MAKE) _upper \
			-e _UP_ARGS_DOCKER_FILE="Dockerfile.openj9" \
			-e _UP_ARGS_COMPOSE_FILE_ORDER=${COMPOSE_FILE_ORDER_DEV} \
			-e _UP_ARGS_PORT=${GRAALVM_DEV_PORT} \
			-e _UP_ARGS_JAVA_VERSION=${JAVA_VERSION} \
			-e _UP_ARGS_PROJECT_NAME=${APPLICATION_NAME}-openj9-${JAVA_VERSION}-dev; \
	elif [ $* = "test_openj9" ]; then \
	  	$(MAKE) _upper \
			-e _UP_ARGS_DOCKER_FILE="Dockerfile.openj9" \
			-e _UP_ARGS_COMPOSE_FILE_ORDER=${COMPOSE_FILE_ORDER_TEST} \
			-e _UP_ARGS_PORT=${GRAALVM_TEST_PORT} \
			-e _UP_ARGS_JAVA_VERSION=${JAVA_VERSION} \
			-e _UP_ARGS_PROJECT_NAME=${APPLICATION_NAME}-openj9-${JAVA_VERSION}-test; \
  	elif  [ $* = "dev_native" ]; then \
	  	$(MAKE) _upper \
			-e _UP_ARGS_DOCKER_FILE="Dockerfile.native" \
			-e _UP_ARGS_COMPOSE_FILE_ORDER=${COMPOSE_FILE_ORDER_DEV} \
			-e _UP_ARGS_PORT=${NATIVE_DEV_PORT} \
			-e _UP_ARGS_JAVA_VERSION=${JAVA_VERSION} \
			-e _UP_ARGS_PROJECT_NAME=${APPLICATION_NAME}-native-${JAVA_VERSION}-dev; \
  	elif [ $* = "test_native" ]; then \
	  	$(MAKE) _upper \
			-e _UP_ARGS_DOCKER_FILE="Dockerfile.native" \
			-e _UP_ARGS_COMPOSE_FILE_ORDER=${COMPOSE_FILE_ORDER_TEST} \
			-e _UP_ARGS_PORT=${NATIVE_TEST_PORT} \
			-e _UP_ARGS_JAVA_VERSION=${JAVA_VERSION} \
			-e _UP_ARGS_PROJECT_NAME=${APPLICATION_NAME}-native-${JAVA_VERSION}-test; \
	else \
  		echo "You can only use up_dev, up_test, up_dev_graalvm, up_test_graalvm, up_dev_native or up_test_native!"; \
  		exit 1; \
  	fi

_upper:
	DOCKER_FILE=${_UP_ARGS_DOCKER_FILE} \
	PORT=${_UP_ARGS_PORT} \
	JAVA_VERSION=${_UP_ARGS_JAVA_VERSION} \
	docker compose ${_UP_ARGS_COMPOSE_FILE_ORDER} -p ${_UP_ARGS_PROJECT_NAME} up -d