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

JDKS_AVAIABLE='openjdk graalvm openj9 native'

declare -A java_version_supported_by_jdk
java_version_supported_by_jdk['openjdk']='17 18 19'
java_version_supported_by_jdk['graalvm']='17 19'
java_version_supported_by_jdk['openj9']='17'
java_version_supported_by_jdk['native']='17 19'

function start_performance_test {
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

  # Start app
  sshpass -p "$SSH_PASSWORD" ssh "$SSH_USERNAME@$SSH_HOST" \
    "cd ${SSH_WORKDIR}; make JAVA_VERSION=${JAVA_VERSION} up_test_${JDK}" || exit 1
  echo "Waiting for the application to be ready..." && sleep 5

  local JMETER_OUTPUT_DIRECTORY_PATH="./results-${JDK}-${JAVA_VERSION}"
  mkdir ${JMETER_OUTPUT_DIRECTORY_PATH}
  execute_jmeter_script ${JMETER_OUTPUT_DIRECTORY_PATH} ${port_by_jdk["${JDK}"]}

  # Throw down the app
  sshpass -p "$SSH_PASSWORD" ssh "$SSH_USERNAME@$SSH_HOST" \
    "cd ${SSH_WORKDIR}; make JAVA_VERSION=${JAVA_VERSION} down_test_${JDK}"
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

start_performance_test 'graalvm' '17'
start_performance_test 'graalvm' '19'

start_performance_test 'openj9' '17'

start_performance_test 'native' '17'
#start_performance_test 'native' '19'