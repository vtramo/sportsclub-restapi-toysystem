#!/bin/bash

# JMeter config - You need to set this variables!
JMETER_HOME=
JMETER_SCRIPT_PATH=

# SSH config - You need to set this variables!
SSH_HOST=
SSH_USERNAME=
SSH_PASSWORD=
SSH_WORKDIR=

# App config - You need to set this variables!
HOST=
declare -A port_by_jdk
port_by_jdk['openjdk']=8091
port_by_jdk['graalvm']=8093
port_by_jdk['openj9']=8095
port_by_jdk['native']=8097
port_by_jdk['native-g1']=8097

# JDKS config
JDKS_AVAIABLE='openjdk graalvm openj9 native native-g1'
declare -A java_version_supported_by_jdk
java_version_supported_by_jdk['openjdk']='17 18 19'
java_version_supported_by_jdk['graalvm']='17 19'
java_version_supported_by_jdk['openj9']='17'
java_version_supported_by_jdk['native']='17 19'
java_version_supported_by_jdk['native-g1']='17 19'

function SSH() {
  local COMMANDS_TO_EXECUTE="$*"
  sshpass -p $SSH_PASSWORD ssh $SSH_USERNAME@$SSH_HOST ${COMMANDS_TO_EXECUTE}
}

function start_performance_test() {
  local JDK="$1"
  if [[ ! "${JDKS_AVAIABLE}" =~ "${JDK}" ]]; then
    echo "${FUNCNAME}(): this JDK (${JDK:-NotSpecified}) is not available!"
    exit 1
  fi

  local JAVA_VERSION_SUPPORTED=${java_version_supported_by_jdk["${JDK}"]}
  local JAVA_VERSION="$2"
  if [[ ! "${JAVA_VERSION_SUPPORTED}" =~ "${JAVA_VERSION}" ]]; then
    echo "${FUNCNAME}(): this Java Version (${JAVA_VERSION:-NotSpecified} - ${JDK}) is not supported!"
    exit 1
  fi

  start_app $JDK $JAVA_VERSION

  echo "Waiting for the application to be ready..."
  wait_container_healthy_status $JDK $JAVA_VERSION
  echo "Application ready and healthy."

  # start docker stats logger
  local CONTAINER_NAME="sportsclub-$JDK-$JAVA_VERSION-test-app-1"
  SSH "cd $SSH_WORKDIR; sudo -S <<< $SSH_PASSWORD screen -d -m ./docker-stats-logger.sh $CONTAINER_NAME"

  local JMETER_OUTPUT_DIRECTORY_PATH="./test2/results-$JDK-$JAVA_VERSION"
  mkdir $JMETER_OUTPUT_DIRECTORY_PATH
  execute_jmeter_script $JMETER_OUTPUT_DIRECTORY_PATH ${port_by_jdk[$JDK]}

  down_app $JDK $JAVA_VERSION

  # kill docker stats logger
  SSH "sudo -S <<< $SSH_PASSWORD pkill -F $SSH_WORKDIR/docker-stats-logger-pid.txt; rm $SSH_WORKDIR/docker-stats-logger-pid.txt"
}

function start_app() {
  local JDK="$(echo $1 | sed 's/-/_/g')"
  local JAVA_VERSION="$2"
  SSH "cd $SSH_WORKDIR; sudo -S <<< $SSH_PASSWORD make JAVA_VERSION=$JAVA_VERSION up_test_$JDK"
}

function wait_container_healthy_status() {
  local JDK="$1"
  local JAVA_VERSION="$2"
  local CONTAINER_NAME="sportsclub-$JDK-$JAVA_VERSION-test-app-1"

  local MAX_ITERATIONS=60
  declare -i count=0
  while [[ $(get_container_status $CONTAINER_NAME) != "healthy" ]]; do
    count+=1 && sleep 1
    if [[ $count -ge $MAX_ITERATIONS ]]; then
      echo "Timeout - Application Status: $(get_container_status $CONTAINER_NAME)"
      down_app $JDK $JAVA_VERSION
    fi
  done
}

function down_app() {
  local JDK="$(echo $1 | sed 's/-/_/g')"
  local JAVA_VERSION="$2"
  SSH "cd $SSH_WORKDIR; sudo -S <<< $SSH_PASSWORD make JAVA_VERSION=$JAVA_VERSION down_test_$JDK"
}

function get_container_status() {
  local CONTAINER_NAME="$1"
  status=$(SSH "cd $SSH_WORKDIR; sudo -S <<< $SSH_PASSWORD docker inspect $CONTAINER_NAME -f {{.State.Health.Status}}")
  echo $status
}

function execute_jmeter_script() {
  local JMETER_OUTPUT_DIRECTORY_PATH="$1"
  local PORT="$2"
  DIR_IS_NOT_EMPTY=$(ls -A ${JMETER_OUTPUT_DIRECTORY_PATH})
  if [[ ! -d ${JMETER_OUTPUT_DIRECTORY_PATH} || "${DIR_IS_NOT_EMPTY}"  ]]; then
    echo "${FUNCNAME}(): ${JMETER_OUTPUT_DIRECTORY_PATH:-?} must be an empty directory!"
    exit 1
  fi

  $JMETER_HOME/bin/jmeter -n \
    -t "${JMETER_SCRIPT_PATH}" \
    -l ${JMETER_OUTPUT_DIRECTORY_PATH}/results.csv \
    -e -o ${JMETER_OUTPUT_DIRECTORY_PATH} \
    -Jhost=${HOST} \
    -Jport=${PORT}
}

#start_performance_test 'openjdk' '17'
#start_performance_test 'openjdk' '18'
#start_performance_test 'openjdk' '19'

#start_performance_test 'graalvm' '17'
#start_performance_test 'graalvm' '19'

#start_performance_test 'openj9' '17'

#start_performance_test 'native' '17'
#start_performance_test 'native' '19'

start_performance_test 'native-g1' '17'
start_performance_test 'native-g1' '19'
