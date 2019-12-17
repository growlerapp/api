FROM node:12.13.1-alpine as builder

# ARGS for node
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

WORKDIR /usr/src/app

# Install npm dependencies
COPY package.json package-lock.* /usr/src/app/
RUN npm i

FROM node:12.13.1-alpine

LABEL maintainer "Leonardo Gatica <lgatica@protonmail.com>"

ENV NODE_ENV=$NODE_ENV PORT=3000

WORKDIR /usr/src/app

# Copy source code
COPY . /usr/src/app
# Copy node_modules from builder
COPY --from=builder /usr/src/app/node_modules /usr/src/app/node_modules

EXPOSE $PORT

CMD [ "node", "src" ]
