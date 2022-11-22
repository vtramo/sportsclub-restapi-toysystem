# Build Stage
FROM maven AS build-stage

WORKDIR /usr/sports-club-api
COPY ./pom.xml ./pom.xml
COPY ./src ./src

RUN mvn package -Dmaven.test.skip
RUN mkdir -p target/dependency && (cd target/dependency; jar -xf ../*.jar)

# Final Stage
FROM openjdk:11-jdk-slim

ARG BUILD_STAGE_WORKDIR=/usr/sports-club-api
ARG DEPENDENCY=target/dependency
COPY --from=build-stage ${BUILD_STAGE_WORKDIR}/${DEPENDENCY}/META-INF           /app/META-INF
COPY --from=build-stage ${BUILD_STAGE_WORKDIR}/${DEPENDENCY}/BOOT-INF/classes   /app
COPY --from=build-stage ${BUILD_STAGE_WORKDIR}/${DEPENDENCY}/BOOT-INF/lib       /app/lib

ENTRYPOINT ["java","-cp","/app:/app/lib/*","systems.fervento.sportsclub.SportsClubApp"]