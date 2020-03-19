FROM node:alpine

WORKDIR /usr/src/app
COPY . /usr/src/app
RUN rm -rf .env && rm -rf yarn.lock && rm -rf node_modules && npm install pm2 -g
RUN yarn

CMD ["pm2-runtime", "ecosystem.config.js"]
