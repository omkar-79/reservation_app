# myKerchief - Sports Ground Reservation System
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=flat&logo=javascript&logoColor=%23F7DF1E) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=flat&logo=node.js&logoColor=white) ![React](https://img.shields.io/badge/React-%2361DAFB.svg?style=flat&logo=react&logoColor=white) ![REST API](https://img.shields.io/badge/REST%20API-%232c3e50.svg?style=flat&logo=api&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=flat&logo=docker&logoColor=white)  ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=flat&logo=mongodb&logoColor=white)


A web application to reserve sports facilities like tennis courts, basketball courts, and more. Built with React.js, Node.js, Express, and MongoDB.

![App Screenshot](https://i.imgur.com/mdye1Tq.jpeg)

## Features

- 🏃‍♂️ User Authentication (Login/Signup)
- 🗺️ Interactive Map View of Sports Facilities
- 📅 Real-time Reservation System
- 👥 Dual User Roles:
  - Facility Owner: Can register and manage sports facilities
  - Regular User: Can browse and reserve sports facilities
- 📍 Geolocation Support
- 🔍 Search Functionality
- 👤 User Profile Management

## Tech Stack

- **Frontend**: React.js, Bootstrap, Leaflet Maps
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Containerization**: Docker
- **Reverse Proxy**: Nginx

## Prerequisites

- Docker and Docker Compose
- Node.js (for local development)
- MongoDB (handled by Docker)

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/yourusername/mykerchief.git
cd mykerchief
```
2. Build and run the docker-compose:
```
docker-compose build
docker-compose up
```

