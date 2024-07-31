FROM node:alpine

WORKDIR /usr/src/server.js

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
