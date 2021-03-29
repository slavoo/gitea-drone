FROM node:10.13-alpine

##############################################################################
## BUILD, TEST, PUBLISH

WORKDIR /app

COPY ["package.json", "package-lock.json*", "dist", "./"]

ENV DRONE_URL SET_TO_DRONE_URL
ENV DRONE_TOKEN SET_TO_DRONE_AUTH_TOKEN
ENV PORT 80
EXPOSE 80

ENV NODE_ENV production

CMD npm start

