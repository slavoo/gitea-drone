##############################################################
# compile and unit test ######################################
##############################################################
FROM node:10.13-alpine

WORKDIR /build

COPY . .

RUN sh compile_and_test.sh


##############################################################
# build container ############################################
##############################################################
FROM node:10.13-alpine

WORKDIR /app

COPY --from=0 /build/package.json /build/package-lock.json* /build/dist ./

ENV DRONE_URL SET_TO_DRONE_URL
ENV DRONE_TOKEN SET_TO_DRONE_AUTH_TOKEN
ENV PORT 80
EXPOSE 80

ENV NODE_ENV production

CMD npm start
