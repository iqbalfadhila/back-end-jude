# Build dependencies
FROM node:17-alpine as dependencies
WORKDIR /src
COPY package.json .
RUN npm i
COPY . . 
# Build production image
FROM dependencies as builder
RUN npm run build
EXPOSE 3000
CMD npm run start