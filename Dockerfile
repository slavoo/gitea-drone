FROM node:10.13-alpine

ENV DRONE_URL <URL>
ENV DRONE_TOKEN <TOKEN>

WORKDIR /build

COPY ["package.json", "package-lock.json*", "tsconfig.json", "./"]
COPY src/app src/app

RUN npm install --silent && \
    node node_modules/typescript/bin/tsc --sourceMap false && \
    ls -l && \
    mkdir /app && \
    mv package.json package-lock.json dist /app/ && \
    rm -rf node_modules

WORKDIR /app

ENV NODE_ENV production

RUN npm install --silent

ENV PORT 3000
EXPOSE 3000
CMD node dist/app/bin/www.js