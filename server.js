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

// define location route------------------------------
app.get('/location', locationHandler);

// locationHandler, which contains the superagent.get, which contains .then and .catch. The .then uses the constructor to create location instances
function locationHandler(req, res) {
  let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${req.query.data}&key=${process.env.GEOCODE_API_KEY}`;
  superagent.get(url)
    .then(data => {
      const geoData = data.body;
      const locationObj = new Location(req.query.data, geoData);
      res.send(locationObj);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
}

// the constructor that takes in the selected part of the served results, and creates a formatted object instance
function Location(city, geoData) {
  // eslint-disable-next-line camelcase
  this.search_query = city;
  // eslint-disable-next-line camelcase
  this.formatted_query = geoData.results[0].formatted_address;
  this.latitude = geoData.results[0].geometry.location.lat;
  this.longitude = geoData.results[0].geometry.location.lng;
}


// define weather route--------------------------------
app.get('/weather', weatherHandler);

// weatherHandler, which contains the superagent.get, which contains .then and .catch. The .then uses the constructor to create location instances
function weatherHandler(req, res) {
  let url = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${req.query.data.latitude},${req.query.data.longitude}`;
  superagent.get(url)
    .then(data => {
      const weatherData = data.body.daily.data.map((value) => new Weather(value.summary, value.time));
      res.send(weatherData);
    });

}

// constructor to format the served data for our front-end
function Weather(forecast, time) {
  this.time = new Date(time * 1000).toDateString();
  this.forecast = forecast;
}

// page not found route
app.get('*', (req, res) => {
  res.status(404).send('Oh noes, page not found!');
});
