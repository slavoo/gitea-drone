FROM node:10.13-alpine

ENV DRONE_URL <URL>
ENV DRONE_TOKEN <TOKEN>

WORKDIR /build

COPY ["package.json", "package-lock.json*", "tsconfig.json", "./"]

COPY ["src", "src"]

RUN npm install --silent && \
    npm test && \
    npm run-script build:prod && \
    mkdir /app && \
    mv package.json package-lock.json dist /app/ && \
    rm -rf /build

WORKDIR /app

ENV NODE_ENV production

RUN npm install --silent

ENV PORT 3000
EXPOSE 3000
CMD npm start