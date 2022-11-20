#!/bin/bash

if [ $# -ne 1 ]; then
  echo "Correct usage: $0 <jdk>" # openjdk-11-jdk-slim | graalvm
  exit 1
fi

JDK=$1

mvn package -Dmaven.test.skip
mkdir -p target/dependency && (cd target/dependency; jar -xf ../*.jar)
docker build -t vtramo/sports-club-api:$1 .
