
import { useState, useEffect } from 'react';
import './App.css';
import CityDetails from './components/CityDetails';

function App() {
  const cities = [
    { name: "Stockholm", id: 2673730 },
    { name: "Göteborg", id: 2711537 },
    { name: "Malmö", id: 2692969 },
  ];

  
  const [weatherData, setWeatherData] = useState<{ [key: number]: any }>({});

  
  const [selectedCity, setSelectedCity] = useState<{ id: number; name: string } | null>(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
    if (!apiKey) {
      console.warn('VITE_OPENWEATHER_API_KEY saknas i miljön');
      return;
    }

    
    cities.forEach((city) => {
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?id=${city.id}&appid=${apiKey}&units=metric&lang=se`
      )
        .then((response) => {
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          return response.json();
        })
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

  
  if (selectedCity) {
    return (
      <div style={{ padding: 16 }}>
        <button onClick={() => setSelectedCity(null)} style={{ marginBottom: 12 }}>
          ← Tillbaka
        </button>
        <CityDetails cityId={selectedCity.id} cityName={selectedCity.name} />
      </div>
    );
  }

  
  return (
    <div style={{ padding: 16 }}>
      <h1>Världens bästa väderapp</h1>
      {cities.map((city) => (
        <div
          key={city.id}
          onClick={() => setSelectedCity(city)}
          style={{ cursor: "pointer", padding: 12, border: "1px solid #ddd", marginBottom: 8, borderRadius: 6 }}
        >
          <h3 style={{ margin: 0 }}>{city.name}</h3>
          <p style={{ margin: "6px 0 0 0" }}>
            Temperatur: {weatherData[city.id]?.main?.temp ?? '–'}°C
          </p>
          <p style={{ margin: "4px 0 0 0", color: "#555" }}>
            Väder: {weatherData[city.id]?.weather?.[0]?.description ?? '–'}
          </p>
        </div>
      ))}
    </div>
  );
}

export default App;

