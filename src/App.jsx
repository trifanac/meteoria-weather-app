import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const apiKey = import.meta.env.VITE_API_KEY;

  const [data, setData] = useState({});
  const [location, setLocation] = useState("");

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`;

  const searchLocation = (event) => {
    if (event.key === "Enter") {
      axios.get(url).then((response) => {
        setData(response.data);
        console.log(response.data);
      });
      setLocation("");
    }
  };

  return (
    <div>
      <div>
        <input
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          onKeyPress={searchLocation}
          type="text"
          placeholder="Enter location here"
        />
      </div>
      <div>{data.name}</div>
    </div>
  );
};

export default App;
