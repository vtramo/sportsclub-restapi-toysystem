FROM openjdk:11-jdk-slim AS release
VOLUME /tmp

ADD resources/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# This Dockerfile has a DEPENDENCY parameter pointing to a directory where we have unpacked the fat jar. 
# If we get that right, it already contains a BOOT-INF/lib directory with the dependency jars in it, 
# and a BOOT-INF/classes directory with the application classes in it. 
#
#  Notice that we are using the application’s own main class (this is faster than using the indirection provided by the fat jar launcher).

# Add Maven dependencies (not shaded into the artifact; Docker-cached)
ARG DEPENDENCY=target/dependency
COPY ${DEPENDENCY}/META-INF /app/META-INF
COPY ${DEPENDENCY}/BOOT-INF/classes /app
COPY ${DEPENDENCY}/BOOT-INF/lib /app/lib

# Add the service itself
ARG JAR_FILE
ARG APPLICATION_MAINCLASS
ARG IMPLEMENTATION_TITLE
ARG IMPLEMENTATION_VERSION
ARG IMPLEMENTATION_BUILD_NUMBER
ENV app_mainclass=$APPLICATION_MAINCLASS
ENV IMPLEMENTATION_TITLE=$IMPLEMENTATION_TITLE
ENV IMPLEMENTATION_VERSION=$IMPLEMENTATION_VERSION
ENV IMPLEMENTATION_BUILD_NUMBER=$IMPLEMENTATION_BUILD_NUMBER

ADD target/${JAR_FILE}.original /usr/share/app/app.jar
ENTRYPOINT ["/docker-entrypoint.sh"]


