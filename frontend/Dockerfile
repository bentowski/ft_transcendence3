FROM node:alpine

WORKDIR /home/node/www

COPY --chown=node:node ./react/package*.json ./

RUN npm install && npm install react@latest react-dom@latest

COPY --chown=node:node ./react ./

USER node

CMD ["npm", "start"]
