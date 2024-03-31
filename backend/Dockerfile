#---- Dockerfile for Backend ----

# Using the official Node.js image with Alpine Linux as the base image
FROM node:21-alpine

WORKDIR /app

# Copying package.json
COPY package.json .

RUN npm install

COPY . .

EXPOSE 3005

CMD ["npm" , "start"]

