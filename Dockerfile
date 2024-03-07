FROM node:21.6-alpine3.18
RUN mkdir -p /tmp/uploads
RUN mkdir -p /tmp/certificates

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]
