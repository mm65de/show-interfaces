# syntax=docker/dockerfile:1

FROM node:latest
WORKDIR .
COPY package.json       package.json
COPY showInterfaces.js  showInterfaces.js
COPY Dockerfile         Dockerfile
RUN yarn install --production
CMD ["node", "showInterfaces.js"]
EXPOSE 3000

