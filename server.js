'use strict';

// requiring libraries (express, dotenv, cors)
const express = require('express');
require('dotenv').config();
const cors = require('cors');

// superagent goes and gets API data for us
const superagent = require('superagent');

// invoking express, setting port, using cors
const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());

// telling our app to begin serving on PORT
app.listen(PORT, () => console.log(`listening on port ${PORT}!`));



// ----------------ROUTES-------------------
// making location route:
app.get('/location', (req, res) => {
  try {
    // get the city name they entered
    const city = req.query.data;
    // make locationObj which is returned to front end, and which includes the city name, lat/long, and formatted address
    searchLatToLong(city, res);
    // res.send(locationObj);
    // console.log(locationObj);
  }
  catch (error) {
    console.error(error);

    Response.status(500).send('oh nooooo something went wrong!');
  }
});

function searchLatToLong(city, response) {
  // get the json data (from file at this point, eventually from API)
  // const geoData = require('./data/geo.json');

  let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=${process.env.GEOCODE_API_KEY}`
  superagent.get(url)
    .then(results => {
      // console.log(results.body.geometry)
      const locationObj = new Location(city, results.body);

      response.send(locationObj);
    });


  // const geoDataResults = geoData.results[0];

}

// the constructor that takes in the selected part of the served results, and creates a formatted object instance
function Location(city, results) {
  // eslint-disable-next-line camelcase
  this.search_query = city;
  // eslint-disable-next-line camelcase
  this.formatted_query = results.body.results[0].formatted_address;
  this.latitude = results.body.results.geometry.location.lat;
  this.longitude = results.body.results.geometry.location.lng;
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
