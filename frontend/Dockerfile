#---- Dockerfile for Frontend ----

# Using the official Node.js image with Alpine Linux as the base image
FROM node:21.1.0-alpine

WORKDIR /app

# Copying package-lock.json and package.json
COPY package*.json ./

RUN npm install

COPY . .

# The application runs on the following port 5173
EXPOSE 5173

CMD ["npm" , "start"]

