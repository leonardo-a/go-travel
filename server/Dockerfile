
FROM node:19.9-alpine3.18

WORKDIR /usr/app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3333

CMD ["npm", "run", "dev:docker"]