import React, { useState } from "react";
import axios from "axios";
import Logo from "./assets/Vector.png";

const App = () => {
  const apiKey = import.meta.env.VITE_API_KEY;

  const [data, setData] = useState({});
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`;

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

  return (
    <div className="bg-gradient-to-br from-cyan-500 to bg-yellow-500 min-h-screen flex flex-col items-center justify-center">
      <div className="bg-white rounded p-8 shadow-lg w-full sm:max-w-md">
        <div className="flex items-center justify-center mb-6">
          <img src={Logo} alt="" className="w-1/5" />
        </div>

        <div className="flex items-center justify-center mb-6">
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
            className="bg-cyan-500 text-white py-4 px-6 rounded-r focus:outline-none hover:bg-cyan-600 transition duration-300"
          >
            Search
          </button>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 gap-6">
          <div className="flex flex-col items-center justify-center">
            {data.name && (
              <h2 className="text-3xl font-bold text-cyan-500 mb-4">
                {data.name}
              </h2>
            )}
            {data.main && (
              <h3 className="text-5xl font-bold text-cyan-700">
                {data.main.temp.toFixed()} °C
              </h3>
            )}
          </div>
          <div className="flex flex-col items-center justify-center">
            {data.main && (
              <div>
                <h3 className="text-2xl text-gray-800 mb-2">
                  Feels Like: {data.main.feels_like.toFixed()} °C
                </h3>
                <h3 className="text-2xl text-gray-800 mb-2">
                  Humidity: {data.main.humidity} %
                </h3>
                {data.wind && (
                  <h3 className="text-2xl text-gray-800">
                    Wind Speed: {data.wind.speed} KM/H
                  </h3>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
