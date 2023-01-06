ARG JAVA_VERSION=17
ARG BUILD_STAGE_WORKDIR=/home/sports-club-api

#--- Build Stage ---#
FROM openjdk:${JAVA_VERSION} AS build-stage

ARG BUILD_STAGE_WORKDIR
WORKDIR ${BUILD_STAGE_WORKDIR}

# Copy Maven Wrapper
COPY ./.mvn ./.mvn
COPY ./mvnw .
RUN chmod 744 ./mvnw

ARG JAVA_VERSION

# Fetch all application dependencies
COPY ./pom.xml ./pom.xml

RUN ./mvnw '-Djava.version=${JAVA_VERSION}' dependency:go-offline -DexcludeGroupIds=org.openapitools

# Compile and package the application
COPY ./src ./src
RUN --mount=type=cache,target=/root/.m2 ./mvnw '-Djava.version=${JAVA_VERSION}' -Dmaven.test.skip package   \
  && mkdir -p target/dependency  \
  && cd target/dependency \
  && jar -xf ../*.jar

#--- Final Stage ---#
FROM openjdk:${JAVA_VERSION}-jdk-slim

ARG BUILD_STAGE_WORKDIR
ARG DEPENDENCY=target/dependency
COPY --from=build-stage ${BUILD_STAGE_WORKDIR}/${DEPENDENCY}/META-INF           /app/META-INF
COPY --from=build-stage ${BUILD_STAGE_WORKDIR}/${DEPENDENCY}/BOOT-INF/classes   /app
COPY --from=build-stage ${BUILD_STAGE_WORKDIR}/${DEPENDENCY}/BOOT-INF/lib       /app/lib

RUN apt-get update \
  && apt-get install -y curl

ENTRYPOINT ["java","-cp","/app:/app/lib/*","systems.fervento.sportsclub.SportsClubApp"]

EXPOSE 8083
HEALTHCHECK CMD curl -f http://localhost:8083/api/actuator/health || exit 1