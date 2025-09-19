import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const cities = [
    { name: "Stockholm", id: 2673730 },
    { name: "Göteborg", id: 2711537 },
    { name: "Malmö", id: 2692969 },
  ];

  const [weatherData, setWeatherData] = useState<{ [key: number]: any }>({});

  useEffect(() => {
    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

    cities.forEach((city) => {
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?id=${city.id}&appid=${apiKey}&units=metric&lang=se`
      )
        .then((response) => response.json())
        .then((data) => {
          setWeatherData((prevData) => ({
            ...prevData,
            [city.id]: data,
          }));
        })
        .catch((error) => {
          console.error("Error fetching weather data:", error);
        });
    });
  }, []);

  // ✅ JSX ska ligga här UTANFÖR useEffect
  return (
    <>
      <h1>Världens bästa väderapp</h1>
      {cities.map((city) => (
        <div key={city.id}>
          <h3>{city.name}</h3>
          <p>Temperatur: {weatherData[city.id]?.main.temp}°C</p>
          <p>Väder: {weatherData[city.id]?.weather[0].description}</p>
        </div>
      ))}
    </>
  );
}

export default App;

