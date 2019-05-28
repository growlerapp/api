#!/usr/env sh

set -euxo pipefail

# Docker login
echo "$HEROKU_API_KEY" | docker login --username=_ --password-stdin registry.heroku.com
# Docker build image
docker build -t registry.heroku.com/$HEROKU_APP_NAME/$HEROKU_APP_TYPE .
# Docker push image
docker push registry.heroku.com/$HEROKU_APP_NAME/$HEROKU_APP_TYPE
# Get docker image id
IMAGE_ID=$(docker inspect registry.heroku.com/$HEROKU_APP_NAME/$HEROKU_APP_TYPE --format={{.Id}})
# Trigger new container release in heroku
PAYLOAD='{"updates":[{"type":"'"$HEROKU_APP_TYPE"'","docker_image":"'"$IMAGE_ID"'"}]}'
curl -n -X PATCH https://api.heroku.com/apps/$HEROKU_APP_NAME/formation \
  -d "$PAYLOAD" \
  -H "Content-Type: application/json" \
  -H "Accept: application/vnd.heroku+json; version=3.docker-releases" \
  -H "Authorization: Bearer $HEROKU_API_KEY"
