# Use the official Node.js image
FROM node:22

# Create and change to the app directory
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npx", "nodemon", "server.js"]
