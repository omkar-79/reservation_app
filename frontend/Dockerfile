# Use the official Node.js image for build stage
FROM node:22 

# Create and change to the app directory

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]

