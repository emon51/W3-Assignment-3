import express from "express";
import axios from "axios";
import fs from "fs";



const app = express();



//==================================Input==============================================//

const ids = [
  {
    from_id: "BOM.AIRPORT",
    to_id: "DEL.AIRPORT",
    date: "2026-01-15",
  },
];

//================================================================================//


// 0. Root Route
app.get('/', async (req, res) => {
  res.send("API is Running...")

})


// 1. Route Flight-Location
const options = {
  method: 'GET',
  url: 'https://booking-com15.p.rapidapi.com/api/v1/flights/searchDestination',
  params: {query: 'dhaka'},
  headers: {
    'x-rapidapi-key': 'fa24d7f38bmshc872d91d3b9af4fp1242d1jsn77404436cf70',
    'x-rapidapi-host': 'booking-com15.p.rapidapi.com'
  }
};

app.get('/flight-location', async (req, res) => {
    try {
        const response = await axios.request(options);
        console.log(response.data);

        const airports = response.data.data.filter(item => item.type == 'AIRPORT');
        console.log(airports[0]?.id);
        
        res.status(200).json(
            response.data
        );
    } catch (error) {
        console.error(error);
    }
})




async function getFlightTokens(fromId, toId, date) {
  try {
    const response = await axios.get(
      "https://booking-com15.p.rapidapi.com/api/v1/flights/searchFlights",
      {
        params: { fromId, toId, departDate: date },
        headers: {
          "x-rapidapi-key": "fa24d7f38bmshc872d91d3b9af4fp1242d1jsn77404436cf70",
          "x-rapidapi-host": "booking-com15.p.rapidapi.com",
        },
      }
    );
    return response.data?.data?.flightOffers?.map(f => f.token) || [];
  } catch (err) {
    console.error("Token error:", err.message);
    return [];
  }
}

async function getFlightDetails(token) {
  try {
    const response = await axios.get(
      "https://booking-com15.p.rapidapi.com/api/v1/flights/getFlightDetails",
      {
        params: { token },
        headers: {
          "x-rapidapi-key": "fa24d7f38bmshc872d91d3b9af4fp1242d1jsn77404436cf70",
          "x-rapidapi-host": "booking-com15.p.rapidapi.com",
        },
      }
    );

    const d = response.data?.data;
    const seg = d?.segments?.[0];
    const leg = seg?.legs?.[0];
    const carrier = leg?.carriersData?.[0];
    
    return {
      "Flight name": carrier?.name || "N/A",
      "Arrival airport": seg?.arrivalAirport?.name || "N/A",
      "Departure airport": seg?.departureAirport?.name || "N/A",
      "Arrival time": seg?.arrivalTime || "N/A",
      "Departure time": seg?.departureTime || "N/A",
      "Flight logo": carrier?.logo || "N/A",
      "Fare": d?.priceBreakdown?.total?.units || "N/A",
      "Location/Country": seg?.arrivalAirport?.countryName || "N/A",
    };
  } catch (err) {
    console.error("Details error:", err.message);
    return null;
  }
}






async function run() {
  const results = [];

  for (const { from_id, to_id, date } of ids) {
    const tokens = await getFlightTokens(from_id, to_id, date);

    for (const token of tokens.slice(0, 5)) {
      const details = await getFlightDetails(token);
      if (details) results.push(details);
    }
  }

  if (results.length > 0) {
    const header = Object.keys(results[0]).join(",");
    const rows = results.map(obj => Object.values(obj).join(","));
    const csv = [header, ...rows].join("\n");
    fs.writeFileSync("flights.csv", csv);
    console.log(`Data saved as flights.csv (${results.length} flights)`);
  } else {
    console.log("No data to save");
  }
}





// Run to fetch flights data.

//run(); 



app.listen(3001, () => {
  console.log("Server is running on port 3001");
});