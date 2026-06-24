const express = require("express");
const axios = require("axios");

const app = express();

const weatherCodes = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  56: "Light freezing drizzle",
  57: "Dense freezing drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Light freezing rain",
  67: "Heavy freezing rain",
  71: "Slight snow fall",
  73: "Moderate snow fall",
  75: "Heavy snow fall",
  77: "Snow grains",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  85: "Slight snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail",
};

app.get("/weather", async (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.status(400).json({ error: "City name is required. Usage: /weather?city=London" });
  }

  try {
    const geo = await axios.get("https://geocoding-api.open-meteo.com/v1/search", {
      params: { name: city, count: 1 },
    });

    if (!geo.data.results || geo.data.results.length === 0) {
      return res.status(404).json({ error: `City not found: ${city}` });
    }

    const { name, latitude, longitude } = geo.data.results[0];

    const weather = await axios.get("https://api.open-meteo.com/v1/forecast", {
      params: {
        latitude,
        longitude,
        current: "temperature_2m,relative_humidity_2m,weather_code",
      },
    });

    const { temperature_2m, relative_humidity_2m, weather_code } = weather.data.current;

    res.json({
      city: name,
      temperature: temperature_2m,
      humidity: relative_humidity_2m,
      condition: weatherCodes[weather_code] || "Unknown",
    });
  } catch (err) {
    if (err.response?.status === 404) {
      return res.status(404).json({ error: `City not found: ${city}` });
    }
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Weather API server running on port ${PORT}`);
});
