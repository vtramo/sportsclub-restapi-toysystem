#!/bin/bash

if [[ $# -ne 3 ]]; then
	echo "Correct usage: $0 <jdk> <java_version> <port>"
	exit 1
fi

JDK=$1
JAVA_VER=$2
PROJECT_NAME="sportsclub-$JDK-$JAVA_VER-test"
APP_CONTAINER_NAME="$PROJECT_NAME-app-1"

SERVER=
PORT=$3

ITERATIONS=10
MAX_RETRIES=60

for ((i=0; i < ${ITERATIONS}; i++)); do
	echo "password" | sudo -S make JAVA_VERSION=$JAVA_VER up_test_$JDK

	declare -i count=0
	while [[ $(docker inspect $APP_CONTAINER_NAME -f {{.State.Health.Status}}) != "healthy" ]]; do
    		count+=1 && sleep 1
    		if [[ $count -ge $MAX_RETRIES ]]; then
      			echo "Timeout"
      			exit 1
    		fi
  	done

	curl -sb -H "http://$SERVER:$PORT/api/actuator/prometheus" | grep "^application_started_time_seconds" | awk '{print $2}' | tee --append ./stats/cold-start/$PROJECT_NAME-cold-start.txt
	[[ $((i+1)) -lt ${ITERATIONS} ]] && docker compose -f ./docker-compose.yml -f ./docker-compose-test.yml -p $PROJECT_NAME down
done
make JAVA_VERSION=$JAVA_VER down_test_$JDK