#!/bin/sh

if [ "$#" -eq 0 ];
  exit 1
fi

if [ -z "$DB_URL" ]; then
  DB_URL="http://localhost:5432/"
fi

# Dependency check bd (check only if the url exists)
curl --head --silent --fail "$DB_URL" > /dev/null  || exit 1

exec "$@"
