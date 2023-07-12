FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i

USER node

COPY . .

EXPOSE 3000

ENV DB=rss_data

ENV DB_URL=mongodb://database:27017

CMD npm start