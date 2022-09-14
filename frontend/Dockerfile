FROM node:alpine

WORKDIR /home/node/www/

COPY ./react/package*.json ./

RUN npm ci && npm install react@latest react-dom@latest

COPY ./react ./

USER node

EXPOSE	8080

CMD ["npm", "start"]
