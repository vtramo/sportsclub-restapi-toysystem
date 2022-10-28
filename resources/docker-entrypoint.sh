#!/bin/sh
set -ue

if [ "$#" -eq 0 ] 
   then
    set -- \
        java -Djava.security.egd=file:/dev/./urandom \
             -cp 'app:app/lib/*' "$app_mainclass"
fi

exec "$@"
