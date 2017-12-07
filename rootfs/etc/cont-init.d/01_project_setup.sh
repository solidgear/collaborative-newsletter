#!/usr/bin/with-contenv bash

FILE="/root/installed"

FE_DIRECTORY="/var/www/html"
BE_DIRECTORY="/opt/nodeapp"

if [ -f "$FILE" ]
then
    echo "Container already installed"
else
    echo "Clean container"

    if [ -f "$BE_DIRECTORY/package.json" ]
    then
        echo "Execute BE NPM"
        cd $BE_DIRECTORY && npm install
        npm rebuild bcrypt --build-from-source
        cp $BE_DIRECTORY/config_sample.json $BE_DIRECTORY/config.json
	    node ./tools/db_init.js
    fi

    if [ -f "$FE_DIRECTORY/package.json" ]
    then
        echo "Execute FE NPM"
        cd $FE_DIRECTORY && npm install && npm run install 
        cp $FE_DIRECTORY/src/app/config.sample.json $FE_DIRECTORY/src/app/config.json

        echo "Execute FE ng build"
        cd $FE_DIRECTORY && ng build
    fi

    touch $FILE
fi
