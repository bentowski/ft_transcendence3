FROM node:alpine

#RUN	 adduser test

WORKDIR /var/www

COPY ./react/package*.json ./

RUN npm ci

RUN npm install react@latest react-dom@latest

COPY ./react ./

#USER test

EXPOSE	8080

CMD ["npm", "start"]
