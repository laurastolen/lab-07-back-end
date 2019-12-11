'use strict';

// requiring libraries (express, dotenv, cors)
const express = require('express');
require('dotenv').config();
const cors = require('cors');

// invoking express, setting port, using cors
const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());

// telling our app to begin serving on PORT
app.listen(PORT, () => console.log(`listening on port ${PORT}!`));



// ----------------ROUTES-------------------
// making location route:
app.get('/location', (req, res) => {
  // get the city name they entered
  let city = req.query.data;
  // make locationObj which is returned to front end, and which includes the city name, lat/long, and formatted address
  let locationObj = searchLatToLong(city);
  res.send(locationObj);
  console.log(locationObj);
});

function searchLatToLong(city) {
  // get the json data (from file at this point, eventually from API)
  const geoData = require('./data/geo.json');
  // find the part we want
  const geoDataResults = geoData.results[0];
  // use the selected part to make new object instance
  const locationObj = new Location(city, geoDataResults);
  return locationObj;
}

// the constructor that takes in the selected part of the served results, and creates a formatted object instance
function Location(city, geoDataResults) {
  // eslint-disable-next-line camelcase
  this.search_query = city;
  // eslint-disable-next-line camelcase
  this.formatted_query = geoDataResults.formatted_address;
  this.latitude = geoDataResults.geometry.location.lat;
  this.longitude = geoDataResults.geometry.location.lng;
}


// weather route
app.get('/weather', (req, res) => {
  // get the weather data (from local file, eventually API) and format via constructor to return to front end
  const forecastObj = searchWeather();
  res.send(forecastObj);
  console.log(forecastObj);
});

// fx to get the data, make instances via constructor, and return formatted info for front end
function searchWeather() {
  const weatherData = require('./data/darksky.json');
  const weatherDataDaily = weatherData.daily.data; // is an array

  const weatherArray = weatherDataDaily.map((value) => {
    return new Weather(value);
  });

  return weatherArray;
}

// constructor to format the served data for our front-end
function Weather(weatherData) {
  this.time = weatherData.time;
  this.forecast = weatherData.summary;
}

// page not found route
app.get('*', (req, res) => {
  res.status(404).send('Oh noes, page not found!');
});
