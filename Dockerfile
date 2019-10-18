FROM node:10.13-alpine
ENV NODE_ENV production
ENV DRONE_URL <URL>
ENV DRONE_TOKEN <TOKEN>
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 3000
CMD npm start