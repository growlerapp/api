#!/usr/env sh

if [[ -z "${HEROKU_API_KEY}" ]]; then
  echo "A heroku api key must be created and set in the \`HEROKU_API_KEY\` environment variable on your CI environment."
  exit 1
fi
if [[ -z "${HEROKU_APP_NAME}" ]]; then
  echo "A heroku app name must be set in the \`HEROKU_APP_NAME\` environment variable on your CI environment."
  exit 1
fi
if [[ -z "${HEROKU_APP_TYPE}" ]]; then
  echo "A heroku app type (web or worker) must be set in the \`HEROKU_APP_TYPE\` environment variable on your CI environment."
  exit 1
fi
exit 0
