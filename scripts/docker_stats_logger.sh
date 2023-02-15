#!/bin/bash

if [[ $# -ne 1 ]]; then
	echo "Correct usage: $0 <container>"
	exit 1
fi

OUTPUT_FILE_PATH="stats/resource-usage/test2/resource-usage-$1.txt"

echo "$$" > docker-stats-logger-pid.txt

while true; do docker stats --no-stream $@ | tail -1 | tee --append ${OUTPUT_FILE_PATH}; done
