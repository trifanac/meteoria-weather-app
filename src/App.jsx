import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";

const App = () => {
  const apiKey = import.meta.env.VITE_API_KEY;

  const [data, setData] = useState({});
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [unit, setUnit] = useState("metric"); // Default unit is metric (Celsius)

  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=${unit}&appid=${apiKey}`;

  const searchLocation = () => {
    if (location) {
      axios
        .get(url)
        .then((response) => {
          setData(response.data);
          setError("");
        })
        .catch((error) => {
          setError("Please enter a valid location.");
          setData({});
          console.log(error);
        });
      setLocation("");
    } else {
      setError("Please enter a location.");
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          axios
            .get(
              `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=${unit}&appid=${apiKey}`
            )
            .then((response) => {
              setData(response.data);
              setError("");
            })
            .catch((error) => {
              setError("Failed to fetch weather data for your location.");
              setData({});
              console.log(error);
            });
        },
        () => {
          setError("Failed to retrieve your location.");
        }
      );
    } else {
      setError(
        "Geolocation is not supported by your browser. Please enter a location manually."
      );
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []); // Only fetch the user's location once

  const toggleUnit = () => {
    setUnit((prevUnit) => (prevUnit === "metric" ? "imperial" : "metric"));
  };

  const renderForecast = () => {
    if (data.city) {
      const today = new Date().toLocaleDateString();
      const forecastData = data.list.reduce((acc, forecast) => {
        const date = new Date(forecast.dt_txt);
        const forecastDate = date.toLocaleDateString();

        if (!acc[forecastDate]) {
          const day = date.toLocaleDateString(undefined, { weekday: "short" });
          const temperature =
            unit === "metric"
              ? forecast.main.temp.toFixed()
              : convertTemperature(forecast.main.temp).toFixed();
          const description = forecast.weather[0].description;

          acc[forecastDate] = {
            day,
            temperature,
            description,
          };
        }

        return acc;
      }, {});

      return Object.entries(forecastData).map(([date, forecast]) => {
        const isToday = date === today;

        return (
          <div className="bg-white rounded-lg shadow-md p-6" key={date}>
            <h3 className="text-lg font-bold mb-1">
              {isToday ? "Today" : forecast.day}
            </h3>
            <p className="text-gray-700 mb-2">{forecast.description}</p>
            <h3 className="text-xl font-bold text-blue-800">
              {forecast.temperature} {unit === "metric" ? "°C" : "°F"}
            </h3>
          </div>
        );
      });
    } else {
      return null;
    }
  };

  const convertTemperature = (celsius) => {
    return (celsius * 9) / 5 + 32;
  };

  return (
    <div className="bg-blue-200 min-h-screen flex items-center justify-center">
      <div className="bg-blue-50 rounded-lg p-8 shadow-lg w-full sm:max-w-md">
        <div className="flex justify-center items-center mb-6">
          <div>
            <h1 className="text-blue-500 font-bold text-4xl">Meteoria</h1>
          </div>
        </div>
        <div className="flex items-stretch justify-center mb-6">
          <input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            onKeyPress={(event) => {
              if (event.key === "Enter") searchLocation();
            }}
            type="text"
            placeholder="Enter location here"
            className="p-4 border border-gray-300 rounded-l w-full sm:w-64 focus:outline-none"
          />
          <button
            onClick={searchLocation}
            className="bg-blue-500 text-white px-6 rounded-r focus:outline-none hover:bg-blue-600 transition duration-300 mr-2"
          >
            <FaSearch />
          </button>
          <button
            onClick={toggleUnit}
            className="bg-blue-500 text-white px-6 rounded focus:outline-none hover:bg-blue-600 transition duration-300"
          >
            {unit === "metric" ? "°C" : "°F"}
          </button>
        </div>
        {error && error !== "Please enter a location." && !unit && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        {error === "Please enter a valid location." && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        <div className="flex items-center mb-4">
          {data.city && (
            <p className="text-gray-700">
              Location: {data.city.name}, {data.city.country}
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {renderForecast()}
        </div>
      </div>
    </div>
  );
};

export default App;
