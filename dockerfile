FROM node:14.15.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
COPY . .
RUN npm run build

RUN apt update
RUN apt install libreoffice --no-install-recommends -y

EXPOSE 8080

CMD ["node", "./dist/index.js"]