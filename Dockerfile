FROM openjdk:11-jdk-slim

ARG DEPENDENCY=target/dependency
COPY ${DEPENDENCY}/META-INF /app/META-INF
COPY ${DEPENDENCY}/BOOT-INF/classes /app
COPY ${DEPENDENCY}/BOOT-INF/lib /app/lib

ENTRYPOINT ["java","-cp","/app:/app/lib/*","systems.fervento.sportsclub.SportsClubApp"]
