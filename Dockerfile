FROM node:21-alpine3.18

# Instalação do pacote fontconfig
RUN apk --no-cache add fontconfig

RUN mkdir -p /tmp/uploads
RUN mkdir -p /tmp/certificates

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]
