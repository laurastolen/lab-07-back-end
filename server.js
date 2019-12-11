'use strict';

const express = require('express');
require('dotenv').config();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());

app.listen(PORT, () => console.log(`listening on port ${PORT}!`));

// ----------------ROUTES:-------------------
// location route:
app.get('/location', (req, res) => {
  let city = req.query.data;
  let locationObj = searchLatToLong(city);
  res.send(locationObj);
  console.log(locationObj);
});

function searchLatToLong(city) {
  const geoData = require('./data/geo.json');
  const geoDataResults = geoData.results[0];
  const locationObj = new Location(city, geoDataResults);
  return locationObj;
}

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
  const forecastObj = searchWeather();
  res.send(forecastObj);
  console.log(forecastObj);
});

function searchWeather() {
  const weatherData = require('./data/darksky.json');
  const weatherDataDaily = weatherData.daily.data; // is an array
  const weatherArray = [];
  for (let i = 0; i < weatherDataDaily.length; i++) {
    weatherArray.push(new Weather(weatherDataDaily[i]));
  }
  return weatherArray;
}

function Weather(weatherData) {
  this.time = weatherData.time;
  this.forecast = weatherData.summary;
}

// page not found route
app.get('*', (req, res) => {
  res.status(404).send('page not found!');
});
