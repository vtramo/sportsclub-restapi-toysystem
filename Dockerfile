ARG JAVA_VERSION=17
ARG BUILD_STAGE_WORKDIR=/home/sports-club-api

#--- Build Stage ---#
FROM openjdk:${JAVA_VERSION} AS build-stage

# Maven Version and Link to download Maven
ARG MAVEN_VERSION=3.8.6
ARG MAVEN_DOWNLOAD_LINK=https://dlcdn.apache.org/maven/maven-3/$MAVEN_VERSION/binaries/apache-maven-$MAVEN_VERSION-bin.tar.gz

# Download and Install Maven
RUN curl -L -O $MAVEN_DOWNLOAD_LINK
ARG MAVEN_DIRECTORY_NAME=apache-maven-$MAVEN_VERSION
ARG MAVEN_TAR_GZ=$MAVEN_DIRECTORY_NAME-bin.tar.gz
RUN tar -xf $MAVEN_TAR_GZ
ENV M2_HOME=/$MAVEN_DIRECTORY_NAME
ENV PATH=$M2_HOME/bin:$PATH
RUN rm $MAVEN_TAR_GZ

ARG BUILD_STAGE_WORKDIR
WORKDIR ${BUILD_STAGE_WORKDIR}

ARG JAVA_VERSION

# Fetch all application dependencies
COPY ./pom.xml ./pom.xml
RUN mvn '-Djava.version=${JAVA_VERSION}' dependency:go-offline -DexcludeGroupIds=org.openapitools

# Compile and package the application
COPY ./src ./src
RUN --mount=type=cache,target=/root/.m2 mvn '-Djava.version=${JAVA_VERSION}' -Dmaven.test.skip package   \
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
HEALTHCHECK CMD curl -f http://localhost:8083/api/actuator/health