# Flight Data API

A simple Node.js API to fetch flight data from Booking.com and save it in a PostgreSQL database using Docker.

---

## Features
- Fetch flight locations and flight details via RapidAPI  
- Store flight data in PostgreSQL running in Docker  
- Simple Express server with ready-to-use routes  

---

## Setup

1. **Start PostgreSQL with Docker**
```bash
docker compose up -d
```

2. **Install Node.js dependencies**
```
npm install
```
3. **Run the server**
   ```
   node attraction-server.js
```

```
4. **Fetch flight data**
   Uncomment and run run() in attraction-server.js to save flight details in PostgreSQL.
