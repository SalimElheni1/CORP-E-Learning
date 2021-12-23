//Import express model
const express = require('express');
//Import course module
const axios = require('axios');
//
const router = express.Router();
router.post('/', (req, res) => {
    const city = req.body.city;
    const apiKey = "62ee756a34835483299877a61961cafb";
    const apiUrl =
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&appid=" +
        apiKey + "&units=metric";
    axios
        .get(apiUrl)
        .then((response) => {
            console.log('Here response', response);
            //const weather = response.data.main;
            console.log('Here weather main', response.data.weather);
            const result = {
                message: `Le meteo de ${city}`,
                temp: response.data.main.temp_min,
                pressure: response.data.main.temp_max,
                windSpeed: response.data.wind.speed,
                icon: response.data.weather[0].icon
            }
            res.status(200).json({
                result: result
            })
        });
});
//Rend router exportable
module.exports = router;