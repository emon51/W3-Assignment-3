# Flight Data API

A simple Node.js API to fetch flight related data from Booking.com and save in a PostgreSQL database using Docker.


## Features
- Fetch flight locations and flight details via RapidAPI  
- Store flight data in PostgreSQL running in Docker  
- Simple Express server with ready-to-use routes  


## Setup

1. **Start PostgreSQL with Docker**
```
docker compose up -d
```

2. **Install Node.js dependencies**
```
npm install
```
## Collect Flight Data
1. **Run the server**
```
node flight-server.js
```

2. **Fetch flight data**
   - Uncomment (line: 148) and run run() function in flight-server.js to retrieve and save flight details information in PostgreSQL database.
  

## Collect Attraction Data
1. **Run the server**
```
node attraction-server.js
```

2. **Fetch Attraction data**
   - After first step done data will be saved as a csv file.
