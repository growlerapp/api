FROM lgatica/node-build:10-onbuild

RUN apk add --no-cache curl

EXPOSE 3000

HEALTHCHECK --interval=5m --timeout=3s \
  CMD curl -f http://localhost:3000/healthcheck || exit 1
