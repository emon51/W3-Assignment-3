
CREATE TABLE flight (
  id SERIAL PRIMARY KEY,
  flight_name TEXT,
  arrival_airport TEXT,
  departure_airport TEXT,
  arrival_time TEXT,
  departure_time TEXT,
  flight_logo TEXT,
  fare NUMERIC,
  country TEXT
);




INSERT INTO flight
(
  flight_name,
  arrival_airport,
  departure_airport,
  arrival_time,
  departure_time,
  flight_logo,
  fare,
  country
)
VALUES
(
  'SpiceJet',
  'Delhi International Airport',
  'Chhatrapati Shivaji International Airport Mumbai',
  '2026-01-15T08:55:00',
  '2026-01-15T06:45:00',
  'https://r-xx.bstatic.com/data/airlines_logo/SG.png',
  60,
  'India'
),
(
  'IndiGo',
  'Delhi International Airport',
  'Chhatrapati Shivaji International Airport Mumbai',
  '2026-01-15T08:05:00',
  '2026-01-15T06:05:00',
  'https://r-xx.bstatic.com/data/airlines_logo/6E.png',
  65,
  'India'
),
(
  'IndiGo',
  'Delhi International Airport',
  'Chhatrapati Shivaji International Airport Mumbai',
  '2026-01-15T21:15:00',
  '2026-01-15T19:10:00',
  'https://r-xx.bstatic.com/data/airlines_logo/6E.png',
  65,
  'India'
),
(
  'SpiceJet',
  'Delhi International Airport',
  'Chhatrapati Shivaji International Airport Mumbai',
  '2026-01-15T09:40:00',
  '2026-01-15T07:20:00',
  'https://r-xx.bstatic.com/data/airlines_logo/SG.png',
  60,
  'India'
),
(
  'SpiceJet',
  'Delhi International Airport',
  'Chhatrapati Shivaji International Airport Mumbai',
  '2026-01-16T01:25:00',
  '2026-01-15T23:05:00',
  'https://r-xx.bstatic.com/data/airlines_logo/SG.png',
  60,
  'India'
);



SELECT * FROM flight;


