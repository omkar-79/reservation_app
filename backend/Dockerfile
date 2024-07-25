
FROM node:14

WORKDIR /Users/omkar/Documents/Project/Reservation App


COPY package*.json ./
RUN npm install


COPY . .


EXPOSE 3000


CMD ["node", "server.js"]
