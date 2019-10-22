FROM node:10.13-alpine

##############################################################################
## BUILD, TEST, PUBLISH

WORKDIR /build

COPY ["package.json", "package-lock.json*", "tsconfig.json", "./"]

COPY ["src", "src"]

RUN npm install --silent && \
    npm run test:coverage && \
    npm run build:prod && \
    mkdir /app && \
    mv package.json package-lock.json dist /app/ && \
    rm -rf /build

##############################################################################
## PREPARE PROD HOSTING

ENV DRONE_URL SET_TO_DRONE_URL
ENV DRONE_TOKEN SET_TO_DRONE_AUTH_TOKEN
ENV PORT 80
EXPOSE 80

# SET TO PROD AND DOWNLOAD OPERATIONAL DEPENDENCIES
ENV NODE_ENV production
WORKDIR /app
RUN npm install --silent

CMD npm start
