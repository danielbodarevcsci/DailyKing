#start-containers.sh

#!/bin/sh
cd /home/mubin/devopspipeline

docker-compose build
docker-compose up -d