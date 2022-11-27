#--- Build Stage ---#
FROM maven:3.8.6-openjdk-18 AS build-stage

WORKDIR /usr/sports-club-api

# Fetch all application dependencies
COPY ./pom.xml ./pom.xml
RUN mvn dependency:go-offline -DexcludeGroupIds=org.openapitools

# Compile and package the application
COPY ./src ./src
RUN mvn package -Dmaven.test.skip \
  && mkdir -p target/dependency  \
  && cd target/dependency \
  && jar -xf ../*.jar

#--- Final Stage ---#
FROM openjdk:11-jdk-slim

ARG BUILD_STAGE_WORKDIR=/usr/sports-club-api
ARG DEPENDENCY=target/dependency
COPY --from=build-stage ${BUILD_STAGE_WORKDIR}/${DEPENDENCY}/META-INF           /app/META-INF
COPY --from=build-stage ${BUILD_STAGE_WORKDIR}/${DEPENDENCY}/BOOT-INF/classes   /app
COPY --from=build-stage ${BUILD_STAGE_WORKDIR}/${DEPENDENCY}/BOOT-INF/lib       /app/lib

RUN apt-get update \
  && apt-get install -y curl

COPY resources/docker-entrypoint.sh .
CMD chmod 744 ./docker-entrypoint.sh
ENTRYPOINT ["./docker-entrypoint.sh", "java", "-cp", "/app:/app/lib/*", "systems.fervento.sportsclub.SportsClubApp"]

EXPOSE 8083
HEALTHCHECK CMD curl -f http://localhost:8083/api/actuator/health